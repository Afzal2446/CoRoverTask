import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import $ from 'jquery';
import { CommonService } from '../common.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent {
  constructor(public commonService: CommonService, private ngZone: NgZone) { }

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
          this.voiceInputOn = true;
          console.log('Recognized Speech:', this.recordedTranscript);
        });
      };
      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:');
      };
    } else {
      alert('Speech recognition is not supported in this browser.');
    }

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
    this.voiceInputOn = false;
    this.voiceSpeechBottom = false;
    console.log('closing', this.textInput);
    $('.container').css('opacity', 10);
  }
}
