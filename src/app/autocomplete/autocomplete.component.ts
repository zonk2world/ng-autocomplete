import {
  Component,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { of, fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  HttpClient,
} from '@angular/common/http';

@Component({
  selector: 'app-autocomplete',
  styleUrls: ['./autocomplete.component.css'],
  template: `
    <div class="wraper">
      <div class="control" [class.is-loading]="isSearching">
        <input
          id="search-items-input"
          #searchItemsInput
          type="text"
          autocomplete="off"
          (click)="showSearches = true"
        />
      </div>
      <div class="list list-hoverable">
        <a
          class="list-item"
          *ngFor="let item of searchedItems"
          (click)="setItem(item)"
          >{{ item }}</a
        >
        <p
          class="search"
          *ngIf="searchedItems && searchedItems.length <= 0 && !isSearching"
        >
          No Results found
        </p>
        <p class="search" [hidden]="!isSearching">Searching...</p>
      </div>
    </div>
  `,
})
export class AutocompleteComponent {
  @ViewChild('searchItemsInput')
  searchItemsInput!: ElementRef<HTMLInputElement>;
  @Output() setItemEvent = new EventEmitter<{ name: string }>();

  totalItems: string[] = [];
  showSearches: boolean = false;
  isSearching: boolean = false;
  searchedItems: string[] = [];

  constructor(private http: HttpClient) {
    this.totalItems = [
      'Afghanistan',
      'Albania',
      'Algeria',
      'American Samoa',
      'Andorra',
      'Angola',
      'Anguilla',
      'Antarctica',
      'Antigua and Barbuda',
      'Argentina',
      'Armenia',
      'Aruba',
      'Australia',
      'Austria',
      'Azerbaijan',
      'Bahamas (the)',
      'Bahrain',
      'Bangladesh',
      'Barbados',
      'Belarus',
      'Belgium',
      'Belize',
      'Benin',
      'Bermuda',
      'Bhutan',
      'Bolivia (Plurinational State of)',
      'Bonaire, Sint Eustatius and Saba',
      'Bosnia and Herzegovina',
      'Botswana',
      'Bouvet Island',
      'Brazil',
      'British Indian Ocean Territory (the)',
      'Brunei Darussalam',
      'Bulgaria',
      'Burkina Faso',
      'Burundi',
      'Cabo Verde',
      'Cambodia',
      'Cameroon',
      'Canada',
      'Cayman Islands (the)',
      'Central African Republic (the)',
      'Chad',
      'Chile',
      'China',
      'Christmas Island',
      'Cocos (Keeling) Islands (the)',
      'Colombia',
      'Comoros (the)',
      'Congo (the Democratic Republic of the)',
      'Congo (the)',
      'Cook Islands (the)',
      'Costa Rica',
      'Croatia',
      'Cuba',
      'Curaçao',
      'Cyprus',
      'Czechia',
      "Côte d'Ivoire",
      'Denmark',
      'Djibouti',
      'Dominica',
      'Dominican Republic (the)',
      'Ecuador',
      'Egypt',
      'El Salvador',
      'Equatorial Guinea',
      'Eritrea',
      'Estonia',
      'Eswatini',
      'Ethiopia',
    ];
  }

  ngOnInit() {
    // this.onSearch();
  }

  ngAfterViewInit(): void {
    // this.searchItemsInput.nativeElement.focus();
    console.log('sample:', this.searchItemsInput.nativeElement);
    this.onSearch();
  }

  onSearch() {
    const search$ = fromEvent(
      this.searchItemsInput.nativeElement,
      'keyup'
    ).pipe(
      map((event: any) => event.target.value),
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => (this.isSearching = true)),
      switchMap((term) =>
        term ? this.getItemsList(term) : of<any>(this.totalItems)
      ),
      tap(() => {
        (this.isSearching = false), (this.showSearches = true);
      })
    );

    search$.subscribe((data) => {
      this.isSearching = false;
      this.searchedItems = data;
    });
  }

  getItemsList(query: string): Observable<any> {
    //Here we perrform the simple call to filter function. You can also call to API here for the desired result.

    return of(this.filterItems(query)); //used `of` to convert array to Observable
    //return this.http.post("url", data, {headers})  //to get the result from API use this line
  }

  filterItems(query: string) {
    return this.totalItems.filter(
      (val) => val.toLowerCase().includes(query.toLowerCase()) == true
    );
  }

  setItem(name: string) {
    this.setItemEvent.emit({ name });
    this.searchItemsInput.nativeElement.value = name;
    this.showSearches = false;
  }
}
