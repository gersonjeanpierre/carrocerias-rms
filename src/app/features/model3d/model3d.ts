import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-model3d',
  imports: [],
  templateUrl: './model3d.html',
  // correct property name is `styleUrls`
  styleUrls: ['./model3d.css'],
})
export class Model3d implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', { static: false }) rendererContainer!: ElementRef;
  @Input() modelPath: string = 'models/3d/brazo.glb';

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationFrameId!: number;
  private model3dObject: THREE.Object3D | null = null;

  constructor() {}

  ngAfterViewInit(): void {
    this.initScene();
    this.loadModel();
    this.animate();
  }

  initScene(): void {
    if (!this.rendererContainer || !this.rendererContainer.nativeElement) {
      console.warn('rendererContainer not found - aborting initScene');
      return;
    }
    const container = this.rendererContainer.nativeElement;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#ffffff');
    // Piso blanco sólido que recibe sombras
    const floorGeometry = new THREE.BoxGeometry(100, 0.5, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 1,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.25; // Ajuste: piso al nivel del modelo
    floor.receiveShadow = true;
    this.scene.add(floor);
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.set(5, 2, 5);
    this.camera.lookAt(0, 0, 0);
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.environment = null;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.9;
    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(0, 20, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.bias = -0.0005;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    this.scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(0, 10, 10);
    this.scene.add(pointLight);
    container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = false;
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  loadModel(): void {
    const loader = new GLTFLoader();
    loader.load(
      this.modelPath,
      (gltf) => {
        gltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = false;
          }
        });
        this.scene.add(gltf.scene);
        this.model3dObject = gltf.scene;
        console.log('Modelo GLB cargado y añadido a la escena.');
      },
      (xhr) => {
        console.log(`Cargando modelo: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
      },
      (error) => {
        console.error('Error al cargar el modelo GLB:', error);
      },
    );
  }

  animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.controls.update();
    if (this.model3dObject) {
      // Rotar el modelo sobre su propio eje Y
      this.model3dObject.rotation.y += 0.005;
    }
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
