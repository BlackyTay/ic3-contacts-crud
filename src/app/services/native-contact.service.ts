import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Contact } from '../interfaces/contact';
import { Contacts, ContactFieldType, ContactFindOptions, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { WebView } from '@ionic-native/ionic-webview/ngx'
@Injectable({
  providedIn: 'root'
})
export class NativeContactService {
  contactFieldType: ContactFieldType[] = ["*"];
  contactFieldId: ContactFieldType[] = ['rawId'];
  public contactlist: Contact[] = [];
  public loaded: boolean = false;

  constructor(private storage: Storage, private contacts: Contacts, private sanitizer: DomSanitizer, private webView: WebView) { }

  public load(): Promise<boolean> {
    return new Promise((resolve) => {
      this.contacts.find(
        this.contactFieldType,
        {multiple:true, hasPhoneNumber:true}
      ).then((contacts) => {
        contacts.forEach((contact) => {
          let tempC: Contact = {
            'id': contact.id,
            'raw_contact_id': contact.rawId,
            'firstName': contact.name.givenName,
            'lastName': contact.name.familyName,
            'mobileNumber': contact.phoneNumbers[0].value.toString(),
            'notes': contact.note
          }
          this.contactlist.push(tempC);
          let index = this.contactlist.indexOf(tempC);
          if(contact.photos != null){
            this.contactlist[index].image = this.webView.convertFileSrc(contact.photos[0].value);
            // this.contactlist[index].image = this.sanitizer.bypassSecurityTrustUrl(contact.photos[0].value);
          } else {
            this.contactlist[index].image = 'assets/icon/favicon.png';
          }
          console.log('Contact get', this.contactlist[index], ' : ', contact);
        });
      });

        this.loaded = true;
        resolve(true);
      });
  }
  

  public save(data:Contact): void {
    // this.storage.set('contacts', this.contactlist);
    let options = new ContactFindOptions();
    console.log(data);
    options.filter = data.raw_contact_id;
    options.multiple = true;
    this.contacts.find(this.contactFieldId, options).then((contact) => {
      let bool = false;
      // if(contact[0] != null){
      //   contact[0].name.familyName = data.firstName;
      //   contact[0].name.givenName = data.lastName;
      //   contact[0].phoneNumbers[0] = new ContactField('mobile', data.mobileNumber);
      //   contact[0].note = data.notes;
      //   contact[0].save();
      // } else {
      //   this.contacts.create();
      //   this.save(data);
      // }

      contact.forEach((c) => {
        console.log(c.rawId, ' :: ', data.raw_contact_id);
          console.log(c);
        if(c.rawId == data.raw_contact_id){
          console.log(c.name);
            c.name = new ContactName(null, data.lastName, data.firstName);
            console.log(c.name);
            c.displayName = data.firstName+' '+data.lastName;
            c.nickname = data.firstName;
            // c.name.familyName = data.firstName;
            // c.name.givenName = data.lastName;
            c.phoneNumbers= [new ContactField('mobile', data.mobileNumber)];
            c.note = data.notes;
            c.save().then(()=>console.log(c));
            console.log('Contact Modified');
            bool = true;
        }
      }
      );

      if(!bool) {
        console.log('Contact Not Exist');
        let newc = this.contacts.create();
        newc.name = new ContactName(null, '', '');
        newc.displayName = '';
        newc.nickname = '';
        newc.note = '';
        newc.save().then(() =>{
          data.raw_contact_id = newc.rawId;
          this.save(data);
        } );
        // newc.id = data.id;
        // data.raw_contact_id = newc.rawId;
        // console.log(data.raw_contact_id, " : ", newc.rawId);
        // this.save(data);
      }
    })
  }

  public getContact(id): Contact {
    return this.contactlist.find(contact => contact.id === id);
  }

  public createContact(): string {
    let id = (Math.max(...this.contactlist.map(contact => parseInt(contact.id)), 0) + 1).toString();
    
    this.contactlist.push({
      id: id,
      raw_contact_id: id,
      firstName: '',
      lastName: '',
      mobileNumber: '',
      notes: ''
    });

    // this.save(this.getContact(id));
    return id;
  }

  public deleteContact(contact): void {
    let index = this.contactlist.indexOf(contact);
    let options = new ContactFindOptions();
    options.filter = contact.id;
    options.multiple = true;
    this.contacts.find(this.contactFieldId, options).then((c) => {
      c.forEach((cd) => {
        if(cd.rawId == contact.raw_contact_id){
          cd.remove();
        }
      })
    });

    if(index > -1){
      this.contactlist.splice(index, 1);
    }

  }
}
