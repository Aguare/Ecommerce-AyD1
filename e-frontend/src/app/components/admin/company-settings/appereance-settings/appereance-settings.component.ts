import { Component } from '@angular/core';
import { SettingTabsComponent } from '../setting-tabs/setting-tabs.component';
import { NavbarComponent } from '../../../commons/navbar/navbar.component';

@Component({
  selector: 'app-appereance-settings',
  standalone: true,
  imports: [SettingTabsComponent, NavbarComponent],
  templateUrl: './appereance-settings.component.html',
  styleUrl: './appereance-settings.component.scss'
})
export class AppereanceSettingsComponent {

}
