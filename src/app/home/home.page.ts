import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ToastController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { NativeContactService } from '../services/native-contact.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  subscription: any;

  constructor(private contactService: NativeContactService, private toastCtrl: ToastController, private platform: Platform, private router: Router) {}

  ngOnInit() {
    this.contactService.load();
  }

  addContact() {
    let id = this.contactService.createContact();

    this.router.navigate(['/contact/',id]);
  }

  ionViewDidEnter() {
    let backpressedCount = 0;
  this.subscription = this.platform.backButton.subscribe(() => {
    if(backpressedCount+2000 > new Date().getTime()){
        this.toastCtrl.dismiss();
        navigator['app'].exitApp();
    } else {
      this.toastCtrl.create(
        {
          message: 'Press back again to exit',
          duration: 2000,
        }
      ).then((toast) => 
      toast.present() )
    }
    backpressedCount = new Date().getTime();
  } 
  );
  }
}
