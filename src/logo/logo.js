'use strict';

import logo from '../models/logo-flat.json';
import particle from '../textures/particle.png';

import THREE from 'three';
import {randomRange} from './utils';

class Logo {
  constructor(element, {
    cameraHeight = 50,
  	radius = 10,
  	minParticleSize = 1,
  	maxParticleSize = 6,
  	minParticleAlpha = 0.2,
  	maxParticleAlpha = 1,
  	minFrame = 10,
  	maxFrame = 30,
  	minBrownSpeed = 0.03,
  	maxBrownSpeed = 0.08,
  	minBrownRadius = 0,
  	maxBrownRadius = 1
  }) {
    this.element = element;
    this.cfg = {
      cameraHeight,
    	radius,
    	minParticleSize,
    	maxParticleSize,
    	minParticleAlpha,
    	maxParticleAlpha,
    	minFrame,
    	maxFrame,
    	minBrownSpeed,
    	maxBrownSpeed,
    	minBrownRadius,
    	maxBrownRadius
    };

    this.height = 0;
    this.width = 0;
    this.aspect = 0;
    this.vHeight = 0;
    this.vWidth = 0;

    this.frameCounter = 0;
    this.maxFrames = [];
    this.brownVectors = [];
    this.textGeometry = null;
    this.bufferedGeometry = null;

    this.mouse = new THREE.Vector3(-1000, -1000, 0);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({alpha: true});

    this.onResize();
    this.appendToDom();
    this.load();
    this.subscribeEvents();
  }

  appendToDom() {
    this.element.appendChild(this.renderer.domElement);
  }

  load() {
    const jsonLoader = new THREE.JSONLoader();
    jsonLoader.load(logo, this.onResoucesLoad.bind(this));
  }

  _initMaxFrames(length) {
  	for(let i = 0, l = this.textGeometry.vertices.length; i < l; i++) {
  		this.maxFrames[i] = 1;
  	}
  }

  _setupBufferedGeometry(bufferedGeometry) {
  	const length = this.textGeometry.vertices.length;
  	const positions = new THREE.BufferAttribute(new Float32Array(length * 3), 3, 1).setDynamic(true);
  	const alphas = new THREE.BufferAttribute(new Float32Array(length), 1, 1);
  	const sizes = new THREE.BufferAttribute(new Float32Array(length), 1, 1);
  	for(let i = 0; i < length; i++) {
  		const point = this.textGeometry.vertices[i];
  		positions.setXYZ(i, point.x, point.y, point.z);
  		sizes.setX(i, randomRange(this.cfg.minParticleSize, this.cfg.maxParticleSize));
  		alphas.setX(i, randomRange(this.cfg.minParticleAlpha, this.cfg.maxParticleAlpha));
  	}

  	bufferedGeometry.addAttribute('position', positions);
  	bufferedGeometry.addAttribute('a_Size', sizes);
  	bufferedGeometry.addAttribute('a_Alpha', alphas);
  }

  render() {
  	const length = this.textGeometry.vertices.length;
  	const vertices = this.bufferedGeometry.attributes.position.array;

  	for(let i = 0; i < length; i++) {
  		const point = new THREE.Vector3().fromArray(vertices, 3 * i);
  		let dir = new THREE.Vector3().copy(this.mouse).sub(point);
  		let dist = dir.length();
  		let origPoint = this.textGeometry.vertices[i];
  		let back = new THREE.Vector3().copy(origPoint).sub(point);
  		let backDist = back.length();
  		if(dist < this.cfg.radius) {
  			point.sub(dir.divideScalar(dist * dist));
  		}

  		this._brownianMove(i, point, origPoint);
  		point.toArray(vertices, 3 * i);
  	}
  	this.frameCounter = (this.frameCounter + 1) % 10000;
  	this.bufferedGeometry.attributes.position.needsUpdate = true;
  	this.renderer.render(this.scene, this.camera);
  }

  animate() {
  	this.render();
  	requestAnimationFrame(this.animate.bind(this));
  }

  _getBrownVetor(index, point, origPoint) {
  	const brownRadius = randomRange(this.cfg.minBrownRadius, this.cfg.maxBrownRadius);
  	const brownQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * Math.random());
  	const brownDir = new THREE.Vector3(brownRadius, 0, 0).applyQuaternion(brownQuat);
  	return new THREE.Vector3().copy(origPoint)
  		.sub(point)
  		.add(brownDir)
  		.multiplyScalar(randomRange(this.cfg.minBrownSpeed, this.cfg.maxBrownSpeed));
  }

  _brownianMove(index, point, origPoint) {
  	if(this.frameCounter % this.maxFrames[index] === 0) {
  		this.brownVectors[index] = this._getBrownVetor(index, point, origPoint);
  		this.maxFrames[index] = Math.floor(randomRange(this.cfg.minFrame, this.cfg.maxFrame));
  	}
  	point.add(this.brownVectors[index]);
  }

  subscribeEvents() {
    window.addEventListener('resize', this.onResize.bind(this));

    window.addEventListener('mousemove', (event) => {
    	const clientX = event.clientX;
    	const clientY = event.clientY;
    	this.mouse.x = ((clientX / window.innerWidth) * 2 - 1) * this.vWidth / 2;
    	this.mouse.y = (-(clientY / window.innerHeight) * 2 + 1) * this.vHeight / 2;
    });

  }

  onResoucesLoad(geometry) {
  	this.textGeometry = geometry;

  	this._initMaxFrames();

  	this.bufferedGeometry = new THREE.BufferGeometry();
  	this._setupBufferedGeometry(this.bufferedGeometry);

  	const textMaterial = new THREE.ShaderMaterial({
  		uniforms: {
  			'u_Texture': {
  				type: 't',
  				value: new THREE.TextureLoader().load(particle)
  			}
  		},
  		vertexShader: document.getElementById('vertexShader').textContent,
  		fragmentShader: document.getElementById('fragmentShader').textContent,
  		transparent: true
  	});
  	const textPoints = new THREE.Points(this.bufferedGeometry, textMaterial);
  	this.scene.add(textPoints);

  	this.animate();
  }

  onResize() {
    this.height = window.innerHeight;
  	this.width = window.innerWidth;
  	this.aspect = this.width / this.height;
    const camera = this.camera;
  	camera.position.z = this.cfg.cameraHeight;
  	camera.aspect = this.aspect;
  	camera.updateProjectionMatrix();
  	this.renderer.setSize(this.width, this.height);
  	const vFOV = camera.fov * Math.PI / 180;
  	this.vHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
  	this.vWidth = this.vHeight * this.aspect;
  }
}

export default Logo;
