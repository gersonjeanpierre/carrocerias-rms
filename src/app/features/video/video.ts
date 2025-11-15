import { Component, input } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.html',
  styleUrls: ['./video.css'],
})
export class VideoComponent {
  // videoId = input<string>('0ZKkB1CxN3U?si=tNjCCkQmtliS_fVR&amp');
  // width = input<number>(840);
  // height = input<number>(473);
  // startTime = input<number>(0);
  // get embedUrl(): string {
  //   const baseUrl = `https://www.youtube.com/embed/${this.videoId()}`;
  //   const params = new URLSearchParams({
  //     start: this.startTime().toString(),
  //   });
  //   console.log('Embed URL:', `${baseUrl}?${params.toString()}`);
  //   return `${baseUrl}?${params.toString()}`;
  // }
}
