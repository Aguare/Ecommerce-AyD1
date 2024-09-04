import { Component } from '@angular/core';
import { SettingTabsComponent } from '../setting-tabs/setting-tabs.component';

@Component({
  selector: 'app-appereance-settings',
  standalone: true,
  imports: [SettingTabsComponent],
  templateUrl: './appereance-settings.component.html',
  styleUrl: './appereance-settings.component.scss'
})
export class AppereanceSettingsComponent {

}
