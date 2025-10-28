import { Component, inject } from '@angular/core';
import { VersionService } from '../../services/version.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-version',
  imports: [],
  templateUrl: './version.component.html',
  styleUrl: './version.component.css'
})
export class VersionComponent {
  app = environment.app_prefix
  private versionService = inject(VersionService);

  version: string;
  isProduction: boolean;

  constructor() {
    this.version = this.versionService.getVersion();
    this.isProduction = !this.version.includes('dev');
  }
}