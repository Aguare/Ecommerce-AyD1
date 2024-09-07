import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';


type Tab = {
  id: number;
  name: string;
}

@Component({
  selector: 'app-setting-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './setting-tabs.component.html',
  styleUrl: './setting-tabs.component.scss'
})
export class SettingTabsComponent implements OnInit{

  tabs: Tab[] = [];

  @Input() currentTab?: string = 'General';

  constructor(private _router: Router, private companyService: CompanyService) { }

  ngOnInit() {
    this.companyService.getTabs().subscribe((tabs: Tab[]) => {
      console.log(tabs);
      this.tabs = tabs;
    });
  }

  navigate(tab: Tab) {
    // this._router.navigate([`/company-settings/${tab.name}`]);
    // this.currentTab = tab.name;
    this._router.navigate([`company-settings/${tab.name}`]).then(() => {
      this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this._router.navigate([`company-settings/${tab.name}`]);
      });
    });
    this.currentTab = tab.name;
  }
}