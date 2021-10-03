<template>
    <div>
        <div id="three-container" class="three-container"></div>
        <script id="vertexShader" type="x-shader/x-vertex">
            // Uniforms are data that are shared between shaders
            // The contain data that are uniform across the entire frame.
            // The heightmap and scaling constant for each point are uniforms in this respect.
            
            // A uniform to contain the heightmap image
            uniform sampler2D bumpTexture;
            // A uniform to contain the scaling constant
            uniform float bumpScale;
            
            // Varyings are variables whose values are decided in the vertext shader
            // But whose values are then needed in the fragment shader
            
            // A variable to store the height of the point
            varying float vAmount;
            // The UV mapping coordinates of a vertex
            varying vec2 vUV;
            
            void main()
            {
                // The "coordinates" in UV mapping representation
                vUV = uv;
            
                // The heightmap data at those coordinates
                vec4 bumpData = texture2D(bumpTexture, uv);
            
                // height map is grayscale, so it doesn't matter if you use r, g, or b.
                vAmount = bumpData.r;
            
                // move the position along the normal
                vec3 newPosition = position + normal * bumpScale * vAmount;
            
                // Compute the position of the vertex using a standard formula
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        </script>
        
        <!-- fragment shader a.k.a. pixel shader -->
        <script id="fragmentShader" type="x-shader/x-vertex"> 
            varying vec2 vUV;
            varying float vAmount;
            
            void main()
            {
                gl_FragColor = vec4(0.0, vAmount, 0.0, 1.0);
            }
        </script>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { Map } from "bar-db";
import * as THREE from 'three';
import { AmbientLight, BackSide, CameraHelper, DirectionalLight, DoubleSide, Mesh, MeshPhongMaterial, PCFSoftShadowMap } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//@ts-ignore
import { Water } from "three/examples/jsm/objects/Water2";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { BrightnessContrastShader } from 'three/examples/jsm/shaders/BrightnessContrastShader';

@Component
export default class Map3D extends Vue {
    @Prop({ type: Object, required: true }) readonly map!: Map;

    map3D!: SpringMapWebGL;

    public mounted() {
        this.map3D = new SpringMapWebGL({
            map: this.map,
            containerId: "three-container",
            mapWidth: this.map.width!,
            mapHeight: this.map.height!,
            textureUrl: `/api/maps/${this.map.fileName}/texture-hq.jpg`,
            heightUrl: `/api/maps/${this.map.fileName}/height.png`
        });

        this.map3D.init();

        console.log(this.map);
    }

    public destroyed() {
        this.map3D.destroy();
    }
}

interface SpringMapWebGLConfig {
    map: Map,
    containerId: string;
    mapWidth: number;
    mapHeight: number;
    textureUrl: string;
    heightUrl: string;
}

class SpringMapWebGL {
    protected config: SpringMapWebGLConfig;
    protected containerEl: HTMLElement;
    protected renderer: THREE.WebGLRenderer;
    protected camera: THREE.PerspectiveCamera;
    protected controls: OrbitControls;
    protected scene: THREE.Scene;
    protected loader: THREE.TextureLoader;
    protected alight!: AmbientLight;
    protected dlight!: DirectionalLight;
    protected dlightHelper!: CameraHelper;
    protected mesh!: Mesh;
    protected material!: MeshPhongMaterial;
    protected composer: EffectComposer;
    protected renderPass: RenderPass;
    protected brightnessContrastPass: ShaderPass;
    protected fxaaPass!: ShaderPass;
    protected requestAnimationFrameId?: number;

    constructor(config: SpringMapWebGLConfig) {
        this.config = Object.assign({}, config);

        this.containerEl = document.getElementById(this.config.containerId)!;

        const averageMapSize = (this.config.mapWidth + this.config.mapHeight) / 2;

        this.containerEl.style.maxHeight = `${this.containerEl.clientWidth - (averageMapSize * 7)}px`;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, logarithmicDepthBuffer: true });
        this.renderer.domElement.style.marginTop = `-${averageMapSize * 7}px`;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        this.renderer.setSize(this.containerEl.offsetWidth, this.containerEl.offsetWidth);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.containerEl.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene()

        const fov = (this.config.mapWidth + this.config.mapHeight) / 2 * 3;
        this.camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 5000);
        this.camera.position.set(0, -1500, 1000);
        this.camera.rotation.y = 90 * Math.PI / 180;
        this.camera.up.set(0, 0, 1);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        this.controls.maxPolarAngle = Math.PI / 2;

        this.loader = new THREE.TextureLoader();

        this.composer = new EffectComposer(this.renderer);

        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);
        
        this.brightnessContrastPass = new ShaderPass(BrightnessContrastShader);
        this.brightnessContrastPass.uniforms.contrast.value = 0.1;
        this.composer.addPass(this.brightnessContrastPass);

        this.renderer.domElement.addEventListener("resize", () => this.onResize(), false);
    }

    public async init() {
        await this.draw();

        this.animate();
    }

    protected animate() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera)

        this.composer.render();

        this.requestAnimationFrameId = requestAnimationFrame(() => this.animate())
    }

    protected onResize() {
        this.containerEl.style.maxHeight = `${this.containerEl.clientWidth * 0.75}px`;

        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize(this.containerEl.offsetWidth, this.containerEl.offsetWidth);
    }

    protected getHeightData(image: HTMLImageElement) {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);
        const data = context.getImageData(0, 0, image.width, image.height);
    
        return data;
    }

    protected async draw() {
        const heightMap = await this.loader.loadAsync(this.config.heightUrl);
        const textureMap = await this.loader.loadAsync(this.config.textureUrl);
        //const textureMap = await this.loader.loadAsync("/api/maps/dsdr_4.0/texture-hq.png");
        //const specularMap = await this.loader.loadAsync("assets/dsd/specular.png");
        // not using normal map atm because difference is negligible for the file size cost
        // const normalMap = await this.loader.loadAsync("assets/dsd/smaller.jpg");
        // normalMap.flipY = false;

        const heightData = this.getHeightData(heightMap.image);

        const geometry = new THREE.PlaneGeometry(heightData.width, heightData.height, heightData.width - 1, heightData.height - 1);
        this.material = new MeshPhongMaterial({
            map: textureMap,
            side: DoubleSide,
            shadowSide: BackSide,
            // specularMap,
            // specular: new THREE.Color(5, 5, 5)
        });
        this.material.map!.minFilter = THREE.LinearFilter;
        this.material.shininess = 5;
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);

        const totalMapWidth = this.config.mapWidth * 64;
        const totalMapHeight = this.config.mapHeight * 64;

        const totalDepth = Math.abs(this.config.map.minDepth!) + Math.abs(this.config.map.maxDepth!); // usually 1000 but not always
        const depthFactor = totalDepth / 1000;

        const position = this.mesh.geometry.attributes.position;
        for (let i = 0; i < heightData.data.length; i++) {
            let height = heightData.data[i * 4] * 0.4 * depthFactor;
            if (
                i < (totalMapWidth + 1) ||
                i % (totalMapWidth + 1) === 0 ||
                i % (totalMapWidth + 1) === totalMapWidth ||
                i > (totalMapWidth + 1) * (totalMapHeight - 2)
            ) {
                height = 0;
            }
            position.setZ(i, height);
        }

        if (this.config.map.minDepth !== undefined && this.config.map.minDepth! < 0) {
            const normal0 = await this.loader.loadAsync(require("~/assets/images/map3d/Water_1_M_Normal.jpg"));
            const normal1 = await this.loader.loadAsync(require("~/assets/images/map3d/Water_2_M_Normal.jpg"));
    
            const waterGeometry = new THREE.PlaneGeometry(totalMapWidth - 2, totalMapHeight - 2);
            const water = new Water(waterGeometry, {
                normalMap0: normal0,
                normalMap1: normal1,
                clipBias: 1,
                flowDirection: new THREE.Vector2(0.5, 0.5),
                reflectivity: 1
            });
            water.receiveShadow = true;
            water.position.z = ((Math.abs(this.config.map.minDepth) / 1000) * 100) * depthFactor + 0.55;
            this.scene.add(water);
        }

        this.alight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(this.alight);
        this.alight.position.set(0, 0, 1);

        this.dlight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.dlight.position.set(800, 0, 500);
        this.dlight.shadow.camera.near = 1.0;
        this.dlight.shadow.camera.far = 2000;
        this.dlight.shadow.camera.left = -1000;
        this.dlight.shadow.camera.right = 1000;
        this.dlight.shadow.camera.top = 1000;
        this.dlight.shadow.camera.bottom = -1000;
        this.dlight.castShadow = true;
        this.scene.add(this.dlight);
    }

    public destroy() {
        if (this.requestAnimationFrameId !== undefined) {
            cancelAnimationFrame(this.requestAnimationFrameId);
        }
        this.renderer.dispose();
        this.renderer.domElement.remove();
    }
}
</script>

<style lang="scss" scoped>
.three-container {
    max-width: 100%;
    overflow: hidden;
}
</style>