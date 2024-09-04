import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './setting-tabs.component.html',
  styleUrl: './setting-tabs.component.scss'
})
export class SettingTabsComponent {

  tabs: Tab[] = [
    { name: 'general', label: 'General', path: '/company-settings' },
    { name: 'security', label: 'Seguridad', path: '/company-settings/security' },
    { name: 'appereance', label: 'Apariencia', path: '/company-settings/appereance' }
  ];

  @Input() currentTab?: string = 'general';

  constructor(private _router: Router) { }


  navigate(tab: Tab) {
    this._router.navigate([tab.path]);
    this.currentTab = tab.name;
  }
}

interface Tab {
  name: string;
  label: string;
  path: string;
}