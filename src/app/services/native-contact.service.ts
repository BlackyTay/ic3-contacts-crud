import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Contact } from '../interfaces/contact';
import { Contacts, ContactFieldType, ContactFindOptions, ContactField } from '@ionic-native/contacts/ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class NativeContactService {
  contactFieldType: ContactFieldType[] = ["*"];
  contactFieldId: ContactFieldType[] = ['rawId'];
  public contactlist: Contact[] = [];
  public loaded: boolean = false;

  constructor(private storage: Storage, private contacts: Contacts, private sanitizer: DomSanitizer) { }

  public load(): Promise<boolean> {
    return new Promise((resolve) => {
      this.contacts.find(
        this.contactFieldType,
        {multiple:true, hasPhoneNumber:true}
      ).then((contacts) => {
        contacts.forEach((contact) => {
          this.contactlist.push({
            'id': contact.id,
            'raw_contact_id': contact.rawId,
            'firstName': contact.name.givenName,
            'lastName': contact.name.familyName,
            'mobileNumber': contact.phoneNumbers[0].value.toString(),
            'notes': contact.note
          });
          console.log('Contact get');
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
        if(c.rawId == data.raw_contact_id){
            c.name.familyName = data.firstName;
            c.name.givenName = data.lastName;
            c.phoneNumbers[0] = new ContactField('mobile', data.mobileNumber);
            c.note = data.notes;
            c.save();
            console.log('Contact Saved');
        }
      }
      );
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

    this.save(this.getContact(id));
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
