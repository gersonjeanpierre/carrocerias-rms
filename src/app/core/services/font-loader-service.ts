import { Injectable, signal, WritableSignal } from '@angular/core';

interface FontConfig {
  readonly family: string;
  readonly fileName: string;
  readonly weight: string;
  readonly style: string;
}

@Injectable({
  providedIn: 'root'
})
export class FontLoaderService {
  private readonly fonts: readonly FontConfig[] = [
    {
      family: 'Rubik',
      fileName: 'Rubik-Regular.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      family: 'Rubik',
      fileName: 'Rubik-Medium.ttf',
      weight: '500',
      style: 'normal'
    },
    {
      family: 'Rubik',
      fileName: 'Rubik-Bold.ttf',
      weight: '700',
      style: 'normal'
    },
    {
      family: 'Rubik',
      fileName: 'Rubik-Italic.ttf',
      weight: '400',
      style: 'italic'
    }
  ];

  // Señales para el estado de carga
  readonly isLoaded: WritableSignal<boolean> = signal(false);
  readonly error: WritableSignal<string | null> = signal(null);
  readonly loadedFontsCount: WritableSignal<number> = signal(0);

  async initFontLoader(): Promise<void> {
    // Asegurar que el código se ejecute solo en el entorno del navegador
    if (typeof window === 'undefined' || !('FontFace' in window)) {
      return;
    }

    const supportsOPFS = 'storage' in navigator && 'getDirectory' in navigator.storage;

    if (!supportsOPFS) {
      console.warn('OPFS no es compatible con este navegador. Cargando fuentes desde URL.');
      await this.loadAllFontsFromUrl();
      return;
    }

    try {
      const root = await navigator.storage.getDirectory();
      await this.loadAllFonts(root);
    } catch (err) {
      console.error('Error en el proceso de carga de fuentes:', err);
      this.error.set(err instanceof Error ? err.message : 'Error desconocido');
      // Fallback a carga normal si OPFS falla
      await this.loadAllFontsFromUrl();
    }
  }

  private async loadAllFonts(root: FileSystemDirectoryHandle): Promise<void> {
    const loadPromises = this.fonts.map((font) => this.loadFont(font, root));
    await Promise.all(loadPromises);
    this.isLoaded.set(true);
    console.log(`${this.fonts.length} variantes de Rubik cargadas exitosamente.`);
  }

  private async loadAllFontsFromUrl(): Promise<void> {
    const loadPromises = this.fonts.map((font) =>
      this.loadFontFromUrl(`/fonts/${font.fileName}`, font)
    );
    await Promise.all(loadPromises);
    this.isLoaded.set(true);
    console.log(`${this.fonts.length} variantes de Rubik cargadas desde URL.`);
  }

  private async loadFont(fontConfig: FontConfig, root: FileSystemDirectoryHandle): Promise<void> {
    try {
      let blob: Blob;

      try {
        const fileHandle = await root.getFileHandle(fontConfig.fileName);
        const file = await fileHandle.getFile();
        blob = file;
        console.log(`${fontConfig.fileName} cargada desde OPFS.`);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'NotFoundError') {
          console.log(`${fontConfig.fileName} no encontrada en OPFS. Descargando...`);
          blob = await this.downloadAndSaveFont(fontConfig.fileName, root);
        } else {
          throw error;
        }
      }

      await this.loadFontFace(blob, fontConfig);
      this.loadedFontsCount.update((count) => count + 1);
    } catch (err) {
      console.error(`Error al cargar ${fontConfig.fileName}:`, err);
      // Intentar cargar desde URL como fallback
      await this.loadFontFromUrl(`/fonts/${fontConfig.fileName}`, fontConfig);
    }
  }

  private async downloadAndSaveFont(
    fileName: string,
    root: FileSystemDirectoryHandle
  ): Promise<Blob> {
    const fontUrl = `/fonts/${fileName}`;
    const response = await fetch(fontUrl);

    if (!response.ok) {
      throw new Error(`Error al descargar ${fileName}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const fileHandle = await root.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
    console.log(`${fileName} guardada en OPFS.`);
    return blob;
  }

  private async loadFontFace(source: Blob | string, fontConfig: FontConfig): Promise<void> {
    try {
      const sourceUrl = typeof source === 'string' ? source : URL.createObjectURL(source);
      const font = new FontFace(fontConfig.family, `url(${sourceUrl})`, {
        weight: fontConfig.weight,
        style: fontConfig.style
      });

      await font.load();
      document.fonts.add(font);
      console.log(
        `${fontConfig.family} (${fontConfig.weight}, ${fontConfig.style}) agregada al documento.`
      );
    } catch (err) {
      console.error(`Error al cargar FontFace para ${fontConfig.fileName}:`, err);
      throw err;
    }
  }

  private async loadFontFromUrl(url: string, fontConfig: FontConfig): Promise<void> {
    await this.loadFontFace(url, fontConfig);
    this.loadedFontsCount.update((count) => count + 1);
  }
}
