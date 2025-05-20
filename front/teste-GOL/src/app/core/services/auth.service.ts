import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string {
    const pass = environment.authTokenPass;
    const key = CryptoJS.enc.Base64.parse(environment.authTokenKey);
    const iv = CryptoJS.enc.Utf8.parse(environment.authTokenIv);

    const encrypted = CryptoJS.AES.encrypt(pass, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
    });

    return encrypted.toString();
  }
}
