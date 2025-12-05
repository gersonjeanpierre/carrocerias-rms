import {
  Component,
  AfterViewInit,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  inject,
  PLATFORM_ID,
  viewChild,
  effect,
  computed
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { input } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-model3d',
  templateUrl: './model3d.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Model3d implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  private canvasContainer = viewChild<ElementRef>('canvasContainer');

  // Input para el nombre del archivo del modelo (sin extensión ni ruta)
  modelName = input<string>('bi-model-3d');

  // Computed signal para construir el path completo
  private readonly modelPath = computed(() => `models/3d/${this.modelName()}.glb`);

  // Signals para estado reactivo
  readonly isAutoRotating = signal(false);
  readonly isLoading = signal(true);
  readonly loadingProgress = signal(0);
  readonly error = signal<string | null>(null);

  // Three.js objects
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationFrameId?: number;
  private model3dObject: THREE.Object3D | null = null;
  private readonly gltfLoader: GLTFLoader = new GLTFLoader();
  private resizeObserver?: ResizeObserver;
  private initialCameraPosition!: THREE.Vector3;
  private initialControlsTarget!: THREE.Vector3;

  constructor() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.gltfLoader.setDRACOLoader(dracoLoader);

    effect(() => {
      const name = this.modelName();
      if (name && this.scene) {
        this.loadGltfModel();
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScene();
      this.loadGltfModel();
      this.animate();
      this.setupResizeObserver();
    }
  }

  private initScene(): void {
    const containerRef = this.canvasContainer();
    if (!containerRef?.nativeElement) {
      console.warn('canvasContainer not found - aborting initScene');
      return;
    }
    const container = containerRef.nativeElement;

    // Scene setup con fondo cinematográfico
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff); // Fondo oscuro cinematográfico
    this.scene.fog = new THREE.Fog(0xffffff, 20, 50); // Niebla para profundidad

    // Camera con FOV cinematográfico
    this.camera = new THREE.PerspectiveCamera(
      55, // FOV más estrecho para efecto cinematográfico
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 4, 8);
    this.camera.lookAt(0, 0, 0);

    // Renderer con configuración de alta calidad
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.VSMShadowMap; // mejor calidad de sombras    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 3;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Sistema de iluminación cinematográfica (3-point lighting)
    this.setupCinematicLighting();

    // Suelo más amplio y realista
    this.createRealisticFloor();

    // Ambiente con HDRI simulado
    this.setupEnvironment();

    container.appendChild(this.renderer.domElement);

    // Controls mejorados
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableRotate = true;
    this.controls.minDistance = 4.8;
    this.controls.maxDistance = 25;
    this.controls.minPolarAngle = Math.PI / 6; // Limitar ángulo superior
    this.controls.maxPolarAngle = Math.PI / 2; // Limitar ángulo inferior
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 1.0;
    this.controls.enablePan = false; // Desactivar paneo para mejor control
  }

  private setupCinematicLighting(): void {
    // 1. Key Light (Luz principal) - Luz direccional fuerte
    const keyLight = new THREE.DirectionalLight(0xffffff, 4);
    keyLight.position.set(9, 12, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 4096;
    keyLight.shadow.mapSize.height = 4096;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 100;
    keyLight.shadow.camera.left = -30;
    keyLight.shadow.camera.right = 30;
    keyLight.shadow.camera.top = 30;
    keyLight.shadow.camera.bottom = -30;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.radius = 6;
    keyLight.shadow.blurSamples = 16;
    keyLight.shadow.mapSize.set(2046, 2046);
    this.scene.add(keyLight);

    // 2. Fill Light (Luz de relleno) - Suaviza las sombras
    const fillLight = new THREE.DirectionalLight(0x4f6b8c, 2);
    fillLight.position.set(-8, 8, -8);
    this.scene.add(fillLight);

    // 3. Back Light (Luz de contorno) - Separa el objeto del fondo
    const backLight = new THREE.DirectionalLight(0x80683c, 2);
    backLight.position.set(0, 8, -10);
    this.scene.add(backLight);

    // 4. Ambient Light (Luz ambiental) - Iluminación base suave
    const ambientLight = new THREE.AmbientLight(0x404040, 0.9);
    this.scene.add(ambientLight);
  }

  private createRealisticFloor(): void {
    // Suelo más amplio (50x50) para evitar cortes al hacer zoom
    const floorGeometry = new THREE.PlaneGeometry(50, 50);

    // Material con textura procedural para mayor realismo
    const floorMaterial = new THREE.ShadowMaterial({
      opacity: 0.5, // Sombra más sutil
      color: 0x000000
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  private setupEnvironment(): void {
    // Crear un ambiente con luces hemisféricas para simular HDRI
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x2a2a2a, 0.8);
    hemiLight.position.set(0, 50, 10);
    this.scene.add(hemiLight);
  }

  private loadGltfModel(): void {
    this.isLoading.set(true);
    this.loadingProgress.set(0);
    this.error.set(null);

    this.gltfLoader.load(
      this.modelPath(),
      (gltf) => {
        // Configurar sombras y materiales del modelo
        gltf.scene.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Mejorar materiales para mayor realismo
            if (mesh.material) {
              const material = mesh.material as THREE.MeshStandardMaterial;
              if (material.isMeshStandardMaterial) {
                material.envMapIntensity = 2;
                material.needsUpdate = true;
              }
            }
          }
        });

        this.scene.add(gltf.scene);
        this.model3dObject = gltf.scene;
        this.centerAndFrameModel(gltf.scene);
        this.isLoading.set(false);

        console.log('Modelo 3D cargado exitosamente');
      },
      (xhr) => {
        if (xhr.total > 0) {
          const progress = (xhr.loaded / xhr.total) * 100;
          this.loadingProgress.set(Math.round(progress));
        }
      },
      (error) => {
        console.error('Error al cargar el modelo 3D:', error);
        this.isLoading.set(false);
        this.error.set('Error al cargar el modelo 3D. Por favor, intenta de nuevo.');
      }
    );
  }

  private centerAndFrameModel(model: THREE.Object3D): void {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Centrar el modelo
    model.position.sub(center);
    const modelBaseY = size.y / 2;
    model.position.y += modelBaseY;

    // Calcular distancia de cámara óptima
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    const cameraDistanceFactor = 1.1; // Más alejado para mejor encuadre
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * cameraDistanceFactor;

    this.camera.position.set(cameraZ * 0.5, modelBaseY + cameraZ * 0.4, cameraZ);
    this.controls.target.set(0, modelBaseY, 0);
    this.controls.update();

    // Guardar posición inicial para resetView
    this.initialCameraPosition = this.camera.position.clone();
    this.initialControlsTarget = this.controls.target.clone();
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  private setupResizeObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.onWindowResize();
    });

    const containerRef = this.canvasContainer();
    if (containerRef?.nativeElement) {
      this.resizeObserver.observe(containerRef.nativeElement);
    }
  }

  onWindowResize(): void {
    const containerRef = this.canvasContainer();
    if (!containerRef?.nativeElement) return;

    const container = containerRef.nativeElement;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  toggleRotation(): void {
    this.isAutoRotating.update((value) => !value);
    this.controls.autoRotate = this.isAutoRotating();
  }

  resetView(): void {
    if (!this.initialCameraPosition || !this.initialControlsTarget) return;

    // Animar la cámara de vuelta a la posición inicial
    this.camera.position.copy(this.initialCameraPosition);
    this.controls.target.copy(this.initialControlsTarget);
    this.controls.update();

    // Detener rotación automática si está activa
    if (this.isAutoRotating()) {
      this.toggleRotation();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.controls) {
      this.controls.dispose();
    }

    // Limpiar geometrías y materiales
    this.scene?.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });
  }
}
