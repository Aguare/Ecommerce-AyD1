import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent implements OnInit {

  search = new FormControl('', Validators.required);
  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  searchProduct() {


    if(this.search.invalid) {
      return;
    }

    const value = this.search.value;
    this._router.navigate([`search/${value}`]).then(() => {
      this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this._router.navigate([`search/${value}`]);
      });
    });
    // this._router.navigate(['/search', value]);
  }
}
