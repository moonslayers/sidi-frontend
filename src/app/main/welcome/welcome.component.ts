import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {
  userName = '';
  userType = '';
  welcomeMessage = '';
  private localStorageService = inject(LocalStorageService);

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    const userData = this.localStorageService.getUser();

    if (userData && userData.user) {
      this.userName = userData.user.name || 'Usuario';
      this.userType = userData.user.user_type;
      this.setWelcomeMessage();
    } else {
      this.userName = 'Invitado';
      this.userType = 'EXTERNO';
      this.welcomeMessage = 'Bienvenido al Sistema';
    }
  }

  private setWelcomeMessage() {
    const greetings = [
      '¡Hola', '¡Bienvenido/a', '¡Qué bueno verte', '¡Saludos'
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    this.welcomeMessage = `${randomGreeting}, ${this.userName}!`;
  }

  isInternalUser(): boolean {
    return this.userType === 'INTERNO';
  }

  isExternalUser(): boolean {
    return this.userType === 'EXTERNO';
  }
}