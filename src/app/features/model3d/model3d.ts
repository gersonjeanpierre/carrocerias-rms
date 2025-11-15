import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// Ya no necesitamos RGBELoader ni PMREMGenerator
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
// import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js';

@Component({
  selector: 'app-model3d',
  templateUrl: './model3d.html',
  styleUrls: ['./model3d.css'],
})
export class Model3d implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', { static: false }) rendererContainer!: ElementRef;
  @Input() modelPath: string = 'models/3d/brazo2.glb';

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationFrameId!: number;
  private model3dObject: THREE.Object3D | null = null;
  private gltfLoader: GLTFLoader = new GLTFLoader();

  constructor() {
    // Inicialización y configuración de DRACOLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.gltfLoader.setDRACOLoader(dracoLoader);
  }

  ngAfterViewInit(): void {
    this.initScene();
    this.loadGltfModel(); // No necesitamos cargar entorno HDR primero
    this.animate();
  }

  initScene(): void {
    if (!this.rendererContainer || !this.rendererContainer.nativeElement) {
      console.warn('rendererContainer not found - aborting initScene');
      return;
    }
    const container = this.rendererContainer.nativeElement;

    // 1. Scene Setup
    this.scene = new THREE.Scene();
    // **Fondo Blanco Puro (FFFFFF)**
    this.scene.background = new THREE.Color(0xffffff);
    // Aseguramos que no haya mapa de entorno para IBL si el fondo es blanco
    this.scene.environment = null;

    // 2. Piso (Para recibir la sombra)
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Mismo color que el fondo
      roughness: 1.0,
      metalness: 0.0,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 3. Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.set(5, 3, 7);
    this.camera.lookAt(0, 0, 0);

    // 4. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Configuración para colores vibrantes
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;

    // 5. Luces (Fijas en la escena para sombras dinámicas en la rotación)

    // Luz ambiental (Base de iluminación)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    // Luz direccional principal (Fuente de sombra Fija)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
    directionalLight.position.set(5, 10, 5); // POSICIÓN FIJA
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Configuración de Sombras Normal/Optimizada
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

    // 6. Controls (Autorotate para rotación dinámica del modelo/cámara)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = true; // Activar rotación
    this.controls.autoRotateSpeed = 1.5;

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private loadGltfModel(): void {
    this.gltfLoader.load(
      this.modelPath,
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

    this.camera.position.set(cameraZ * 1.0, modelBaseY + cameraZ * 0.3, cameraZ * 1.3);

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

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) this.renderer.dispose();
    if (this.controls) this.controls.dispose();
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
}
