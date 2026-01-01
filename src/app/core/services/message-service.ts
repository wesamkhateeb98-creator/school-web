import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class MessageService{
    sendMessageToWhatsapp(phonenumber:string,content:string ){
  
    // Encode the message for a URL
    const encodedMessage = encodeURIComponent(content);
    
    // Create the WhatsApp link
    // Note: 'wa.me' is the modern, universal link format
    const whatsappUrl = `https://wa.me/${phonenumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }

} 

