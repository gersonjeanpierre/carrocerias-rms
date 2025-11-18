import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { input } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-model3d',
  template: `
    <div class="relative flex justify-center w-full h-full">
      <div #rendererContainer class="h-80 sm:h-96 md:h-[500px] lg:h-[600px] rounded-2xl bg-amber-50 w-full mb-12"></div>
      <button
        (click)="toggleRotation()"
        class="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        [class.bg-red-500]="isRotating()"
        [class.hover:bg-red-700]="isRotating()"
      >
        {{ isRotating() ? 'Parar' : 'Rotar' }}
      </button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Model3d implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', { static: false }) rendererContainer!: ElementRef;
  modelPath = input<string>('models/3d/brazo2.glb');

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationFrameId!: number;
  private model3dObject: THREE.Object3D | null = null;
  private gltfLoader: GLTFLoader = new GLTFLoader();

  isRotating = signal(false);

  constructor() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.gltfLoader.setDRACOLoader(dracoLoader);
  }

  ngAfterViewInit(): void {
    this.initScene();
    this.loadGltfModel();
    this.animate();
  }

  initScene(): void {
    if (!this.rendererContainer || !this.rendererContainer.nativeElement) {
      console.warn('rendererContainer not found - aborting initScene');
      return;
    }
    const container = this.rendererContainer.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.scene.environment = null;

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.set(0, 3, 7); // Vista más frontal
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.bias = -0.0001;

    container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableRotate = true; // Permitir rotación manual
    this.controls.minPolarAngle = Math.PI / 2; // Fijar ángulo polar para solo rotación en Z
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.autoRotate = false; // Disabled by default
    this.controls.autoRotateSpeed = 1.5;

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private loadGltfModel(): void {
    this.gltfLoader.load(
      this.modelPath(),
      (gltf) => {
        gltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.scene.add(gltf.scene);
        this.model3dObject = gltf.scene;
        this.centerAndFrameModel(gltf.scene);

        console.log('Modelo GLB cargado y añadido a la escena.');
      },
      (xhr) => {
        if (xhr.total > 0 && xhr.total > 1000000) {
          console.log(`Cargando modelo: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
        }
      },
      (error) => {
        console.error('Error al cargar el modelo GLB:', error);
      },
    );
  }

  private centerAndFrameModel(model: THREE.Object3D): void {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    model.position.sub(center);
    const modelBaseY = size.y / 2;
    model.position.y += modelBaseY;

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);

    let cameraDistanceFactor = 0.75;
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * cameraDistanceFactor;

    this.camera.position.set(0, modelBaseY + cameraZ * 0.3, cameraZ * 1.0);

    this.controls.target.set(0, modelBaseY, 0);
    this.controls.update();
  }

  animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  onWindowResize(): void {
    const container = this.rendererContainer.nativeElement;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  toggleRotation(): void {
    this.isRotating.update((value) => !value);
    this.controls.autoRotate = this.isRotating();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) this.renderer.dispose();
    if (this.controls) this.controls.dispose();
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
}
