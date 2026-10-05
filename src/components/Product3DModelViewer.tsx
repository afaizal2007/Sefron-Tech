'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Product, ProductCategory } from '../types/store';
import { useStore } from '../context/StoreContext';
import {
  RotateCcw,
  Play,
  Pause,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Scan,
  Compass,
  Download,
  Info,
  ZoomIn,
  ZoomOut,
  Tag,
  Eye,
} from 'lucide-react';

export type CameraViewAngle = 'front' | 'back' | 'up' | 'down' | 'left' | 'right' | 'iso';

interface Product3DModelViewerProps {
  product?: Product | null;
  productName?: string;
  category?: ProductCategory | string;
  selectedColorName?: string;
  selectedHex?: string;
  activeColorHex?: string;
  className?: string;
  interactive?: boolean;
  autoRotateDefault?: boolean;
  showControlsBar?: boolean;
  onAngleChange?: (yaw: number, pitch: number) => void;
}

export default function Product3DModelViewer({
  product,
  productName,
  category,
  selectedColorName,
  selectedHex,
  activeColorHex,
  className = '',
  interactive = true,
  autoRotateDefault = false,
  showControlsBar = true,
  onAngleChange,
}: Product3DModelViewerProps) {
  const effectiveProduct: Product = product || {
    id: 'prod-demo',
    name: productName || 'Flagship Model',
    category: (category as any) || 'Audio',
    categoryLabel: 'Audio & Earbuds',
    price: 2499,
    regularPrice: 3999,
    discountPercentage: 38,
    rating: 4.9,
    reviewCount: 1200,
    stock: 25,
    tagline: 'Precision Engineered',
    description: '',
    specs: {},
    features: [],
    imageUrl: '',
  };
  const effectiveColorName = selectedColorName || 'Standard';
  const effectiveHex = selectedHex || activeColorHex || '#2563eb';

  const { theme, getThemeColors, showToast } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Studio States
  const [currentView, setCurrentView] = useState<CameraViewAngle>('iso');
  const [isAutoSpinning, setIsAutoSpinning] = useState(autoRotateDefault);
  const [studioLighting, setStudioLighting] = useState<'cyan' | 'neon' | 'warm' | 'stealth' | 'theme'>('theme');
  const [isExploded, setIsExploded] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const explodedPartsRef = useRef<{ mesh: THREE.Object3D; originalPos: THREE.Vector3; targetPos: THREE.Vector3 }[]>([]);
  const lightsGroupRef = useRef<THREE.Group | null>(null);

  const materialsRef = useRef<{
    chassis: THREE.MeshPhysicalMaterial;
    accent: THREE.MeshStandardMaterial;
    glow: THREE.MeshStandardMaterial;
    metal: THREE.MeshStandardMaterial;
    cushion: THREE.MeshStandardMaterial;
    glass: THREE.MeshPhysicalMaterial;
    dial: THREE.MeshStandardMaterial;
  } | null>(null);

  // Mouse & Orbit Interaction State
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const cameraDistanceRef = useRef(4.6);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(2.6, 1.6, 3.2));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const rotationAngleRef = useRef({ yaw: 0.5, pitch: 0.25 });
  const reqAnimFrameRef = useRef<number | null>(null);

  // Detect exact product archetype
  const getProductArchetype = (prod: Product) => {
    const id = prod.id.toLowerCase();
    const name = (prod.name + ' ' + prod.category + ' ' + (prod.categoryLabel || '')).toLowerCase();

    // Gaming Consoles & Handhelds
    if (id.includes('quest') || name.includes('quest') || name.includes('vr') || name.includes('mixed reality')) {
      return 'console-vr';
    }
    if (id.includes('ps5') || name.includes('playstation') || name.includes('ps5')) {
      return 'console-ps5';
    }
    if (id.includes('xbox') || name.includes('xbox') || name.includes('series x') || name.includes('series s')) {
      return 'console-xbox';
    }
    if (id.includes('switch') || name.includes('nintendo') || name.includes('switch')) {
      return 'console-switch';
    }
    if (id.includes('deck') || id.includes('ally') || id.includes('legion') || id.includes('portal') || name.includes('steam deck') || name.includes('rog ally') || name.includes('legion go') || (prod.category === 'Gaming' && name.includes('handheld'))) {
      return 'console-handheld';
    }
    if (prod.category === 'Gaming') {
      return 'console-ps5';
    }

    // Mobile Phone Brand Archetypes
    if (id.includes('fold') || id.includes('flip') || name.includes('fold') || name.includes('flip') || name.includes('open')) {
      return 'mobile-fold';
    }
    if (id.includes('pixel') || name.includes('pixel') || name.includes('google')) {
      return 'mobile-pixel';
    }
    if (id.includes('xiaomi') || name.includes('xiaomi') || name.includes('leica')) {
      return 'mobile-xiaomi';
    }
    if ((id.includes('rog') && !id.includes('ally')) || name.includes('rog phone')) {
      return 'mobile-rog';
    }
    if (id.includes('iqoo') || name.includes('iqoo') || name.includes('bmw')) {
      return 'mobile-iqoo';
    }
    if (id.includes('apple') || name.includes('iphone') || name.includes('apple')) {
      return 'mobile-apple';
    }
    if (id.includes('nothing') || name.includes('nothing')) {
      return 'mobile-nothing';
    }
    if (id.includes('vivo') || name.includes('vivo')) {
      return 'mobile-vivo';
    }
    if (id.includes('oppo') || name.includes('oppo') || name.includes('find x')) {
      return 'mobile-oppo';
    }
    if (id.includes('redmi') || name.includes('redmi') || name.includes('poco')) {
      return 'mobile-redmi';
    }
    if (id.includes('realme') || name.includes('realme')) {
      return 'mobile-realme';
    }
    if (id.includes('samsung') || name.includes('galaxy') || name.includes('s24')) {
      return 'mobile-samsung';
    }
    if (id.includes('oneplus') || name.includes('oneplus')) {
      return 'mobile-oneplus';
    }
    if (prod.category === 'Mobiles' || name.includes('mobile') || name.includes('phone') || name.includes('smartphone')) {
      return 'mobile-generic';
    }

    // Accessories & Peripherals
    if (id === 'prod-009' || name.includes('headphone') || name.includes('vortex')) {
      return 'headphones';
    }
    if (id === 'prod-001' || name.includes('earbud') || name.includes('axiom') || name.includes('airpulse')) {
      return 'earbuds';
    }
    if (id === 'prod-004' || name.includes('watch') || name.includes('chrono') || name.includes('nexus')) {
      return 'smartwatch';
    }
    if (id === 'prod-003' || (name.includes('charger') && !name.includes('stand') && !name.includes('bank'))) {
      return 'charger';
    }
    if (id === 'prod-005' || name.includes('power bank') || name.includes('power core')) {
      return 'powerbank';
    }
    if (id === 'prod-006' || name.includes('cable')) {
      return 'cable';
    }
    if (id === 'prod-007' || name.includes('speaker') || name.includes('pulse 360')) {
      return 'speaker';
    }
    if (id === 'prod-008' || name.includes('screen') || name.includes('shield')) {
      return 'screen';
    }
    if (id === 'prod-010' || name.includes('stand') || name.includes('hub')) {
      return 'stand';
    }
    if (id === 'prod-002' || name.includes('case') || name.includes('carbonforge') || name.includes('armor')) {
      return 'phonecase';
    }
    return 'phonecase';
  };

  // Convert Hex to THREE.Color
  const parseColor = (hex: string) => {
    try {
      return new THREE.Color(hex);
    } catch {
      return new THREE.Color('#00e5ff');
    }
  };

  // -------------------------------------------------------------
  // BUILD EXACT 3D SHAPES PER PRODUCT
  // -------------------------------------------------------------
  const buildProduct3DModel = useCallback((prod: Product, materials: any) => {
    const group = new THREE.Group();
    const explodedParts: { mesh: THREE.Object3D; originalPos: THREE.Vector3; targetPos: THREE.Vector3 }[] = [];

    const registerExplodedPart = (mesh: THREE.Object3D, offset: THREE.Vector3) => {
      const orig = mesh.position.clone();
      const target = orig.clone().add(offset);
      explodedParts.push({ mesh, originalPos: orig, targetPos: target });
    };

    const archetype = getProductArchetype(prod);

    switch (archetype) {
      // 1. OVER-EAR STUDIO HEADPHONES (e.g., SEFRON Vortex Spatial / Apex Pro)
      case 'headphones': {
        // Headband Curved Arc
        const headbandCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.45, -0.2, 0),
          new THREE.Vector3(-1.15, 1.35, 0),
          new THREE.Vector3(0, 1.75, 0),
          new THREE.Vector3(1.15, 1.35, 0),
          new THREE.Vector3(1.45, -0.2, 0),
        ]);
        const headbandGeo = new THREE.TubeGeometry(headbandCurve, 48, 0.13, 16, false);
        const headbandMesh = new THREE.Mesh(headbandGeo, materials.chassis);
        headbandMesh.castShadow = true;
        group.add(headbandMesh);
        registerExplodedPart(headbandMesh, new THREE.Vector3(0, 0.6, 0));

        // Soft Inner Headband Cushion
        const cushionCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.95, 1.05, 0),
          new THREE.Vector3(0, 1.6, 0),
          new THREE.Vector3(0.95, 1.05, 0),
        ]);
        const cushionGeo = new THREE.TubeGeometry(cushionCurve, 32, 0.11, 12, false);
        const cushionMesh = new THREE.Mesh(cushionGeo, materials.cushion);
        group.add(cushionMesh);
        registerExplodedPart(cushionMesh, new THREE.Vector3(0, 0.3, 0));

        // Left & Right Earcups
        [-1, 1].forEach((side) => {
          const cupGroup = new THREE.Group();
          cupGroup.position.set(side * 1.5, -0.35, 0);
          cupGroup.rotation.z = side * 0.1;

          // Metal Gimbal Yoke
          const yokeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 16);
          const yoke = new THREE.Mesh(yokeGeo, materials.metal);
          yoke.position.y = 0.28;
          cupGroup.add(yoke);

          // Earcup Outer Shell
          const cupGeo = new THREE.CylinderGeometry(0.78, 0.72, 0.36, 36);
          cupGeo.rotateZ(Math.PI / 2);
          const cup = new THREE.Mesh(cupGeo, materials.chassis);
          cup.castShadow = true;
          cupGroup.add(cup);

          // Outer Metal Bezel Ring
          const ringGeo = new THREE.TorusGeometry(0.76, 0.05, 16, 36);
          ringGeo.rotateY(Math.PI / 2);
          const ring = new THREE.Mesh(ringGeo, materials.accent);
          ring.position.x = side * 0.08;
          cupGroup.add(ring);

          // LED Core Emblem Disc
          const ledGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.04, 32);
          ledGeo.rotateZ(Math.PI / 2);
          const ledMesh = new THREE.Mesh(ledGeo, materials.glow);
          ledMesh.position.x = side * 0.19;
          cupGroup.add(ledMesh);

          // Plush Memory Foam Acoustic Cushion
          const foamGeo = new THREE.TorusGeometry(0.72, 0.25, 20, 36);
          foamGeo.rotateY(Math.PI / 2);
          const foam = new THREE.Mesh(foamGeo, materials.cushion);
          foam.position.x = -side * 0.22;
          cupGroup.add(foam);

          // Inner Speaker Driver Mesh
          const speakerGeo = new THREE.CircleGeometry(0.55, 24);
          speakerGeo.rotateY(side === 1 ? -Math.PI / 2 : Math.PI / 2);
          const speaker = new THREE.Mesh(speakerGeo, materials.metal);
          speaker.position.x = -side * 0.26;
          cupGroup.add(speaker);

          group.add(cupGroup);
          registerExplodedPart(cupGroup, new THREE.Vector3(side * 0.75, 0, 0));
        });
        break;
      }

      // 2. EARBUDS & CHARGING CAPSULE (e.g., SEFRON Axiom Pro ANC)
      case 'earbuds': {
        // Rounded Pebble Case Body
        const caseBodyGeo = new THREE.CylinderGeometry(1.25, 1.05, 1.15, 36);
        const caseBody = new THREE.Mesh(caseBodyGeo, materials.chassis);
        caseBody.position.y = -0.3;
        caseBody.castShadow = true;
        group.add(caseBody);
        registerExplodedPart(caseBody, new THREE.Vector3(0, -0.6, 0));

        // Flip Lid
        const lidGeo = new THREE.SphereGeometry(1.25, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2);
        const lid = new THREE.Mesh(lidGeo, materials.chassis);
        lid.position.y = 0.28;
        lid.scale.set(1, 0.65, 0.9);
        lid.castShadow = true;
        group.add(lid);
        registerExplodedPart(lid, new THREE.Vector3(0, 0.8, 0));

        // Rear Metallic Hinge
        const hingeGeo = new THREE.BoxGeometry(0.55, 0.15, 0.15);
        const hinge = new THREE.Mesh(hingeGeo, materials.accent);
        hinge.position.set(0, 0.28, -0.85);
        group.add(hinge);

        // Front Status LED
        const ledGeo = new THREE.SphereGeometry(0.045, 12, 12);
        const led = new THREE.Mesh(ledGeo, materials.glow);
        led.position.set(0, -0.1, 1.02);
        group.add(led);

        // In-Ear Wireless Earbuds (Left & Right)
        [-1, 1].forEach((side) => {
          const bud = new THREE.Group();
          bud.position.set(side * 0.75, 0.88, 0.2);
          bud.rotation.set(0.2, side * -0.3, side * 0.4);

          // Head Bulb
          const headGeo = new THREE.SphereGeometry(0.34, 24, 24);
          headGeo.scale(1, 0.9, 1.2);
          const head = new THREE.Mesh(headGeo, materials.chassis);
          bud.add(head);

          // Silicone Ear Tip
          const tipGeo = new THREE.ConeGeometry(0.24, 0.26, 20);
          tipGeo.rotateX(Math.PI / 2);
          const tip = new THREE.Mesh(tipGeo, materials.cushion);
          tip.position.set(0, 0, 0.38);
          bud.add(tip);

          // Mic Stem
          const stemGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.9, 20);
          const stem = new THREE.Mesh(stemGeo, materials.chassis);
          stem.position.set(0, -0.48, 0);
          bud.add(stem);

          // Touch Bar Glow Strip
          const stripGeo = new THREE.BoxGeometry(0.04, 0.45, 0.04);
          const strip = new THREE.Mesh(stripGeo, materials.glow);
          strip.position.set(0, -0.42, 0.09);
          bud.add(strip);

          group.add(bud);
          registerExplodedPart(bud, new THREE.Vector3(side * 0.6, 0.6, 0.3));
        });
        break;
      }

      // 3. SMARTWATCH (e.g., SEFRON Nexus Cyber Titanium)
      case 'smartwatch': {
        const watchGroup = new THREE.Group();

        // High-precision Circular Titanium Unibody Case
        const caseGeo = new THREE.CylinderGeometry(1.28, 1.32, 0.36, 64);
        caseGeo.rotateX(Math.PI / 2);
        const watchCase = new THREE.Mesh(caseGeo, materials.chassis);
        watchCase.castShadow = true;
        watchCase.receiveShadow = true;
        watchGroup.add(watchCase);
        registerExplodedPart(watchCase, new THREE.Vector3(0, 0, 0));

        // Outer Fluted / Tachymeter Bezel Ring
        const bezelGeo = new THREE.TorusGeometry(1.28, 0.065, 20, 64);
        const bezel = new THREE.Mesh(bezelGeo, materials.accent);
        bezel.position.z = 0.18;
        watchGroup.add(bezel);
        registerExplodedPart(bezel, new THREE.Vector3(0, 0, 0.3));

        // Inner Polished Chamfer Ring
        const innerBezelGeo = new THREE.TorusGeometry(1.18, 0.035, 16, 48);
        const innerBezel = new THREE.Mesh(innerBezelGeo, materials.metal);
        innerBezel.position.z = 0.19;
        watchGroup.add(innerBezel);

        // 4 Ergonomic Sculpted Strap Lugs (Top Left, Top Right, Bottom Left, Bottom Right)
        const lugGeo = new THREE.BoxGeometry(0.2, 0.52, 0.3);
        const lugOffsets = [
          { x: -0.82, y: 1.28, z: -0.04, rotZ: 0.12 },
          { x: 0.82, y: 1.28, z: -0.04, rotZ: -0.12 },
          { x: -0.82, y: -1.28, z: -0.04, rotZ: -0.12 },
          { x: 0.82, y: -1.28, z: -0.04, rotZ: 0.12 },
        ];
        lugOffsets.forEach((l) => {
          const lug = new THREE.Mesh(lugGeo, materials.chassis);
          lug.position.set(l.x, l.y, l.z);
          lug.rotation.z = l.rotZ;
          watchGroup.add(lug);
        });

        // Top & Bottom Steel Spring Bars
        [-1, 1].forEach((dir) => {
          const barGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 16);
          barGeo.rotateZ(Math.PI / 2);
          const bar = new THREE.Mesh(barGeo, materials.metal);
          bar.position.set(0, dir * 1.38, -0.06);
          watchGroup.add(bar);
        });

        // Interactive High-Res Watch Face Dial with Dynamic Telemetry Graphics
        const dialCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
        let dialTexture: THREE.CanvasTexture | null = null;
        if (dialCanvas) {
          dialCanvas.width = 1024;
          dialCanvas.height = 1024;
          const ctx = dialCanvas.getContext('2d');
          if (ctx) {
            // Dark Carbon Background
            ctx.fillStyle = '#06080e';
            ctx.beginPath();
            ctx.arc(512, 512, 510, 0, Math.PI * 2);
            ctx.fill();

            // Gradient Radial Glow
            const grad = ctx.createRadialGradient(512, 512, 80, 512, 512, 490);
            grad.addColorStop(0, '#101726');
            grad.addColorStop(0.65, '#090d15');
            grad.addColorStop(1, '#030508');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(512, 512, 490, 0, Math.PI * 2);
            ctx.fill();

            // Circular Outer Telemetry Track
            ctx.strokeStyle = '#223046';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(512, 512, 465, 0, Math.PI * 2);
            ctx.stroke();

            // 60 Precision Minute / Second Hash Markers
            for (let i = 0; i < 60; i++) {
              const rad = (i * 6 * Math.PI) / 180;
              const isMajor = i % 5 === 0;
              const isQuarter = i % 15 === 0;
              const rIn = isQuarter ? 425 : isMajor ? 438 : 452;
              const rOut = 465;

              ctx.strokeStyle = isQuarter ? '#00e3fd' : isMajor ? '#ffffff' : '#4b5563';
              ctx.lineWidth = isQuarter ? 6 : isMajor ? 4 : 2;
              ctx.beginPath();
              ctx.moveTo(512 + Math.cos(rad) * rIn, 512 + Math.sin(rad) * rIn);
              ctx.lineTo(512 + Math.cos(rad) * rOut, 512 + Math.sin(rad) * rOut);
              ctx.stroke();
            }

            // Bold Arabic Quarter Numerals
            ctx.font = 'bold 52px Outfit, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('12', 512, 130);
            ctx.fillText('3', 890, 512);
            ctx.fillText('6', 512, 890);
            ctx.fillText('9', 134, 512);

            // Subdial 1: Heart Rate Monitor (Top Center)
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(512, 320, 92, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 24px Outfit, sans-serif';
            ctx.fillText('❤️ 118 BPM', 512, 312);
            ctx.fillStyle = '#9ca3af';
            ctx.font = '14px monospace';
            ctx.fillText('PULSE RATE', 512, 342);

            // Subdial 2: Activity Steps & Rings (Left Center)
            ctx.strokeStyle = 'rgba(0, 227, 253, 0.45)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(315, 512, 88, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#00e3fd';
            ctx.font = 'bold 22px Outfit, sans-serif';
            ctx.fillText('8,420', 315, 505);
            ctx.fillStyle = '#9ca3af';
            ctx.font = '13px monospace';
            ctx.fillText('DAILY STEPS', 315, 532);

            // Subdial 3: Power & Battery Gauge (Right Center)
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(709, 512, 88, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 22px Outfit, sans-serif';
            ctx.fillText('⚡ 84%', 709, 505);
            ctx.fillStyle = '#9ca3af';
            ctx.font = '13px monospace';
            ctx.fillText('BATTERY', 709, 532);

            // Digital Live Time & Brand Inscription
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px monospace';
            ctx.fillText('10:08:42', 512, 652);
            ctx.fillStyle = '#00e3fd';
            ctx.font = 'bold 16px Outfit, sans-serif';
            ctx.fillText('SEFRON NEXUS PRO', 512, 696);
            ctx.fillStyle = '#64748b';
            ctx.font = '13px monospace';
            ctx.fillText('5ATM • TITANIUM DIVER', 512, 726);

            dialTexture = new THREE.CanvasTexture(dialCanvas);
            dialTexture.anisotropy = 8;
          }
        }

        const dialMaterial = dialTexture
          ? new THREE.MeshStandardMaterial({
              map: dialTexture,
              roughness: 0.15,
              metalness: 0.1,
            })
          : materials.glow;

        const dialGeo = new THREE.CircleGeometry(1.16, 48);
        const dial = new THREE.Mesh(dialGeo, dialMaterial);
        dial.position.z = 0.185;
        watchGroup.add(dial);
        registerExplodedPart(dial, new THREE.Vector3(0, 0, 0.5));

        // 3D Skeletonized Watch Hands
        const handsGroup = new THREE.Group();
        handsGroup.position.z = 0.195;

        // Hour Hand (Pointing towards 10 o'clock)
        const hourHandGeo = new THREE.BoxGeometry(0.09, 0.62, 0.02);
        const hourHand = new THREE.Mesh(hourHandGeo, materials.accent);
        hourHand.position.set(-0.2, 0.22, 0);
        hourHand.rotation.z = Math.PI / 3.8;
        handsGroup.add(hourHand);

        // Minute Hand (Pointing towards 2 o'clock)
        const minHandGeo = new THREE.BoxGeometry(0.07, 0.88, 0.02);
        const minHand = new THREE.Mesh(minHandGeo, materials.accent);
        minHand.position.set(0.24, 0.28, 0.005);
        minHand.rotation.z = -Math.PI / 4.2;
        handsGroup.add(minHand);

        // Sweep Seconds Hand (Needle thin cyan/orange hand)
        const secHandGeo = new THREE.BoxGeometry(0.025, 1.05, 0.015);
        const secHand = new THREE.Mesh(secHandGeo, materials.glow);
        secHand.position.set(0.12, -0.28, 0.01);
        secHand.rotation.z = Math.PI / 1.4;
        handsGroup.add(secHand);

        // Center Pivot Jewel Pin Cap
        const capGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 24);
        capGeo.rotateX(Math.PI / 2);
        const cap = new THREE.Mesh(capGeo, materials.metal);
        cap.position.z = 0.015;
        handsGroup.add(cap);

        watchGroup.add(handsGroup);
        registerExplodedPart(handsGroup, new THREE.Vector3(0, 0, 0.65));

        // 2.5D Curved Anti-Reflective Sapphire Glass Crystal
        const glassGeo = new THREE.CylinderGeometry(1.17, 1.18, 0.05, 48);
        glassGeo.rotateX(Math.PI / 2);
        const glassMesh = new THREE.Mesh(glassGeo, materials.glass);
        glassMesh.position.z = 0.21;
        watchGroup.add(glassMesh);
        registerExplodedPart(glassMesh, new THREE.Vector3(0, 0, 0.85));

        // CNC Knurled Digital Crown (Right Side at 2 o'clock)
        const crownGroup = new THREE.Group();
        crownGroup.position.set(1.36, 0.32, 0);
        crownGroup.rotation.z = Math.PI / 2;

        const crownBaseGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.28, 32);
        const crownBase = new THREE.Mesh(crownBaseGeo, materials.metal);
        crownGroup.add(crownBase);

        // Knurled Grip Ridges Ring
        const crownRingGeo = new THREE.TorusGeometry(0.24, 0.035, 12, 32);
        const crownRing = new THREE.Mesh(crownRingGeo, materials.glow);
        crownRing.position.y = 0.08;
        crownGroup.add(crownRing);

        // Center Red/Cyan Core Dot
        const crownDotGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 24);
        const crownDot = new THREE.Mesh(crownDotGeo, materials.accent);
        crownDot.position.y = 0.15;
        crownGroup.add(crownDot);

        watchGroup.add(crownGroup);
        registerExplodedPart(crownGroup, new THREE.Vector3(0.65, 0.15, 0));

        // Secondary Action / Workout Button (Right Side at 4 o'clock)
        const btnGeo = new THREE.BoxGeometry(0.14, 0.46, 0.18);
        const btn = new THREE.Mesh(btnGeo, materials.metal);
        btn.position.set(1.32, -0.36, 0);
        watchGroup.add(btn);
        registerExplodedPart(btn, new THREE.Vector3(0.45, -0.15, 0));

        // Left Side Acoustic Speaker Grille Slots
        const speakerSlotGeo = new THREE.BoxGeometry(0.06, 0.34, 0.08);
        const speakerSlot = new THREE.Mesh(speakerSlotGeo, materials.accent);
        speakerSlot.position.set(-1.29, 0.05, 0);
        watchGroup.add(speakerSlot);

        // Mic Pinhole
        const micGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.06, 12);
        micGeo.rotateZ(Math.PI / 2);
        const mic = new THREE.Mesh(micGeo, materials.accent);
        mic.position.set(-1.29, -0.28, 0);
        watchGroup.add(mic);

        // Ergonomic Multi-Segment Curved Sports Straps
        // Top Strap (Curving naturally around wrist contour)
        const topStrapGroup = new THREE.Group();
        const topCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 1.34, -0.06),
          new THREE.Vector3(0, 1.85, -0.18),
          new THREE.Vector3(0, 2.45, -0.52),
          new THREE.Vector3(0, 2.95, -0.98),
        ]);
        const topStrapGeo = new THREE.TubeGeometry(topCurve, 32, 0.18, 16, false);
        topStrapGeo.scale(6.2, 1, 0.45);
        const topStrapMesh = new THREE.Mesh(topStrapGeo, materials.cushion);
        topStrapMesh.castShadow = true;
        topStrapGroup.add(topStrapMesh);

        // Top Strap Keeper Loops & Titanium Buckle
        const keeperGeo = new THREE.BoxGeometry(1.24, 0.14, 0.28);
        const keeper = new THREE.Mesh(keeperGeo, materials.accent);
        keeper.position.set(0, 2.2, -0.38);
        topStrapGroup.add(keeper);

        const buckleGeo = new THREE.BoxGeometry(1.28, 0.22, 0.32);
        const buckle = new THREE.Mesh(buckleGeo, materials.metal);
        buckle.position.set(0, 2.9, -0.92);
        topStrapGroup.add(buckle);

        watchGroup.add(topStrapGroup);
        registerExplodedPart(topStrapGroup, new THREE.Vector3(0, 0.95, 0.3));

        // Bottom Strap (Curving downwards around wrist with adjustment pinholes)
        const bottomStrapGroup = new THREE.Group();
        const bottomCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -1.34, -0.06),
          new THREE.Vector3(0, -1.95, -0.2),
          new THREE.Vector3(0, -2.6, -0.58),
          new THREE.Vector3(0, -3.15, -1.08),
        ]);
        const bottomStrapGeo = new THREE.TubeGeometry(bottomCurve, 36, 0.18, 16, false);
        bottomStrapGeo.scale(6.2, 1, 0.45);
        const bottomStrapMesh = new THREE.Mesh(bottomStrapGeo, materials.cushion);
        bottomStrapMesh.castShadow = true;
        bottomStrapGroup.add(bottomStrapMesh);

        // Adjustment Pinholes along the bottom strap spine
        for (let i = 0; i < 6; i++) {
          const pinHoleGeo = new THREE.BoxGeometry(0.12, 0.08, 0.08);
          const pinHole = new THREE.Mesh(pinHoleGeo, materials.accent);
          pinHole.position.set(0, -1.75 - i * 0.22, -0.15 - i * 0.14);
          bottomStrapGroup.add(pinHole);
        }

        watchGroup.add(bottomStrapGroup);
        registerExplodedPart(bottomStrapGroup, new THREE.Vector3(0, -0.95, 0.3));

        // Rear Zirconia Ceramic Bio-Sensor Dome (Underbelly)
        const rearDomeGeo = new THREE.CylinderGeometry(0.82, 0.88, 0.14, 48);
        rearDomeGeo.rotateX(Math.PI / 2);
        const rearDome = new THREE.Mesh(rearDomeGeo, materials.accent);
        rearDome.position.set(0, 0, -0.25);
        watchGroup.add(rearDome);
        registerExplodedPart(rearDome, new THREE.Vector3(0, 0, -0.45));

        // Quad Optical PPG Bio-Sensor Sapphire Lenses
        const ppgOffsets = [
          { x: 0, y: 0.32 },
          { x: 0, y: -0.32 },
          { x: 0.32, y: 0 },
          { x: -0.32, y: 0 },
        ];
        ppgOffsets.forEach((pos) => {
          const sensorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 24);
          sensorGeo.rotateX(Math.PI / 2);
          const sensor = new THREE.Mesh(sensorGeo, materials.glow);
          sensor.position.set(pos.x, pos.y, -0.32);
          watchGroup.add(sensor);
        });

        // Concentric Gold Magnetic Charging Contact Rings
        [0.58, 0.42].forEach((radius) => {
          const ringGeo = new THREE.TorusGeometry(radius, 0.02, 16, 48);
          const ringMesh = new THREE.Mesh(ringGeo, materials.metal);
          ringMesh.position.set(0, 0, -0.31);
          watchGroup.add(ringMesh);
        });

        group.add(watchGroup);
        break;
      }

      // 4. GaN FAST CHARGER (e.g., SEFRON Flow 65W GaN III)
      case 'charger': {
        // Compact GaN Power Block
        const bodyGeo = new THREE.BoxGeometry(1.5, 1.9, 1.35);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Front Port Faceplate
        const faceGeo = new THREE.BoxGeometry(1.42, 1.82, 0.08);
        const face = new THREE.Mesh(faceGeo, materials.accent);
        face.position.z = 0.71;
        group.add(face);
        registerExplodedPart(face, new THREE.Vector3(0, 0, 0.45));

        // Dual USB-C Sockets
        [-0.38, 0.12].forEach((yPos) => {
          const usbCGeo = new THREE.BoxGeometry(0.48, 0.18, 0.18);
          const usbC = new THREE.Mesh(usbCGeo, materials.metal);
          usbC.position.set(0, yPos, 0.74);
          group.add(usbC);

          const innerPinGeo = new THREE.BoxGeometry(0.3, 0.04, 0.1);
          const innerPin = new THREE.Mesh(innerPinGeo, materials.glow);
          innerPin.position.set(0, yPos, 0.78);
          group.add(innerPin);
        });

        // USB-A Port
        const usbAGeo = new THREE.BoxGeometry(0.65, 0.32, 0.18);
        const usbA = new THREE.Mesh(usbAGeo, materials.metal);
        usbA.position.set(0, 0.6, 0.74);
        group.add(usbA);

        // Wattage Status Indicator
        const ledGeo = new THREE.BoxGeometry(0.5, 0.05, 0.05);
        const led = new THREE.Mesh(ledGeo, materials.glow);
        led.position.set(0, -0.72, 0.74);
        group.add(led);

        // Foldable AC Prongs (Back)
        [-0.32, 0.32].forEach((xPos) => {
          const prongGeo = new THREE.BoxGeometry(0.12, 0.65, 0.08);
          const prong = new THREE.Mesh(prongGeo, materials.metal);
          prong.position.set(xPos, 0, -0.78);
          group.add(prong);
          registerExplodedPart(prong, new THREE.Vector3(0, 0, -0.5));
        });
        break;
      }

      // 5. 20,000mAh POWER BANK (e.g., SEFRON Apex 100W Power Core)
      case 'powerbank': {
        // Monolithic Curved Aluminum Battery Chassis
        const bodyGeo = new THREE.BoxGeometry(1.6, 3.2, 0.75);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Top OLED Wattage Display HUD
        const screenGeo = new THREE.PlaneGeometry(1.2, 0.65);
        const screen = new THREE.Mesh(screenGeo, materials.glow);
        screen.position.set(0, 1.05, 0.39);
        group.add(screen);
        registerExplodedPart(screen, new THREE.Vector3(0, 0, 0.4));

        // Top Port Face
        const topPortGeo = new THREE.BoxGeometry(1.4, 0.1, 0.65);
        const topPort = new THREE.Mesh(topPortGeo, materials.accent);
        topPort.position.y = 1.65;
        group.add(topPort);
        registerExplodedPart(topPort, new THREE.Vector3(0, 0.4, 0));

        // Dual 100W USB-C Ports
        [-0.35, 0.35].forEach((xPos) => {
          const usbCGeo = new THREE.BoxGeometry(0.4, 0.16, 0.15);
          const usbC = new THREE.Mesh(usbCGeo, materials.metal);
          usbC.position.set(xPos, 1.66, 0);
          group.add(usbC);
        });

        // Power Check Button on side
        const btnGeo = new THREE.BoxGeometry(0.08, 0.35, 0.15);
        const btn = new THREE.Mesh(btnGeo, materials.metal);
        btn.position.set(0.84, 0.75, 0);
        group.add(btn);
        break;
      }

      // 6. CYLINDRICAL SMART SPEAKER (e.g., SEFRON Pulse 360°)
      case 'speaker': {
        // Cylindrical Tower Body with Acoustic Mesh
        const bodyGeo = new THREE.CylinderGeometry(1.05, 1.05, 2.7, 48);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Top Glass Touch Disc Cap
        const topCapGeo = new THREE.CylinderGeometry(1.08, 1.08, 0.15, 48);
        const topCap = new THREE.Mesh(topCapGeo, materials.glass);
        topCap.position.y = 1.42;
        group.add(topCap);
        registerExplodedPart(topCap, new THREE.Vector3(0, 0.65, 0));

        // Illuminated Top Touch Controls
        const discGeo = new THREE.CircleGeometry(0.68, 32);
        discGeo.rotateX(-Math.PI / 2);
        const disc = new THREE.Mesh(discGeo, materials.glow);
        disc.position.y = 1.51;
        group.add(disc);

        // Bottom 360° Ambient Glow Ring
        const ringGeo = new THREE.TorusGeometry(1.04, 0.06, 16, 48);
        ringGeo.rotateX(Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, materials.glow);
        ring.position.y = -1.3;
        group.add(ring);
        registerExplodedPart(ring, new THREE.Vector3(0, -0.45, 0));

        // Bottom Silicone Anti-Vibration Footing
        const baseGeo = new THREE.CylinderGeometry(0.96, 1.0, 0.2, 48);
        const base = new THREE.Mesh(baseGeo, materials.cushion);
        base.position.y = -1.42;
        group.add(base);
        break;
      }

      // 7. BRAIDED 240W TECH CABLE (e.g., SEFRON Stealth Braided Cable)
      case 'cable': {
        // Coiled Braided Cable Tube
        const cableCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.4, -0.8, 0),
          new THREE.Vector3(-1.0, 0.9, 0.2),
          new THREE.Vector3(0, 1.4, -0.1),
          new THREE.Vector3(1.0, 0.9, 0.2),
          new THREE.Vector3(1.4, -0.8, 0),
        ]);
        const cableGeo = new THREE.TubeGeometry(cableCurve, 48, 0.14, 16, false);
        const cableMesh = new THREE.Mesh(cableGeo, materials.chassis);
        cableMesh.castShadow = true;
        group.add(cableMesh);

        // Left & Right Aluminum USB-C Plugs
        [-1, 1].forEach((side) => {
          const plugGroup = new THREE.Group();
          plugGroup.position.set(side * 1.4, -0.8, 0);
          plugGroup.rotation.z = side * 0.4;

          // Metal Housing
          const housingGeo = new THREE.BoxGeometry(0.36, 0.8, 0.22);
          const housing = new THREE.Mesh(housingGeo, materials.accent);
          plugGroup.add(housing);

          // Glowing Circuit Indicator
          const ledGeo = new THREE.BoxGeometry(0.12, 0.35, 0.05);
          const led = new THREE.Mesh(ledGeo, materials.glow);
          led.position.z = 0.12;
          plugGroup.add(led);

          // 24K Gold USB-C Tip
          const tipGeo = new THREE.BoxGeometry(0.28, 0.35, 0.12);
          const tip = new THREE.Mesh(tipGeo, materials.metal);
          tip.position.y = -0.55;
          plugGroup.add(tip);

          group.add(plugGroup);
          registerExplodedPart(plugGroup, new THREE.Vector3(side * 0.5, -0.3, 0));
        });
        break;
      }

      // 8. 9H TEMPERED SCREEN PROTECTOR (e.g., SEFRON Screen Shield)
      case 'screen': {
        // Ultra-Thin 2.5D Curved Glass Plate
        const glassGeo = new THREE.BoxGeometry(1.65, 3.3, 0.08);
        const glass = new THREE.Mesh(glassGeo, materials.glass);
        glass.castShadow = true;
        group.add(glass);
        registerExplodedPart(glass, new THREE.Vector3(0, 0, 0));

        // Black Oleophobic Border Rim
        const rimGeo = new THREE.BoxGeometry(1.7, 3.35, 0.06);
        const rim = new THREE.Mesh(rimGeo, materials.accent);
        group.add(rim);
        registerExplodedPart(rim, new THREE.Vector3(0, 0, -0.2));

        // Top Speaker Notch Cutout
        const notchGeo = new THREE.BoxGeometry(0.35, 0.06, 0.1);
        const notch = new THREE.Mesh(notchGeo, materials.glow);
        notch.position.set(0, 1.58, 0);
        group.add(notch);
        break;
      }

      // 9. 3-IN-1 CYBER CHARGING STAND (e.g., SEFRON MagStand 3-in-1)
      case 'stand': {
        // Weighted Base
        const baseGeo = new THREE.CylinderGeometry(1.2, 1.25, 0.25, 36);
        const base = new THREE.Mesh(baseGeo, materials.chassis);
        base.position.y = -1.3;
        base.castShadow = true;
        group.add(base);
        registerExplodedPart(base, new THREE.Vector3(0, -0.5, 0));

        // Base Ambient LED Ring
        const ringGeo = new THREE.TorusGeometry(1.15, 0.04, 16, 36);
        ringGeo.rotateX(Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, materials.glow);
        ring.position.y = -1.18;
        group.add(ring);

        // Angled Aerospace Stem
        const stemGeo = new THREE.BoxGeometry(0.2, 2.2, 0.2);
        const stem = new THREE.Mesh(stemGeo, materials.accent);
        stem.position.set(0, -0.2, 0);
        stem.rotation.x = -0.15;
        group.add(stem);

        // MagSafe Phone Charging Puck (Tilted 60°)
        const puckGroup = new THREE.Group();
        puckGroup.position.set(0, 0.85, 0.2);
        puckGroup.rotation.x = -0.35;

        const puckGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.12, 32);
        puckGeo.rotateX(Math.PI / 2);
        const puck = new THREE.Mesh(puckGeo, materials.chassis);
        puckGroup.add(puck);

        const puckGlowGeo = new THREE.TorusGeometry(0.55, 0.04, 16, 32);
        const puckGlow = new THREE.Mesh(puckGlowGeo, materials.glow);
        puckGlow.position.z = 0.07;
        puckGroup.add(puckGlow);

        group.add(puckGroup);
        registerExplodedPart(puckGroup, new THREE.Vector3(0, 0.5, 0.4));
        break;
      }

      // 10. APPLE IPHONE 16 PRO MAX 3D MODEL
      case 'mobile-apple': {
        // Flat Grade 5 Titanium Chassis Frame
        const bodyGeo = new THREE.BoxGeometry(1.68, 3.42, 0.22);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Front 6.9" ProMotion OLED Screen
        const screenGeo = new THREE.PlaneGeometry(1.58, 3.32);
        const screen = new THREE.Mesh(screenGeo, materials.dial);
        screen.position.z = 0.12;
        group.add(screen);
        registerExplodedPart(screen, new THREE.Vector3(0, 0, 0.4));

        // Dynamic Island Pill Cutout
        const pillGeo = new THREE.CapsuleGeometry(0.08, 0.28, 8, 16);
        pillGeo.rotateZ(Math.PI / 2);
        const dynamicIsland = new THREE.Mesh(pillGeo, materials.accent);
        dynamicIsland.position.set(0, 1.42, 0.13);
        group.add(dynamicIsland);

        // Rear Raised Matte Glass Camera Plateau
        const camPlateauGeo = new THREE.BoxGeometry(0.88, 0.88, 0.1);
        const camPlateau = new THREE.Mesh(camPlateauGeo, materials.accent);
        camPlateau.position.set(-0.36, 1.15, -0.16);
        group.add(camPlateau);
        registerExplodedPart(camPlateau, new THREE.Vector3(-0.3, 0.3, -0.4));

        // Triangular Triple Sapphire Camera Fusion Lenses
        [
          [-0.54, 1.34],
          [-0.54, 0.96],
          [-0.18, 1.15],
        ].forEach(([x, y]) => {
          const lensRimGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 24);
          lensRimGeo.rotateX(Math.PI / 2);
          const lensRim = new THREE.Mesh(lensRimGeo, materials.metal);
          lensRim.position.set(x, y, -0.22);
          group.add(lensRim);

          const lensGlassGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.12, 20);
          lensGlassGeo.rotateX(Math.PI / 2);
          const lensGlass = new THREE.Mesh(lensGlassGeo, materials.glass);
          lensGlass.position.set(x, y, -0.23);
          group.add(lensGlass);
        });

        // Rear MagSafe Magnetic Inductive Ring
        const magRingGeo = new THREE.TorusGeometry(0.55, 0.04, 16, 36);
        const magRing = new THREE.Mesh(magRingGeo, materials.glow);
        magRing.position.set(0, -0.15, -0.12);
        group.add(magRing);

        // Titanium Action Button & Volume Rockers
        const actionBtn = new THREE.BoxGeometry(0.06, 0.18, 0.1);
        const aBtn = new THREE.Mesh(actionBtn, materials.metal);
        aBtn.position.set(-0.87, 0.95, 0);
        group.add(aBtn);

        const volBtn = new THREE.BoxGeometry(0.06, 0.45, 0.1);
        const vBtn = new THREE.Mesh(volBtn, materials.metal);
        vBtn.position.set(-0.87, 0.5, 0);
        group.add(vBtn);

        // Dedicated Right Camera Control Capacitive Sensor
        const camCtrl = new THREE.BoxGeometry(0.06, 0.32, 0.08);
        const cBtn = new THREE.Mesh(camCtrl, materials.glow);
        cBtn.position.set(0.87, -0.45, 0);
        group.add(cBtn);
        break;
      }

      // 11. NOTHING PHONE (2a) PLUS 3D MODEL (Glyph Cyber LED Interface)
      case 'mobile-nothing': {
        // Transparent Cyber Unibody
        const bodyGeo = new THREE.BoxGeometry(1.66, 3.38, 0.24);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Front 120Hz Flexible AMOLED Screen with Center Punch Hole
        const screenGeo = new THREE.PlaneGeometry(1.56, 3.28);
        const screen = new THREE.Mesh(screenGeo, materials.dial);
        screen.position.z = 0.13;
        group.add(screen);
        registerExplodedPart(screen, new THREE.Vector3(0, 0, 0.4));

        const punchHole = new THREE.CircleGeometry(0.04, 16);
        const pHole = new THREE.Mesh(punchHole, materials.glass);
        pHole.position.set(0, 1.48, 0.14);
        group.add(pHole);

        // Rear Central Wireless Charging Coil Loop
        const coilGeo = new THREE.TorusGeometry(0.58, 0.06, 16, 36);
        const coil = new THREE.Mesh(coilGeo, materials.accent);
        coil.position.set(0, -0.2, -0.13);
        group.add(coil);
        registerExplodedPart(coil, new THREE.Vector3(0, 0, -0.3));

        // Glowing Glyph LED Matrix Arcs (Cyber Lights)
        [
          { radius: 0.68, start: 0, length: Math.PI * 0.8, y: 1.1 },
          { radius: 0.68, start: Math.PI, length: Math.PI * 0.6, y: -0.2 },
          { radius: 0.68, start: -Math.PI * 0.4, length: Math.PI * 0.5, y: -0.2 },
        ].forEach((glyph) => {
          const arcGeo = new THREE.RingGeometry(glyph.radius, glyph.radius + 0.05, 32, 1, glyph.start, glyph.length);
          const arc = new THREE.Mesh(arcGeo, materials.glow);
          arc.position.set(0, glyph.y, -0.14);
          group.add(arc);
        });

        // Dual 50MP Pill Cameras (Centered top horizontal orientation)
        [-0.22, 0.22].forEach((xPos) => {
          const lensGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 24);
          lensGeo.rotateX(Math.PI / 2);
          const lens = new THREE.Mesh(lensGeo, materials.glass);
          lens.position.set(xPos, 1.1, -0.18);
          group.add(lens);
        });

        // Red Tally Recording LED Indicator
        const redTally = new THREE.BoxGeometry(0.06, 0.06, 0.04);
        const rLed = new THREE.Mesh(redTally, materials.glow);
        rLed.position.set(0.48, 1.1, -0.14);
        group.add(rLed);
        break;
      }

      // 12. VIVO X100 PRO ZEISS 3D MODEL (Sunburst Watch Dial Periscope)
      case 'mobile-vivo': {
        // Curved Aerospace Body
        const bodyGeo = new THREE.BoxGeometry(1.68, 3.42, 0.24);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Front Curved 120Hz LTPO AMOLED
        const screenGeo = new THREE.PlaneGeometry(1.58, 3.32);
        const screen = new THREE.Mesh(screenGeo, materials.dial);
        screen.position.z = 0.13;
        group.add(screen);
        registerExplodedPart(screen, new THREE.Vector3(0, 0, 0.4));

        // Huge Centered Circular ZEISS Watch Dial Camera Disc
        const dialBaseGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.12, 48);
        dialBaseGeo.rotateX(Math.PI / 2);
        const dialBase = new THREE.Mesh(dialBaseGeo, materials.accent);
        dialBase.position.set(0, 0.85, -0.18);
        group.add(dialBase);
        registerExplodedPart(dialBase, new THREE.Vector3(0, 0.4, -0.45));

        // Metallic Sunburst Outer Bezel Ring
        const ringGeo = new THREE.TorusGeometry(0.8, 0.05, 16, 48);
        const ring = new THREE.Mesh(ringGeo, materials.metal);
        ring.position.set(0, 0.85, -0.24);
        group.add(ring);

        // Blue ZEISS T* Logo Star Badge
        const zeissBadgeGeo = new THREE.BoxGeometry(0.2, 0.1, 0.02);
        const zeissBadge = new THREE.Mesh(zeissBadgeGeo, materials.glow);
        zeissBadge.position.set(0, 1.45, -0.13);
        group.add(zeissBadge);

        // 4 Quad Camera Lenses inside ZEISS Ring
        [
          [-0.32, 1.05],
          [0.32, 1.05],
          [-0.32, 0.65],
          [0.32, 0.65],
        ].forEach(([x, y]) => {
          const lensGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24);
          lensGeo.rotateX(Math.PI / 2);
          const lens = new THREE.Mesh(lensGeo, materials.glass);
          lens.position.set(x, y, -0.24);
          group.add(lens);
        });
        break;
      }

      // 13. OPPO FIND X7 ULTRA 3D MODEL (Dual Periscope Horizon Leather)
      case 'mobile-oppo': {
        // Body with Curved Ergonomics
        const bodyGeo = new THREE.BoxGeometry(1.68, 3.42, 0.24);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Two-Tone Horizon Vegan Leather Split Backplate (Lower Half)
        const leatherGeo = new THREE.BoxGeometry(1.66, 1.8, 0.04);
        const leather = new THREE.Mesh(leatherGeo, materials.cushion);
        leather.position.set(0, -0.75, -0.13);
        group.add(leather);
        registerExplodedPart(leather, new THREE.Vector3(0, -0.3, -0.2));

        // Giant Circular Quad Periscope Dial
        const dialGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.12, 48);
        dialGeo.rotateX(Math.PI / 2);
        const dial = new THREE.Mesh(dialGeo, materials.accent);
        dial.position.set(0, 0.8, -0.18);
        group.add(dial);
        registerExplodedPart(dial, new THREE.Vector3(0, 0.3, -0.4));

        // Dual Rectangular Periscope Optical Prisms
        [-0.24, 0.24].forEach((xPos) => {
          const periGeo = new THREE.BoxGeometry(0.22, 0.16, 0.08);
          const peri = new THREE.Mesh(periGeo, materials.glass);
          peri.position.set(xPos, 0.65, -0.24);
          group.add(peri);
        });
        break;
      }

      // 14. REDMI NOTE 13 PRO+ 3D MODEL (200MP Curved AMOLED Deco)
      case 'mobile-redmi': {
        const bodyGeo = new THREE.BoxGeometry(1.66, 3.36, 0.23);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // 3D Curved 1.5K Front Display
        const screenGeo = new THREE.PlaneGeometry(1.56, 3.26);
        const screen = new THREE.Mesh(screenGeo, materials.dial);
        screen.position.z = 0.12;
        group.add(screen);
        registerExplodedPart(screen, new THREE.Vector3(0, 0, 0.4));

        // Dual Large 200MP Camera Barrels with Golden Deco Rings
        [
          [-0.42, 1.25],
          [-0.42, 0.75],
        ].forEach(([x, y]) => {
          const barrelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.1, 32);
          barrelGeo.rotateX(Math.PI / 2);
          const barrel = new THREE.Mesh(barrelGeo, materials.metal);
          barrel.position.set(x, y, -0.16);
          group.add(barrel);

          const innerLens = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 24);
          innerLens.rotateX(Math.PI / 2);
          const lens = new THREE.Mesh(innerLens, materials.glass);
          lens.position.set(x, y, -0.18);
          group.add(lens);
        });

        // 200MP OIS Metallic Badge Bar
        const badgeGeo = new THREE.BoxGeometry(0.4, 0.12, 0.02);
        const badge = new THREE.Mesh(badgeGeo, materials.glow);
        badge.position.set(0.2, 1.25, -0.12);
        group.add(badge);
        break;
      }

      // 15. REALME 12 PRO+ LUXURY 3D MODEL (Luxury Watch Bezel & 3D Center Seam)
      case 'mobile-realme': {
        const bodyGeo = new THREE.BoxGeometry(1.68, 3.4, 0.24);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // 3D Vertical Center Racing Zipper Stitch Line down vegan leather back
        const seamGeo = new THREE.BoxGeometry(0.06, 3.36, 0.04);
        const seam = new THREE.Mesh(seamGeo, materials.metal);
        seam.position.set(0, 0, -0.13);
        group.add(seam);

        // Centered Luxury Watch Fluted Bezel Ring with CNC Sunburst Teeth
        const dialGeo = new THREE.CylinderGeometry(0.76, 0.76, 0.12, 48);
        dialGeo.rotateX(Math.PI / 2);
        const dial = new THREE.Mesh(dialGeo, materials.accent);
        dial.position.set(0, 0.85, -0.18);
        group.add(dial);
        registerExplodedPart(dial, new THREE.Vector3(0, 0.4, -0.4));

        const flutedRingGeo = new THREE.TorusGeometry(0.74, 0.05, 16, 48);
        const flutedRing = new THREE.Mesh(flutedRingGeo, materials.metal);
        flutedRing.position.set(0, 0.85, -0.24);
        group.add(flutedRing);

        // Rectangular 64MP Periscope Zoom Lens Cut
        const periGeo = new THREE.BoxGeometry(0.22, 0.16, 0.08);
        const peri = new THREE.Mesh(periGeo, materials.glass);
        peri.position.set(0, 0.65, -0.24);
        group.add(peri);
        break;
      }

      // 16. SAMSUNG GALAXY S24 ULTRA 3D MODEL (Boxy Titanium Slab, S-Pen Silo)
      case 'mobile-samsung': {
        // Sharp Rectangular Boxy Titanium Slab Frame (Zero Corner Radius)
        const bodyGeo = new THREE.BoxGeometry(1.72, 3.46, 0.22);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Flat 6.8" Dynamic AMOLED 2X Display
        const screenGeo = new THREE.PlaneGeometry(1.62, 3.36);
        const screen = new THREE.Mesh(screenGeo, materials.dial);
        screen.position.z = 0.12;
        group.add(screen);
        registerExplodedPart(screen, new THREE.Vector3(0, 0, 0.4));

        // 4 Vertical Individual Floating Camera Lens Rings (Samsung Signature)
        [
          [-0.52, 1.35],
          [-0.52, 0.95],
          [-0.52, 0.55],
          [-0.18, 1.35],
        ].forEach(([x, y]) => {
          const ringGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 24);
          ringGeo.rotateX(Math.PI / 2);
          const ring = new THREE.Mesh(ringGeo, materials.metal);
          ring.position.set(x, y, -0.16);
          group.add(ring);

          const lens = new THREE.CylinderGeometry(0.11, 0.11, 0.1, 20);
          lens.rotateX(Math.PI / 2);
          const glass = new THREE.Mesh(lens, materials.glass);
          glass.position.set(x, y, -0.17);
          group.add(glass);
        });

        // Bottom Edge S-Pen Stylus Silo & Clicker Button
        const spenGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16);
        const spen = new THREE.Mesh(spenGeo, materials.glow);
        spen.position.set(-0.65, -1.75, 0);
        group.add(spen);
        registerExplodedPart(spen, new THREE.Vector3(0, -0.4, 0));
        break;
      }

      // 17. ONEPLUS 12 5G 3D MODEL (Hasselblad Flowing Circular Bezel)
      case 'mobile-oneplus': {
        const bodyGeo = new THREE.BoxGeometry(1.68, 3.42, 0.24);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Flowing Circular Watch Bezel that connects to the Left Frame Rail
        const bezelGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.12, 40);
        bezelGeo.rotateX(Math.PI / 2);
        const bezel = new THREE.Mesh(bezelGeo, materials.accent);
        bezel.position.set(-0.25, 0.9, -0.18);
        group.add(bezel);
        registerExplodedPart(bezel, new THREE.Vector3(-0.3, 0.3, -0.4));

        // 4 Hasselblad Camera Rings
        [
          [-0.45, 1.08],
          [-0.05, 1.08],
          [-0.45, 0.72],
          [-0.05, 0.72],
        ].forEach(([x, y]) => {
          const ring = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24);
          ring.rotateX(Math.PI / 2);
          const rMesh = new THREE.Mesh(ring, materials.metal);
          rMesh.position.set(x, y, -0.24);
          group.add(rMesh);
        });

        // Left Frame 3-Position Alert Slider
        const sliderGeo = new THREE.BoxGeometry(0.06, 0.28, 0.08);
        const slider = new THREE.Mesh(sliderGeo, materials.metal);
        slider.position.set(-0.87, 0.9, 0);
        group.add(slider);
        break;
      }

      // 18. GENERIC HIGH-END SMARTPHONE
      case 'mobile-generic': {
        const bodyGeo = new THREE.BoxGeometry(1.68, 3.4, 0.22);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        const screenGeo = new THREE.PlaneGeometry(1.58, 3.3);
        const screen = new THREE.Mesh(screenGeo, materials.dial);
        screen.position.z = 0.12;
        group.add(screen);

        const camIslandGeo = new THREE.BoxGeometry(0.75, 0.9, 0.1);
        const camIsland = new THREE.Mesh(camIslandGeo, materials.accent);
        camIsland.position.set(-0.4, 1.1, -0.16);
        group.add(camIsland);

        [
          [-0.4, 1.3],
          [-0.4, 0.9],
        ].forEach(([x, y]) => {
          const lens = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 20);
          lens.rotateX(Math.PI / 2);
          const lMesh = new THREE.Mesh(lens, materials.glass);
          lMesh.position.set(x, y, -0.22);
          group.add(lMesh);
        });
        break;
      }

      // 19. SONY PLAYSTATION 5 PRO 3D MODEL (Futuristic Dual Wing Fins & Blue Light Slit)
      case 'console-ps5': {
        // Inner Black Monolithic Core
        const coreGeo = new THREE.BoxGeometry(0.68, 3.4, 1.9);
        const core = new THREE.Mesh(coreGeo, materials.dial);
        core.castShadow = true;
        group.add(core);
        registerExplodedPart(core, new THREE.Vector3(0, 0, 0));

        // Left Outer Curved Wing Plate
        const leftWingGeo = new THREE.BoxGeometry(0.1, 3.65, 2.15);
        const leftWing = new THREE.Mesh(leftWingGeo, materials.chassis);
        leftWing.position.set(-0.42, 0.05, 0.05);
        leftWing.rotation.z = 0.04;
        group.add(leftWing);
        registerExplodedPart(leftWing, new THREE.Vector3(-0.6, 0.2, 0));

        // Right Outer Curved Wing Plate (Asymmetric with Drive Bump)
        const rightWingGeo = new THREE.BoxGeometry(0.1, 3.65, 2.15);
        const rightWing = new THREE.Mesh(rightWingGeo, materials.chassis);
        rightWing.position.set(0.42, 0.05, 0.05);
        rightWing.rotation.z = -0.04;
        group.add(rightWing);
        registerExplodedPart(rightWing, new THREE.Vector3(0.6, 0.2, 0));

        // Signature Glowing Blue LED Slit Strips
        [-0.35, 0.35].forEach((xPos) => {
          const slitGeo = new THREE.BoxGeometry(0.04, 3.1, 0.04);
          const slit = new THREE.Mesh(slitGeo, materials.glow);
          slit.position.set(xPos, 0.1, 0.96);
          group.add(slit);
        });

        // Front Blu-ray Disc Slot & USB-C / USB-A Ports
        const slotGeo = new THREE.BoxGeometry(0.04, 1.2, 0.04);
        const slot = new THREE.Mesh(slotGeo, materials.metal);
        slot.position.set(0.38, -0.6, 0.98);
        group.add(slot);

        const portUsbC = new THREE.BoxGeometry(0.06, 0.04, 0.04);
        const pC = new THREE.Mesh(portUsbC, materials.metal);
        pC.position.set(0, -0.2, 0.97);
        group.add(pC);

        // Circular Chrome Base Stand
        const baseGeo = new THREE.CylinderGeometry(0.9, 0.95, 0.12, 32);
        const base = new THREE.Mesh(baseGeo, materials.metal);
        base.position.set(0, -1.82, 0);
        group.add(base);
        registerExplodedPart(base, new THREE.Vector3(0, -0.4, 0));
        break;
      }

      // 20. MICROSOFT XBOX SERIES X 3D MODEL (Monolithic Matte Tower & Green Top Grill)
      case 'console-xbox': {
        // Monolithic Rectangular Tower Chassis
        const towerGeo = new THREE.BoxGeometry(1.65, 3.3, 1.65);
        const tower = new THREE.Mesh(towerGeo, materials.chassis);
        tower.castShadow = true;
        group.add(tower);
        registerExplodedPart(tower, new THREE.Vector3(0, 0, 0));

        // Top Recessed Concave Ventilation Dome
        const topVentGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.1, 32);
        const topVent = new THREE.Mesh(topVentGeo, materials.dial);
        topVent.position.set(0, 1.68, 0);
        group.add(topVent);
        registerExplodedPart(topVent, new THREE.Vector3(0, 0.5, 0));

        // Emerald Cyber Green Ambient Glow inside Top Grille
        const greenGlowGeo = new THREE.RingGeometry(0.25, 0.65, 32);
        greenGlowGeo.rotateX(-Math.PI / 2);
        const greenGlow = new THREE.Mesh(greenGlowGeo, materials.glow);
        greenGlow.position.set(0, 1.72, 0);
        group.add(greenGlow);

        // Front Glowing Spherical Xbox Power Button
        const xboxBtnGeo = new THREE.SphereGeometry(0.09, 16, 16);
        const xboxBtn = new THREE.Mesh(xboxBtnGeo, materials.glow);
        xboxBtn.position.set(-0.55, 1.25, 0.84);
        group.add(xboxBtn);

        // Slot-loading 4K Ultra HD Blu-Ray Disc Drive
        const discSlotGeo = new THREE.BoxGeometry(0.04, 1.1, 0.04);
        const discSlot = new THREE.Mesh(discSlotGeo, materials.metal);
        discSlot.position.set(-0.58, -0.4, 0.84);
        group.add(discSlot);

        // Front USB 3.1 Port & Pairing Button
        const usbPort = new THREE.BoxGeometry(0.1, 0.05, 0.04);
        const uMesh = new THREE.Mesh(usbPort, materials.metal);
        uMesh.position.set(0.55, -1.25, 0.84);
        group.add(uMesh);
        break;
      }

      // 21. NINTENDO SWITCH OLED 3D MODEL (7.0" OLED & Detachable Joy-Cons)
      case 'console-switch': {
        // Center Tablet Console Body with 7.0" OLED Screen
        const tabletGeo = new THREE.BoxGeometry(2.35, 1.75, 0.18);
        const tablet = new THREE.Mesh(tabletGeo, materials.dial);
        tablet.castShadow = true;
        group.add(tablet);
        registerExplodedPart(tablet, new THREE.Vector3(0, 0, 0));

        const screenGeo = new THREE.PlaneGeometry(2.15, 1.55);
        const screen = new THREE.Mesh(screenGeo, materials.glass);
        screen.position.z = 0.1;
        group.add(screen);

        // Left Joy-Con (Neon Blue / White)
        const leftJoyGeo = new THREE.BoxGeometry(0.72, 1.75, 0.22);
        const leftJoy = new THREE.Mesh(leftJoyGeo, materials.chassis);
        leftJoy.position.set(-1.54, 0, 0.02);
        group.add(leftJoy);
        registerExplodedPart(leftJoy, new THREE.Vector3(-0.6, 0, 0));

        // Left Thumbstick & Direction Buttons
        const lStickGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 20);
        lStickGeo.rotateX(Math.PI / 2);
        const lStick = new THREE.Mesh(lStickGeo, materials.accent);
        lStick.position.set(-1.54, 0.38, 0.16);
        group.add(lStick);

        [-0.12, 0.12].forEach((xOff) => {
          [-0.32, -0.52].forEach((yOff) => {
            const btnGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.06, 12);
            btnGeo.rotateX(Math.PI / 2);
            const btn = new THREE.Mesh(btnGeo, materials.metal);
            btn.position.set(-1.54 + xOff, yOff, 0.14);
            group.add(btn);
          });
        });

        // Right Joy-Con (Neon Red / Accent)
        const rightJoyGeo = new THREE.BoxGeometry(0.72, 1.75, 0.22);
        const rightJoy = new THREE.Mesh(rightJoyGeo, materials.accent);
        rightJoy.position.set(1.54, 0, 0.02);
        group.add(rightJoy);
        registerExplodedPart(rightJoy, new THREE.Vector3(0.6, 0, 0));

        // Right ABXY Buttons & Right Thumbstick
        const rStickGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 20);
        rStickGeo.rotateX(Math.PI / 2);
        const rStick = new THREE.Mesh(rStickGeo, materials.dial);
        rStick.position.set(1.54, -0.38, 0.16);
        group.add(rStick);

        [-0.12, 0.12].forEach((xOff) => {
          [0.28, 0.48].forEach((yOff) => {
            const btnGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.06, 12);
            btnGeo.rotateX(Math.PI / 2);
            const btn = new THREE.Mesh(btnGeo, materials.metal);
            btn.position.set(1.54 + xOff, yOff, 0.14);
            group.add(btn);
          });
        });

        // Top L/ZL and R/ZR Shoulder Triggers
        [-1.54, 1.54].forEach((xPos) => {
          const trigGeo = new THREE.BoxGeometry(0.6, 0.1, 0.14);
          const trig = new THREE.Mesh(trigGeo, materials.metal);
          trig.position.set(xPos, 0.92, 0.02);
          group.add(trig);
        });
        break;
      }

      // 22. VALVE STEAM DECK / ROG ALLY X HANDHELD PC 3D MODEL (Ergonomic Grips & Dual Trackpads)
      case 'console-handheld': {
        // Heavy-duty Sculpted Handheld Chassis
        const mainBodyGeo = new THREE.BoxGeometry(3.5, 1.95, 0.28);
        const mainBody = new THREE.Mesh(mainBodyGeo, materials.chassis);
        mainBody.castShadow = true;
        group.add(mainBody);
        registerExplodedPart(mainBody, new THREE.Vector3(0, 0, 0));

        // Left & Right Ergonomic Palm Grip Bulges
        [-1.75, 1.75].forEach((xPos) => {
          const gripGeo = new THREE.CylinderGeometry(0.22, 0.26, 1.85, 20);
          const grip = new THREE.Mesh(gripGeo, materials.cushion);
          grip.position.set(xPos, 0, -0.06);
          group.add(grip);
        });

        // 7.4" Wide Gaming OLED Screen
        const screenGeo = new THREE.PlaneGeometry(2.1, 1.45);
        const screen = new THREE.Mesh(screenGeo, materials.dial);
        screen.position.z = 0.15;
        group.add(screen);
        registerExplodedPart(screen, new THREE.Vector3(0, 0, 0.35));

        // Dual Full-Size Analog Thumbsticks with Capacitive Crowns
        [-1.35, 1.35].forEach((xPos, idx) => {
          const stickBase = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 24);
          stickBase.rotateX(Math.PI / 2);
          const stick = new THREE.Mesh(stickBase, materials.accent);
          stick.position.set(xPos, idx === 0 ? 0.45 : -0.15, 0.2);
          group.add(stick);

          const glowRingGeo = new THREE.TorusGeometry(0.19, 0.02, 12, 24);
          const gRing = new THREE.Mesh(glowRingGeo, materials.glow);
          gRing.position.set(xPos, idx === 0 ? 0.45 : -0.15, 0.22);
          group.add(gRing);
        });

        // Dual Haptic Square Trackpads (Steam Deck Signature)
        [-1.35, 1.35].forEach((xPos) => {
          const padGeo = new THREE.BoxGeometry(0.36, 0.36, 0.04);
          const pad = new THREE.Mesh(padGeo, materials.dial);
          pad.position.set(xPos, -0.62, 0.15);
          group.add(pad);
        });

        // Top Exhaust Ventilation Grille & Shoulder Bumpers
        const ventGeo = new THREE.BoxGeometry(1.2, 0.12, 0.16);
        const vent = new THREE.Mesh(ventGeo, materials.metal);
        vent.position.set(0, 1.02, 0);
        group.add(vent);
        break;
      }

      // 23. GOOGLE PIXEL 9 PRO XL 3D MODEL (Iconic Edge-to-Edge Camera Visor Bar)
      case 'mobile-pixel': {
        const bodyGeo = new THREE.BoxGeometry(1.68, 3.44, 0.22);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Front Super Actua OLED Display
        const screenGeo = new THREE.PlaneGeometry(1.58, 3.34);
        const screen = new THREE.Mesh(screenGeo, materials.dial);
        screen.position.z = 0.12;
        group.add(screen);
        registerExplodedPart(screen, new THREE.Vector3(0, 0, 0.4));

        // Center Punch-hole Camera
        const punchGeo = new THREE.CircleGeometry(0.04, 16);
        const punch = new THREE.Mesh(punchGeo, materials.glass);
        punch.position.set(0, 1.48, 0.13);
        group.add(punch);

        // Iconic Edge-to-Edge Aerospace Aluminum Camera Visor Bar
        const visorGeo = new THREE.BoxGeometry(1.64, 0.72, 0.16);
        const visor = new THREE.Mesh(visorGeo, materials.metal);
        visor.position.set(0, 1.1, -0.16);
        group.add(visor);
        registerExplodedPart(visor, new THREE.Vector3(0, 0.3, -0.4));

        // Pill-Shaped Optical Camera Window
        const pillCamGeo = new THREE.CapsuleGeometry(0.18, 0.72, 8, 20);
        pillCamGeo.rotateZ(Math.PI / 2);
        const pillCam = new THREE.Mesh(pillCamGeo, materials.dial);
        pillCam.position.set(-0.25, 1.1, -0.24);
        group.add(pillCam);

        // Triple Lenses inside Visor Pill
        [-0.48, -0.25, -0.02].forEach((xPos) => {
          const lensGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.06, 20);
          lensGeo.rotateX(Math.PI / 2);
          const lens = new THREE.Mesh(lensGeo, materials.glass);
          lens.position.set(xPos, 1.1, -0.26);
          group.add(lens);
        });

        // Thermometer Sensor & Dual-LED Flash
        const flashGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16);
        flashGeo.rotateX(Math.PI / 2);
        const flash = new THREE.Mesh(flashGeo, materials.glow);
        flash.position.set(0.55, 1.1, -0.24);
        group.add(flash);
        break;
      }

      // 24. XIAOMI 14 ULTRA 5G LEICA 3D MODEL (Stepped Titanium Leica Camera Dial)
      case 'mobile-xiaomi': {
        const bodyGeo = new THREE.BoxGeometry(1.68, 3.42, 0.24);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Front 6.73" Quad-Curved LTPO AMOLED
        const screenGeo = new THREE.PlaneGeometry(1.58, 3.32);
        const screen = new THREE.Mesh(screenGeo, materials.dial);
        screen.position.z = 0.13;
        group.add(screen);
        registerExplodedPart(screen, new THREE.Vector3(0, 0, 0.4));

        // Giant Centered Circular Leica Summilux Camera Disc
        const discBaseGeo = new THREE.CylinderGeometry(0.84, 0.84, 0.14, 48);
        discBaseGeo.rotateX(Math.PI / 2);
        const discBase = new THREE.Mesh(discBaseGeo, materials.accent);
        discBase.position.set(0, 0.85, -0.18);
        group.add(discBase);
        registerExplodedPart(discBase, new THREE.Vector3(0, 0.4, -0.45));

        // Stepped Golden/Titanium Bezel Ring
        const goldBezelGeo = new THREE.TorusGeometry(0.82, 0.04, 16, 48);
        const goldBezel = new THREE.Mesh(goldBezelGeo, materials.metal);
        goldBezel.position.set(0, 0.85, -0.25);
        group.add(goldBezel);

        // Quad 50MP Leica Aperture Lenses (with rectangular periscope)
        [
          [-0.32, 1.05],
          [0.32, 1.05],
          [-0.32, 0.65],
        ].forEach(([x, y]) => {
          const lGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24);
          lGeo.rotateX(Math.PI / 2);
          const lMesh = new THREE.Mesh(lGeo, materials.glass);
          lMesh.position.set(x, y, -0.25);
          group.add(lMesh);
        });

        const periCutGeo = new THREE.BoxGeometry(0.24, 0.16, 0.08);
        const periMesh = new THREE.Mesh(periCutGeo, materials.glass);
        periMesh.position.set(0.32, 0.65, -0.25);
        group.add(periMesh);
        break;
      }

      // 25. ASUS ROG PHONE 8 PRO 3D MODEL (AniMe Vision Mini-LED Matrix & AirTriggers)
      case 'mobile-rog': {
        const bodyGeo = new THREE.BoxGeometry(1.68, 3.42, 0.24);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Front 165Hz AMOLED Display
        const screenGeo = new THREE.PlaneGeometry(1.58, 3.32);
        const screen = new THREE.Mesh(screenGeo, materials.dial);
        screen.position.z = 0.13;
        group.add(screen);
        registerExplodedPart(screen, new THREE.Vector3(0, 0, 0.4));

        // Angled Cyberpunk Camera Island
        const camGeo = new THREE.BoxGeometry(0.8, 0.9, 0.12);
        const cam = new THREE.Mesh(camGeo, materials.accent);
        cam.position.set(-0.38, 1.08, -0.17);
        cam.rotation.z = 0.08;
        group.add(cam);
        registerExplodedPart(cam, new THREE.Vector3(-0.3, 0.3, -0.35));

        // Rear AniMe Vision 341 Mini-LED Matrix Grid
        const matrixGeo = new THREE.PlaneGeometry(1.1, 1.3);
        const matrix = new THREE.Mesh(matrixGeo, materials.glow);
        matrix.position.set(0, -0.65, -0.13);
        group.add(matrix);

        // Ultrasonic AirTrigger Shoulder Buttons
        [-1.1, 1.1].forEach((yPos) => {
          const trigGeo = new THREE.BoxGeometry(0.06, 0.35, 0.08);
          const trig = new THREE.Mesh(trigGeo, materials.metal);
          trig.position.set(0.87, yPos, 0);
          group.add(trig);
        });
        break;
      }

      // 26. iQOO 12 5G BMW MOTORSPORT 3D MODEL (Tricolor Racing Stripes & Porthole Cam)
      case 'mobile-iqoo': {
        const bodyGeo = new THREE.BoxGeometry(1.68, 3.4, 0.23);
        const body = new THREE.Mesh(bodyGeo, materials.chassis);
        body.castShadow = true;
        group.add(body);
        registerExplodedPart(body, new THREE.Vector3(0, 0, 0));

        // Front 144Hz AMOLED Display
        const screenGeo = new THREE.PlaneGeometry(1.58, 3.3);
        const screen = new THREE.Mesh(screenGeo, materials.dial);
        screen.position.z = 0.12;
        group.add(screen);
        registerExplodedPart(screen, new THREE.Vector3(0, 0, 0.4));

        // Porthole Aerospace Camera Window Island
        const portholeGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.12, 36);
        portholeGeo.rotateX(Math.PI / 2);
        const porthole = new THREE.Mesh(portholeGeo, materials.accent);
        porthole.position.set(-0.35, 1.05, -0.17);
        group.add(porthole);
        registerExplodedPart(porthole, new THREE.Vector3(-0.3, 0.3, -0.4));

        // BMW M-Motorsport Vertical Tricolor Racing Stripes
        [
          { hex: '#00e5ff', x: 0.52 }, // Cyan
          { hex: '#001a9c', x: 0.58 }, // Dark Blue
          { hex: '#e60000', x: 0.64 }, // Red
        ].forEach((stripe) => {
          const sGeo = new THREE.BoxGeometry(0.04, 3.32, 0.02);
          const sMat = new THREE.MeshStandardMaterial({ color: stripe.hex, roughness: 0.3 });
          const sMesh = new THREE.Mesh(sGeo, sMat);
          sMesh.position.set(stripe.x, 0, -0.13);
          group.add(sMesh);
        });
        break;
      }

      // 27. META QUEST 3 / MIXED REALITY VR HEADSET 3D MODEL
      case 'console-vr': {
        // Main Visor Headset Chassis
        const visorGeo = new THREE.BoxGeometry(2.35, 1.25, 1.15);
        const visor = new THREE.Mesh(visorGeo, materials.chassis);
        visor.castShadow = true;
        group.add(visor);
        registerExplodedPart(visor, new THREE.Vector3(0, 0, 0));

        // Front Gloss Glass Faceplate
        const faceplateGeo = new THREE.BoxGeometry(2.15, 1.05, 0.06);
        const faceplate = new THREE.Mesh(faceplateGeo, materials.glass);
        faceplate.position.set(0, 0, 0.6);
        group.add(faceplate);
        registerExplodedPart(faceplate, new THREE.Vector3(0, 0, 0.3));

        // Dual RGB Passthrough Camera Lenses (Pill shape)
        [-0.58, 0.58].forEach((xPos) => {
          const lensPillGeo = new THREE.CapsuleGeometry(0.09, 0.22, 8, 16);
          lensPillGeo.rotateZ(Math.PI / 2);
          const lensPill = new THREE.Mesh(lensPillGeo, materials.dial);
          lensPill.position.set(xPos, -0.12, 0.64);
          group.add(lensPill);

          const innerEye = new THREE.CircleGeometry(0.06, 16);
          const iMesh = new THREE.Mesh(innerEye, materials.glow);
          iMesh.position.set(xPos, -0.12, 0.65);
          group.add(iMesh);
        });

        // Center Depth Projector Pill
        const depthGeo = new THREE.BoxGeometry(0.12, 0.28, 0.04);
        const depthMesh = new THREE.Mesh(depthGeo, materials.dial);
        depthMesh.position.set(0, 0, 0.64);
        group.add(depthMesh);

        // Soft Breathable Face Cushion Foam
        const foamGeo = new THREE.BoxGeometry(2.25, 1.15, 0.25);
        const foam = new THREE.Mesh(foamGeo, materials.cushion);
        foam.position.set(0, 0, -0.65);
        group.add(foam);
        registerExplodedPart(foam, new THREE.Vector3(0, 0, -0.3));

        // Adjustable Y-Strap Headband Ring
        const strapGeo = new THREE.TorusGeometry(1.4, 0.08, 12, 36);
        const strap = new THREE.Mesh(strapGeo, materials.accent);
        strap.position.set(0, 0.2, -0.6);
        strap.rotation.x = Math.PI / 2;
        group.add(strap);
        break;
      }

      // 28. DUAL-SCREEN FOLDABLE SMARTPHONE 3D MODEL (e.g., Galaxy Z Fold 6 / OnePlus Open)
      case 'mobile-fold': {
        // Left Wing Chassis (Cover Display Side - Angled 15°)
        const leftWingGroup = new THREE.Group();
        leftWingGroup.position.set(-0.75, 0, 0);
        leftWingGroup.rotation.y = 0.18;

        const lBodyGeo = new THREE.BoxGeometry(1.4, 3.4, 0.16);
        const lBody = new THREE.Mesh(lBodyGeo, materials.chassis);
        lBody.castShadow = true;
        leftWingGroup.add(lBody);

        const lScreenGeo = new THREE.PlaneGeometry(1.3, 3.3);
        const lScreen = new THREE.Mesh(lScreenGeo, materials.dial);
        lScreen.position.z = 0.09;
        leftWingGroup.add(lScreen);

        group.add(leftWingGroup);
        registerExplodedPart(leftWingGroup, new THREE.Vector3(-0.4, 0, 0.2));

        // Right Wing Chassis (Inner Tablet Screen Side - Angled -15°)
        const rightWingGroup = new THREE.Group();
        rightWingGroup.position.set(0.75, 0, 0);
        rightWingGroup.rotation.y = -0.18;

        const rBodyGeo = new THREE.BoxGeometry(1.4, 3.4, 0.16);
        const rBody = new THREE.Mesh(rBodyGeo, materials.chassis);
        rBody.castShadow = true;
        rightWingGroup.add(rBody);

        const rScreenGeo = new THREE.PlaneGeometry(1.3, 3.3);
        const rScreen = new THREE.Mesh(rScreenGeo, materials.dial);
        rScreen.position.z = 0.09;
        rightWingGroup.add(rScreen);

        // Triple Camera Rings on Back of Right Wing
        [1.2, 0.8, 0.4].forEach((yPos) => {
          const cRingGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 20);
          cRingGeo.rotateX(Math.PI / 2);
          const cRing = new THREE.Mesh(cRingGeo, materials.metal);
          cRing.position.set(0.25, yPos, -0.12);
          rightWingGroup.add(cRing);

          const cLens = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
          cLens.rotateX(Math.PI / 2);
          const cLMesh = new THREE.Mesh(cLens, materials.glass);
          cLMesh.position.set(0.25, yPos, -0.13);
          rightWingGroup.add(cLMesh);
        });

        group.add(rightWingGroup);
        registerExplodedPart(rightWingGroup, new THREE.Vector3(0.4, 0, 0.2));

        // Center Dual-Rail FlexHinge Spine Mechanism
        const hingeGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.42, 24);
        const hinge = new THREE.Mesh(hingeGeo, materials.metal);
        hinge.position.set(0, 0, -0.06);
        group.add(hinge);
        registerExplodedPart(hinge, new THREE.Vector3(0, 0, -0.3));
        break;
      }

      // 29. MAGSAFE SMARTPHONE ARMOR CASE (e.g., SEFRON CarbonForge MagArmor)
      case 'phonecase':
      default: {
        // Slim Phone Armor Chassis
        const shellGeo = new THREE.BoxGeometry(1.68, 3.3, 0.26);
        const shell = new THREE.Mesh(shellGeo, materials.chassis);
        shell.castShadow = true;
        group.add(shell);
        registerExplodedPart(shell, new THREE.Vector3(0, 0, 0));

        // 4 Shock-Proof Corner Airbags
        [
          [-0.84, 1.65],
          [0.84, 1.65],
          [-0.84, -1.65],
          [0.84, -1.65],
        ].forEach(([x, y]) => {
          const bumperGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.3, 16);
          const bumper = new THREE.Mesh(bumperGeo, materials.accent);
          bumper.position.set(x, y, 0);
          group.add(bumper);
        });

        // Raised Camera Island Bezel
        const camIslandGeo = new THREE.BoxGeometry(0.8, 0.9, 0.16);
        const camIsland = new THREE.Mesh(camIslandGeo, materials.accent);
        camIsland.position.set(-0.38, 1.1, 0.16);
        group.add(camIsland);
        registerExplodedPart(camIsland, new THREE.Vector3(-0.3, 0.3, 0.4));

        // Triple Sapphire Camera Lens Rings
        [
          [-0.55, 1.3],
          [-0.55, 0.9],
          [-0.22, 1.1],
        ].forEach(([x, y]) => {
          const lensGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.08, 20);
          lensGeo.rotateX(Math.PI / 2);
          const lens = new THREE.Mesh(lensGeo, materials.glass);
          lens.position.set(x, y, 0.25);
          group.add(lens);
        });

        // Rear MagSafe Array Ring
        const magRingGeo = new THREE.TorusGeometry(0.55, 0.05, 16, 32);
        const magRing = new THREE.Mesh(magRingGeo, materials.glow);
        magRing.position.set(0, -0.1, -0.14);
        group.add(magRing);
        registerExplodedPart(magRing, new THREE.Vector3(0, 0, -0.4));

        const magAlignmentLine = new THREE.BoxGeometry(0.08, 0.32, 0.02);
        const magLine = new THREE.Mesh(magAlignmentLine, materials.glow);
        magLine.position.set(0, -0.85, -0.14);
        group.add(magLine);
        break;
      }
    }

    return { group, explodedParts };
  }, []);

  // -------------------------------------------------------------
  // INITIALIZE THREE.JS WEBGL SCENE
  // -------------------------------------------------------------
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 500;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2.6, 1.6, 3.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // 4. Ground Shadow Grid Floor
    const groundGeo = new THREE.PlaneGeometry(8, 8);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -1.75;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Decorative Holographic Floor Circle
    const gridCircleGeo = new THREE.RingGeometry(1.6, 2.2, 48);
    gridCircleGeo.rotateX(-Math.PI / 2);
    const gridCircleMat = new THREE.MeshBasicMaterial({
      color: 0x00e3fd,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
    });
    const gridCircle = new THREE.Mesh(gridCircleGeo, gridCircleMat);
    gridCircle.position.y = -1.74;
    scene.add(gridCircle);

    // 5. Studio Lighting Rig
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    lightsGroup.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.001;
    lightsGroup.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00e3fd, 1.6);
    fillLight.position.set(-4, 2, -3);
    lightsGroup.add(fillLight);

    const rimLight = new THREE.PointLight(0x3b82f6, 3.2, 10);
    rimLight.position.set(0, 3, -3.5);
    lightsGroup.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x00e3fd, 1.2, 6);
    bottomGlow.position.set(0, -2, 0);
    lightsGroup.add(bottomGlow);

    scene.add(lightsGroup);

    // 6. Materials with PBR Setup and Dynamic Color Tint
    const threeColor = parseColor(effectiveHex);
    const materials = {
      chassis: new THREE.MeshPhysicalMaterial({
        color: threeColor,
        roughness: 0.28,
        metalness: 0.65,
        clearcoat: 0.35,
        clearcoatRoughness: 0.1,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.25,
        metalness: 0.85,
      }),
      glow: new THREE.MeshStandardMaterial({
        color: threeColor,
        emissive: threeColor,
        emissiveIntensity: 0.7,
        roughness: 0.2,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.2,
        metalness: 0.95,
      }),
      cushion: new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.85,
        metalness: 0.1,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        roughness: 0.05,
        ior: 1.5,
      }),
      dial: new THREE.MeshStandardMaterial({
        color: 0x090a0f,
        roughness: 0.1,
        metalness: 0.2,
      }),
    };
    materialsRef.current = materials;

    // 7. Generate 100% Exact 3D Product Mesh
    const { group, explodedParts } = buildProduct3DModel(effectiveProduct, materials);
    modelGroupRef.current = group;
    explodedPartsRef.current = explodedParts;
    scene.add(group);

    // 8. Render Animation Loop
    const animate = () => {
      reqAnimFrameRef.current = requestAnimationFrame(animate);

      // Auto-spin rotation
      if (isAutoSpinning && modelGroupRef.current) {
        rotationAngleRef.current.yaw += 0.012;
      }

      // Smooth Camera Interpolation towards target position
      if (cameraRef.current) {
        const cam = cameraRef.current;
        cam.position.lerp(targetCamPosRef.current, 0.08);
        cam.lookAt(targetLookAtRef.current);
      }

      // Smooth Exploded View Animation
      if (explodedPartsRef.current.length > 0) {
        explodedPartsRef.current.forEach(({ mesh, originalPos, targetPos }) => {
          const dest = isExploded ? targetPos : originalPos;
          mesh.position.lerp(dest, 0.1);
        });
      }

      // Apply rotation to model group from yaw/pitch
      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.y = rotationAngleRef.current.yaw;
        modelGroupRef.current.rotation.x = rotationAngleRef.current.pitch;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqAnimFrameRef.current) cancelAnimationFrame(reqAnimFrameRef.current);
      renderer.dispose();
      scene.clear();
    };
  }, [effectiveProduct, buildProduct3DModel]);

  // -------------------------------------------------------------
  // UPDATE 3D COLOR MATERIALS WHEN SELECTION CHANGES
  // -------------------------------------------------------------
  useEffect(() => {
    if (!materialsRef.current) return;
    const newColor = parseColor(effectiveHex);

    // Update chassis base color
    materialsRef.current.chassis.color.set(newColor);
    materialsRef.current.chassis.needsUpdate = true;

    // Update LED emissive core
    materialsRef.current.glow.color.set(newColor);
    materialsRef.current.glow.emissive.set(newColor);
    materialsRef.current.glow.needsUpdate = true;

    // Subtle finish parameters
    if (effectiveColorName.toLowerCase().includes('titanium') || effectiveColorName.toLowerCase().includes('silver')) {
      materialsRef.current.chassis.metalness = 0.9;
      materialsRef.current.chassis.roughness = 0.2;
    } else if (effectiveColorName.toLowerCase().includes('carbon') || effectiveColorName.toLowerCase().includes('black')) {
      materialsRef.current.chassis.metalness = 0.35;
      materialsRef.current.chassis.roughness = 0.4;
    } else {
      materialsRef.current.chassis.metalness = 0.65;
      materialsRef.current.chassis.roughness = 0.25;
    }
  }, [effectiveHex, effectiveColorName]);

  // -------------------------------------------------------------
  // UPDATE WIREFRAME MODE
  // -------------------------------------------------------------
  useEffect(() => {
    if (!materialsRef.current) return;
    materialsRef.current.chassis.wireframe = isWireframe;
    materialsRef.current.accent.wireframe = isWireframe;
    materialsRef.current.metal.wireframe = isWireframe;
    materialsRef.current.cushion.wireframe = isWireframe;
  }, [isWireframe]);

  // -------------------------------------------------------------
  // UPDATE STUDIO LIGHTING THEMES (INCLUDING DYNAMIC THEME SYNC)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!lightsGroupRef.current) return;
    const lights = lightsGroupRef.current.children as THREE.Light[];
    const fillLight = lights[2] as THREE.DirectionalLight;
    const rimLight = lights[3] as THREE.PointLight;

    if (!fillLight || !rimLight) return;

    if (studioLighting === 'theme') {
      const colors = getThemeColors();
      fillLight.color.set(new THREE.Color(colors.primary));
      rimLight.color.set(new THREE.Color(colors.accent));
    } else if (studioLighting === 'cyan') {
      fillLight.color.set(0x00e3fd);
      rimLight.color.set(0x3b82f6);
    } else if (studioLighting === 'neon') {
      fillLight.color.set(0xa855f7);
      rimLight.color.set(0xec4899);
    } else if (studioLighting === 'warm') {
      fillLight.color.set(0xf59e0b);
      rimLight.color.set(0xffedd5);
    } else if (studioLighting === 'stealth') {
      fillLight.color.set(0x475569);
      rimLight.color.set(0xe2e8f0);
    }
  }, [studioLighting, theme, getThemeColors]);

  // -------------------------------------------------------------
  // EXPORT 4K STUDIO SNAPSHOT
  // -------------------------------------------------------------
  const handleExportSnapshot = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    try {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      const dataURL = rendererRef.current.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `SEFRON_${effectiveProduct.name.replace(/\s+/g, '_')}_${effectiveColorName}_3D_Studio.png`;
      link.href = dataURL;
      link.click();
      showToast('4K Studio Snapshot downloaded to your system!', 'success');
    } catch {
      showToast('Could not export 3D render at this moment', 'error');
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const factor = direction === 'in' ? 0.85 : 1.15;
    cameraDistanceRef.current = Math.max(2.0, Math.min(7.5, cameraDistanceRef.current * factor));
    targetCamPosRef.current.normalize().multiplyScalar(cameraDistanceRef.current);
  };

  // -------------------------------------------------------------
  // GET TECHNICAL HOTSPOTS BY ARCHETYPE
  // -------------------------------------------------------------
  const hotspots = (() => {
    const archetype = getProductArchetype(effectiveProduct);
    if (archetype.startsWith('mobile')) {
      return [
        { id: 1, title: 'Optics System', desc: '50MP Sensor with Variable Physical Diaphragm & Optical Image Stabilization', top: '28%', left: '34%' },
        { id: 2, title: 'Grade 5 Titanium', desc: 'CNC-Milled Aerospace Titanium Perimeter Armor', top: '70%', left: '22%' },
        { id: 3, title: 'Neural Silicon', desc: '3nm AI Bionic Processor with 35 TFLOPs Multimodal Engine', top: '52%', left: '68%' },
      ];
    }
    if (archetype.startsWith('console')) {
      return [
        { id: 1, title: 'Custom GPU', desc: 'AMD RDNA Graphics with PSSR Neural Super-Resolution', top: '35%', left: '48%' },
        { id: 2, title: 'Cooling Matrix', desc: 'Dual-Vapor Chamber Thermal Exhaust Architecture', top: '65%', left: '55%' },
        { id: 3, title: 'Tactile Controls', desc: 'Hall Effect Precision Thumbsticks & Dynamic Triggers', top: '50%', left: '22%' },
      ];
    }
    if (archetype === 'headphones' || archetype === 'earbuds') {
      return [
        { id: 1, title: 'Graphene Transducers', desc: '11mm Graphene Acoustic Drivers for Lossless 96kHz Fidelity', top: '35%', left: '38%' },
        { id: 2, title: 'Hybrid ANC Matrix', desc: '-48dB Triple Beamforming Noise Cancellation Array', top: '60%', left: '65%' },
      ];
    }
    if (archetype === 'smartwatch') {
      return [
        { id: 1, title: 'Bio-PPG Array', desc: 'Multi-Wavelength Optical Heart Rate, SpO2 & Skin Temp', top: '48%', left: '50%' },
        { id: 2, title: 'Sapphire Crystal', desc: '9H+ Mohs Diamond-Grade Anti-Reflective Glass Crystal', top: '30%', left: '35%' },
      ];
    }
    return [
      { id: 1, title: 'GaN III Semiconductor', desc: 'High-Density Gallium Nitride Power Architecture', top: '45%', left: '45%' },
      { id: 2, title: 'ThermalGuard 4.0', desc: '40x/sec Real-time Micro-Temperature Telemetry', top: '65%', left: '60%' },
    ];
  })();

  // -------------------------------------------------------------
  // CAMERA VIEW ANGLE CONTROLS (FRONT, BACK, UP, DOWN, LEFT, RIGHT, ISO)
  // -------------------------------------------------------------
  const setCameraView = (view: CameraViewAngle) => {
    setCurrentView(view);
    setIsAutoSpinning(false);
    const dist = cameraDistanceRef.current;

    switch (view) {
      case 'front':
        targetCamPosRef.current.set(0, 0, dist);
        rotationAngleRef.current = { yaw: 0, pitch: 0 };
        break;
      case 'back':
        targetCamPosRef.current.set(0, 0, -dist);
        rotationAngleRef.current = { yaw: 0, pitch: 0 };
        break;
      case 'up':
        targetCamPosRef.current.set(0, dist, 0.001);
        rotationAngleRef.current = { yaw: 0, pitch: 0 };
        break;
      case 'down':
        targetCamPosRef.current.set(0, -dist, 0.001);
        rotationAngleRef.current = { yaw: 0, pitch: 0 };
        break;
      case 'left':
        targetCamPosRef.current.set(-dist, 0, 0);
        rotationAngleRef.current = { yaw: 0, pitch: 0 };
        break;
      case 'right':
        targetCamPosRef.current.set(dist, 0, 0);
        rotationAngleRef.current = { yaw: 0, pitch: 0 };
        break;
      case 'iso':
      default:
        targetCamPosRef.current.set(2.6, 1.6, 3.2);
        rotationAngleRef.current = { yaw: 0.5, pitch: 0.25 };
        break;
    }

    if (onAngleChange) {
      onAngleChange(rotationAngleRef.current.yaw, rotationAngleRef.current.pitch);
    }
  };

  // -------------------------------------------------------------
  // MOUSE & TOUCH ORBIT DRAGGING INTERACTION
  // -------------------------------------------------------------
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    previousMousePosRef.current = { x: e.clientX, y: e.clientY };
    setIsAutoSpinning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !interactive) return;
    const deltaX = e.clientX - previousMousePosRef.current.x;
    const deltaY = e.clientY - previousMousePosRef.current.y;

    rotationAngleRef.current.yaw += deltaX * 0.009;
    rotationAngleRef.current.pitch += deltaY * 0.009;
    rotationAngleRef.current.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotationAngleRef.current.pitch));

    previousMousePosRef.current = { x: e.clientX, y: e.clientY };

    if (onAngleChange) {
      onAngleChange(rotationAngleRef.current.yaw, rotationAngleRef.current.pitch);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch handlers for mobile / tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive || e.touches.length === 0) return;
    isDraggingRef.current = true;
    previousMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setIsAutoSpinning(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !interactive || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - previousMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePosRef.current.y;

    rotationAngleRef.current.yaw += deltaX * 0.009;
    rotationAngleRef.current.pitch += deltaY * 0.009;
    rotationAngleRef.current.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotationAngleRef.current.pitch));

    previousMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  // Zoom control via Wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (!interactive) return;
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
    cameraDistanceRef.current = Math.max(2.0, Math.min(7.5, cameraDistanceRef.current * zoomFactor));
    targetCamPosRef.current.normalize().multiplyScalar(cameraDistanceRef.current);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] select-none flex flex-col items-center justify-center overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Left: 6-Axis Camera View Angle Switcher */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-[90%] pointer-events-auto">
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-[#090a0f]/90 border border-white/15 backdrop-blur-md shadow-xl">
          <div className="px-2 py-1 flex items-center gap-1.5 border-r border-white/10">
            <Scan className="w-3.5 h-3.5 text-[#00e3fd]" />
            <span className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-wider">
              VIEW:
            </span>
          </div>

          {(
            [
              { key: 'front', label: 'Front' },
              { key: 'back', label: 'Back' },
              { key: 'up', label: 'Top' },
              { key: 'down', label: 'Bottom' },
              { key: 'left', label: 'Left' },
              { key: 'right', label: 'Right' },
              { key: 'iso', label: '3D Orbit' },
            ] as const
          ).map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCameraView(v.key);
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all ${
                currentView === v.key
                  ? 'bg-gradient-to-r from-[#3b82f6] to-[#00e3fd] text-[#001a42] shadow-[0_0_12px_rgba(0,227,253,0.5)] scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Right: Studio Lighting, Wireframe, Hotspots & Export */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-2xl bg-[#090a0f]/90 border border-white/15 backdrop-blur-md shadow-xl pointer-events-auto">
        {/* Dynamic Theme Sync Lighting */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setStudioLighting('theme');
          }}
          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-colors ${
            studioLighting === 'theme' ? 'bg-[#00e3fd] text-[#00285d] font-bold shadow-md' : 'text-gray-400 hover:text-white'
          }`}
          title="Dynamic Theme Lighting"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        {/* Studio Lighting Presets */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setStudioLighting('cyan');
          }}
          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-colors ${
            studioLighting === 'cyan' ? 'bg-[#00e3fd] text-[#00285d]' : 'text-gray-400 hover:text-white'
          }`}
          title="Cyan Cyber Studio"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setStudioLighting('neon');
          }}
          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-colors ${
            studioLighting === 'neon' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
          title="Ultraviolet Neon"
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setStudioLighting('warm');
          }}
          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-colors ${
            studioLighting === 'warm' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
          }`}
          title="Prestige Gold Amber"
        >
          <Sun className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

        {/* Hotspots Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowHotspots(!showHotspots);
          }}
          className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold transition-colors ${
            showHotspots ? 'bg-[#00e3fd] text-[#00285d]' : 'text-gray-400 hover:text-white'
          }`}
          title="Toggle Hardware Technical Hotspots"
        >
          {showHotspots ? 'PINS: ON' : 'PINS'}
        </button>

        {/* Wireframe Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsWireframe(!isWireframe);
          }}
          className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold transition-colors ${
            isWireframe ? 'bg-[#00e3fd] text-[#00285d]' : 'text-gray-400 hover:text-white'
          }`}
          title="Toggle 3D Wireframe Mesh"
        >
          {isWireframe ? 'MESH' : 'MESH'}
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

        {/* 4K Snapshot Export */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleExportSnapshot();
          }}
          className="w-7 h-7 rounded-xl flex items-center justify-center text-gray-300 hover:text-[#00e3fd] hover:bg-white/10 transition-colors"
          title="Export 4K Studio Snapshot PNG"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Technical Hotspot Overlay Pins */}
      {showHotspots && !isExploded && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {hotspots.map((hs) => {
            const isActive = activeHotspot === hs.id;
            return (
              <div
                key={hs.id}
                className="absolute pointer-events-auto group"
                style={{ top: hs.top, left: hs.left }}
              >
                {/* Pulsating Pin */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(isActive ? null : hs.id);
                  }}
                  onMouseEnter={() => setActiveHotspot(hs.id)}
                  className="relative -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#00e3fd] text-[#001a42] font-mono font-bold text-[10px] flex items-center justify-center shadow-[0_0_15px_rgba(0,227,253,0.8)] hover:scale-125 transition-transform"
                >
                  <span>{hs.id}</span>
                  <span className="absolute inset-0 rounded-full bg-[#00e3fd] animate-ping opacity-75 pointer-events-none" />
                </button>

                {/* Holographic Tooltip Popover */}
                {isActive && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-3 rounded-2xl bg-[#0e111a]/95 border border-[#00e3fd]/40 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-30">
                    <div className="flex items-center gap-1.5 text-[#00e3fd] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                      <Tag className="w-3 h-3" />
                      <span>{hs.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-tight">
                      {hs.desc}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Floating Controls Bar */}
      {showControlsBar && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Telemetry Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#090a0f]/90 border border-white/15 backdrop-blur-md pointer-events-auto shadow-lg">
            <Compass className="w-3.5 h-3.5 text-[#00e3fd]" />
            <span className="text-[10px] font-mono text-gray-300 uppercase font-bold tracking-wider">
              {effectiveProduct.name.split(' ').slice(0, 3).join(' ')} • {effectiveColorName}
            </span>
          </div>

          {/* Action Buttons: Zoom, Explode, Auto-Spin, Reset */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Zoom Controls */}
            <div className="flex items-center bg-[#141824]/90 border border-white/15 rounded-2xl p-0.5 shadow-md">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoom('in');
                }}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoom('out');
                }}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Exploded View */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExploded(!isExploded);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-[11px] font-mono font-bold transition-all shadow-md ${
                isExploded
                  ? 'bg-[#00e3fd] border-[#00e3fd] text-[#00285d] shadow-[0_0_12px_rgba(0,227,253,0.5)]'
                  : 'bg-[#141824]/90 border-white/15 text-gray-300 hover:text-white'
              }`}
              title="Toggle Exploded Assembly View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isExploded ? 'EXPLODED: ON' : 'EXPLODE'}</span>
            </button>

            {/* Auto-Spin */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAutoSpinning(!isAutoSpinning);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-[11px] font-mono font-bold transition-all shadow-md ${
                isAutoSpinning
                  ? 'bg-[#00e3fd] border-[#00e3fd] text-[#00285d] shadow-[0_0_12px_rgba(0,227,253,0.5)]'
                  : 'bg-[#141824]/90 border-white/15 text-gray-300 hover:text-white'
              }`}
              title={isAutoSpinning ? 'Pause 360° Auto-Spin' : 'Start 360° Auto-Spin'}
            >
              {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoSpinning ? 'PAUSE' : '360° SPIN'}</span>
            </button>

            {/* Reset View */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCameraView('iso');
                cameraDistanceRef.current = 4.6;
              }}
              className="p-2 rounded-2xl bg-[#141824]/90 hover:bg-[#1e2333] border border-white/15 text-gray-300 hover:text-[#00e3fd] transition-colors shadow-md"
              title="Reset 3D Camera"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Drag Instruction Overlay */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <span className="px-3 py-1 rounded-full bg-[#090a0f]/80 border border-white/10 text-[9px] font-mono text-gray-300 tracking-wider">
          DRAG TO ROTATE 360° • SCROLL TO ZOOM • CLICK PIN FOR SPECS
        </span>
      </div>
    </div>
  );
}

