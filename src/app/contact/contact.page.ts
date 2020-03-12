import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { Contact } from '../interfaces/contact';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NativeContactService } from '../services/native-contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  public contact: Contact;

  constructor(private contactService: NativeContactService, private router: Router, private route: ActivatedRoute, private toastCtrl: ToastController) {
    this.contact = {
      id: '',
      raw_contact_id: '',
      firstName: '',
      lastName: '',
      mobileNumber: '',
      notes: ''
    };
  }

  ngOnInit() {
    let contactId = this.route.snapshot.paramMap.get('id');

    if(this.contactService.loaded) {
      this.contact = this.contactService.getContact(contactId);
    } else {
      this.contactService.load().then(() => [
        this.contact = this.contactService.getContact(contactId)
      ]);
    }
  }

  checkContact(): boolean {
    
    if(this.contact.firstName==''){
      this.toastCtrl.create({
        message: 'First Name cannot be empty',
        duration: 500
      }).then((toast) => 
      toast.present());
      return false;
    }
    
    if(this.contact.lastName==''){
      this.toastCtrl.create({
        message: 'Last Name cannot be empty',
        duration: 500
      }).then((toast) => 
      toast.present());
      return false;
    }
    
    if(this.contact.mobileNumber==''){
      this.toastCtrl.create({
        message: 'Mobile Number cannot be empty',
        duration: 500
      }).then((toast) => 
      toast.present());
      return false;
    }
    
    return true;
  }

  saveContact() {
    this.contactService.save(this.contact);

    if(this.checkContact()){
      this.toastCtrl.create({
        message: 'Contact Saved',
        duration: 500
      }).then((toast)=> toast.present());
      this.router.navigate(['./contacts']);
    }
  }

  deleteContact() {
    this.contactService.deleteContact(this.contact);
    this.toastCtrl.create({
      message: 'Contact Deleted',
      duration: 500
    }).then((toast)=> toast.present());
    this.router.navigate(['./contacts']);
  }
}
