import { Component, NgZone } from '@angular/core';
import { CommonService } from '../common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import $ from 'jquery';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  constructor(public commonService: CommonService, private ngZone: NgZone) { }

  stations: any[] = [];
  stationType: any;
  filteredStations: any[] = [];
  searchTerm: string = '';
  textInput: string = '';
  recognition: any;
  voiceSpeechBottom: boolean = false;
  voiceInputOn: boolean = false;
  recordedTranscript = '';

  ngOnInit() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      this.recognition.onresult = (event: any) => {
        this.ngZone.run(() => {
          this.recordedTranscript = event.results[0][0].transcript;
          this.textInput = this.recordedTranscript;
          this.searchTerm = this.textInput;
          setTimeout(() => {
            this.filterStations();
            this.voiceSpeechBottom = false;
            this.voiceInputOn = true;
          }, 600)
          console.log('Recognized Speech:', this.recordedTranscript);
        });
      };
      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:');
      };
    } else {
      alert('Speech recognition is not supported in this browser.');
    }

    $('.container').css('opacity', 0.5);
    // getting source/destination type as observable
    this.commonService.currentStationType.subscribe((value) => {
      this.stationType = value;
    });

    // fetching mock station data
    this.commonService.getStationData().subscribe((data) => {
      this.stations = data.station;
      this.filteredStations = this.stations
    },
      (error) => {
        console.log('Oops getting error', error)
      });
  }


  filterStations() {
    this.filteredStations = this.stations.filter(station =>
      station.stationName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      station.stationshort.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectedStation(station: any) {
    $('.container').css('opacity', 10);
    this.commonService.stationClicked = false;
    this.commonService.updateStationName(station);
  }

  isEmptyObject(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  voiceSpeech() {
    this.voiceSpeechBottom = true;
    this.textInput = '';
    $('.container').css('opacity', 0.5);
    this.startListening();
  }

  startListening() {
    if (this.recognition) {
      this.recognition.start();
      console.log('Listening...');
    }
  }

  closePopUp() {
    $('.container').css('opacity', 10);
    this.commonService.stationClicked = false;
    this.commonService.updateStationType('');
  }

  closePopUpSpeech() {
    console.log('close button')
    this.voiceInputOn = false;
    this.voiceSpeechBottom = false;
    console.log('closing', this.textInput);
    // $('.container').css('opacity', 10);
  }

}
