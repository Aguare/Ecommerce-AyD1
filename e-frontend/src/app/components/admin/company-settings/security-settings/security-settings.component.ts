import { Component } from '@angular/core';
import { SettingTabsComponent } from '../setting-tabs/setting-tabs.component';
import { NavbarComponent } from '../../../commons/navbar/navbar.component';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [SettingTabsComponent, NavbarComponent],
  templateUrl: './security-settings.component.html',
  styleUrl: './security-settings.component.scss'
})
export class SecuritySettingsComponent {

}
