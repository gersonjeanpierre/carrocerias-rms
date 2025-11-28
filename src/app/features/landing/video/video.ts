import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-video',
  template: `
    <section class="py-12 px-4 bg-base-100">
      <div class="container mx-auto max-w-6xl">
        <div class="flex justify-center">
          <div class="aspect-video w-full max-w-4xl">
            <iframe
              src="https://www.youtube.com/embed/0ZKkB1CxN3U?si=tNjCCkQmtliS_fVR&start=0"
              title="Video institucional RMS"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="w-full h-full rounded-lg"
              tabindex="0"
              aria-label="Video institucional RMS"
              loading="eager"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class VideoComponent {}
