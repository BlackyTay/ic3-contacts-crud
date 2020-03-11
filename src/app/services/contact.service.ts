import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Contact } from '../interfaces/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  public contacts: Contact[] = [];
  public loaded: boolean = false;

  constructor(private storage: Storage) { }

  public load(): Promise<boolean> {
    return new Promise((resolve) => {
      this.storage.get('contacts').then((contacts) => {
        if(contacts != null) {
          this.contacts = contacts;
        }

        this.loaded = true;
        resolve(true);
      });
    });
  }

  public save(): void {
    this.storage.set('contacts', this.contacts);
  }

  public getContact(id): Contact {
    return this.contacts.find(contact => contact.id === id);
  }

  public createContact(): string {
    let id = Math.max(...this.contacts.map(contact => parseInt(contact.id)), 0) + 1;
    
    this.contacts.push({
      id: id.toString(),
      firstName: '',
      lastName: '',
      mobileNumber: '',
      notes: ''
    });

    this.save();
    return id.toString();
  }

  public deleteContact(contact): void {
    let index = this.contacts.indexOf(contact);

    if(index > -1){
      this.contacts.splice(index, 1);
      this.save();
    }
  }
}
