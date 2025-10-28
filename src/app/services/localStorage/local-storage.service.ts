import { Injectable } from '@angular/core';
import { Login } from '../../auth/models/login';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  ///Almacena una variable y objeto en local storage
  setData(key: string, value: unknown): void { localStorage.setItem(key, JSON.stringify(value)); }

  ///Obtiene los datos guardados en la variable key
  getData<T = unknown>(key: string): T | null {
    const item = localStorage.getItem(key);
    try {
      if (item) {
        return JSON.parse(item) as T
      }
    } catch (e) {
      console.error(e)
      return null
    }
    return null
  }

  setUser(login: Login) {
    this.setData('userData', login);
  }

  deleteData(key: string): void { localStorage.removeItem(key); }

  //Elimina todos los datos de caché
  deleteAll(): void { localStorage.clear(); }

  getUser(): Login | null {
    return this.getData<Login>('userData');
  }

  getUserToken(): string | null {
    const userData = this.getUser();
    return userData?.token || null;
  }

  isUserLogged(): boolean {
    const userData = this.getUser();
    return userData !== null && !!userData.token;
  }

  deleteUser() {
    this.deleteData('userData')
  }

  esUsuarioExterno() {
    return this.getUser()?.user.user_type === 'EXTERNO'
  }

  exUsuarioInterno() {
    return this.getUser()?.user.user_type === 'INTERNO'
  }

  esAdmin(){
    return this.getUser()?.user.email.toLowerCase() ==='admin@sagem.com'
  }

  getRolUser(){
    return this.getUser()?.roles[0]
  }
}
