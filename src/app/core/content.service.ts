import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { Event, GalleryItem, MenuItem } from './models';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  readonly menu = this.http.get<MenuItem[]>('assets/menu.json').pipe(shareReplay(1));
  readonly events = this.http.get<Event[]>('assets/events.json').pipe(shareReplay(1));
  readonly gallery = this.http.get<GalleryItem[]>('assets/gallery.json').pipe(shareReplay(1));
}
