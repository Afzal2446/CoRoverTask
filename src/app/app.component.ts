import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { PopupComponent } from './shared/popup/popup.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header/header.component';
import { ChatboxComponent } from './shared/chatbox/chatbox.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonService } from './shared/common.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatExpansionModule, PopupComponent, CommonModule, HeaderComponent, ChatboxComponent, MatDatepickerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(public commonService: CommonService) { }

  title = 'IRCTC';
  sType: string = '';
  sourceStationName: string = '';
  destinationStationName: string = '';

  ngOnInit() {

    this.commonService.stationName.subscribe((data) => {
      if (this.commonService.stationType.value === 'Source') {
        this.sourceStationName = data;
      }
      else if (this.commonService.stationType.value === 'Destination') {
        this.destinationStationName = data;
      }
    }, (error) => {
      console.log('Something went wrong!', error)
    });

  }

  selectStation(stationType: string) {
    this.sType = stationType
    this.commonService.updateStationType(this.sType);
    this.commonService.stationClicked = true;
  }

  stationArrowFun() {
    if (this.sourceStationName && this.destinationStationName === '') {
      this.destinationStationName = this.sourceStationName;
      this.sourceStationName = ''
    }
    else if (this.destinationStationName && this.sourceStationName === '') {
      this.sourceStationName = this.destinationStationName;
      this.destinationStationName = ''
    }
    else if (this.destinationStationName && this.sourceStationName) {
      [this.sourceStationName, this.destinationStationName] = [this.destinationStationName, this.sourceStationName]; // swapping
    }
  }
}
