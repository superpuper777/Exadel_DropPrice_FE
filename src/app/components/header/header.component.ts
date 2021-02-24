import { Component, ViewEncapsulation} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { AuthInfo } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header-test.component.html',
  styleUrls: ['./header-test.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class HeaderComponent {
  public langs: string[] = environment.locales;
  defaultLang: string = localStorage.getItem('currentLang') ?? environment.defaultLocale;
  authUser$: Observable<AuthInfo> = this.auth.authUser;
  active: boolean;
  

  constructor(
    public translateService: TranslateService,
    private auth: AuthService) {
  }

  languageHandler(selectedLang: string): void {
    localStorage.setItem('currentLang', selectedLang);
    this.translateService.use(selectedLang);
  }

  logoutHandler(): void {
    this.toggleActive();
    this.auth.logout();
  }

  toggleActive(): boolean {
    return this.active = !this.active;
  }
}
