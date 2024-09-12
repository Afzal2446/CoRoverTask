import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  public stationClicked: boolean = false;
  public stationType = new BehaviorSubject<string>('');
  currentStationType = this.stationType.asObservable();

  public stationName = new BehaviorSubject<string>('');
  currentStationName = this.stationType.asObservable();

  private stationURL = 'assets/station.json';  // As we dont have API so we are keeping mock data in assets/station.json folder.

  updateStationType(newData: string) {
    this.stationType.next(newData);
  }

  updateStationName(newStation: string) {
    this.stationName.next(newStation);
  }

  getStationData(): Observable<any> {
    return this.http.get(this.stationURL);
  }


}
