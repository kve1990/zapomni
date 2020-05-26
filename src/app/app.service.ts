import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public lang$: BehaviorSubject<'ru'|'en'>;

  constructor(public http: HttpClient) {
    this.lang$ = new BehaviorSubject('ru');
  }

  getEvents() {
    return this.http.get('api/widget/v1/nearest_events_by_date?date=2020-08-01&date_interval=90').pipe(
      map(events => {
        if (events && (events as any).length) {
          return (events as any).reduce((e, i) => [...e, ...i.events], []);
        }
      })
    );
  }
}
