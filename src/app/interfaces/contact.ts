import { SafeUrl } from '@angular/platform-browser';

export interface Contact {
    id: string,
    raw_contact_id: string,
    firstName: string,
    lastName: string,
    mobileNumber: string,
    notes: string
    image?: SafeUrl;
}
