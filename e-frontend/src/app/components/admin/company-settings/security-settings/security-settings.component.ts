import { Component } from '@angular/core';
import { SettingTabsComponent } from '../setting-tabs/setting-tabs.component';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [SettingTabsComponent],
  templateUrl: './security-settings.component.html',
  styleUrl: './security-settings.component.scss'
})
export class SecuritySettingsComponent {

}
