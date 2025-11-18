import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // <--- استيراد هذه الدالة
import { AuthModel } from '../model/auth-model';

const AUTH = "auth"

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isBrowser: boolean; 

  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setAuth(auth:AuthModel){
    if (this.isBrowser) {
      localStorage.setItem(AUTH,JSON.stringify(auth));
    }
  }

  getAuth(): AuthModel|null{
    
    if (!this.isBrowser) {
      return null;
    }
    
    let data = localStorage.getItem(AUTH);
    return data? new AuthModel(JSON.parse(data)) :null;
  }

  removeAuth(){
    if (this.isBrowser) {
      localStorage.removeItem(AUTH);
    }
  }
}