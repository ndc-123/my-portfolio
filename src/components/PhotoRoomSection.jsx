import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PHOTO_ROOM_WALLS } from '../data/photoRoomData';

/**
 * Procedural Floor Texture Generator
 * Creates a high-res parquet / museum stone texture
 */
function createFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base deep charcoal wood/stone
  ctx.fillStyle = '#18191c';
  ctx.fillRect(0, 0, 1024, 1024);

  // Parquet plank grid
  const plankW = 128;
  const plankH = 32;

  for (let y = 0; y < 1024; y += plankH) {
    const shift = (Math.floor(y / plankH) % 2) * (plankW / 2);
    for (let x = -plankW; x < 1024 + plankW; x += plankW) {
      const px = x + shift;
      // Slight tone variations per plank
      const toneVariation = (Math.sin(px * 13 + y * 7) * 0.5 + 0.5) * 12;
      const r = Math.floor(22 + toneVariation);
      const g = Math.floor(23 + toneVariation * 0.9);
      const b = Math.floor(26 + toneVariation * 0.8);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(px + 1, y + 1, plankW - 2, plankH - 2);

      // Subtle wood grain lines
      ctx.strokeStyle = `rgba(10, 10, 12, 0.4)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, y);
      ctx.lineTo(px + plankW, y);
      ctx.lineTo(px + plankW, y + plankH);
      ctx.stroke();
    }
  }

  // Soft perimeter vignette
  const grad = ctx.createRadialGradient(512, 512, 200, 512, 512, 700);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

/**
 * Museum Label Canvas Texture Generator
 */
function createLabelTexture(title, caption) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Brushed brass / silver plate
  ctx.fillStyle = '#222327';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = '#3a3c44';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 504, 120);

  // Text
  ctx.fillStyle = '#e8e6df';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 256, 48);

  ctx.fillStyle = '#9e9da5';
  ctx.font = '19px sans-serif';
  // Truncate caption if too long
  const displayCaption = caption.length > 44 ? caption.slice(0, 42) + '…' : caption;
  ctx.fillText(displayCaption, 256, 88);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export default function PhotoRoomSection() {
  const containerRef = useRef(null);
  const [activeWallIndex, setActiveWallIndex] = useState(0); // 0: Front, 1: Right, 2: Back, 3: Left
  const [hasInteracted, setHasInteracted] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [playingCdId, setPlayingCdId] = useState(null);

  // Audio manager reference for the 3 interactive vinyl records
  const audioManagerRef = useRef({
    audios: {},
    playingId: null,
  });

  // References to communicate with Three.js animation loop without re-triggering effects
  const controlsRef = useRef({
    targetYaw: 0,
    targetPitch: 0,
    currentYaw: 0,
    currentPitch: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    zoomTarget: 0,
    currentZoom: 0,
    inspectPos: null,
    setTargetYaw: null,
    togglePlayVinyl: null,
  });

  // Initialize audio instances for the 3 vinyl CDs
  useEffect(() => {
    const audioMap = {};
    PHOTO_ROOM_WALLS[2]?.photos.forEach((item) => {
      if (item.audioSrc) {
        const audio = new Audio(item.audioSrc);
        audio.loop = true;
        audio.preload = 'auto';
        audioMap[item.id] = audio;
      }
    });
    audioManagerRef.current.audios = audioMap;

    return () => {
      Object.values(audioMap).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // Toggle vinyl playback and sync audio
  const togglePlayVinyl = useCallback((id) => {
    const mgr = audioManagerRef.current;
    const currentPlaying = mgr.playingId;

    if (currentPlaying === id) {
      // Pause currently playing CD
      if (mgr.audios[id]) {
        mgr.audios[id].pause();
      }
      mgr.playingId = null;
      setPlayingCdId(null);
    } else {
      // Stop previously playing CD
      if (currentPlaying && mgr.audios[currentPlaying]) {
        mgr.audios[currentPlaying].pause();
        mgr.audios[currentPlaying].currentTime = 0;
      }
      // Start newly selected CD
      mgr.playingId = id;
      setPlayingCdId(id);
      if (mgr.audios[id]) {
        mgr.audios[id].currentTime = 0;
        mgr.audios[id].play().catch((err) => {
          console.warn('Audio playback error:', err);
        });
      }
    }
  }, []);

  // Calculate current facing wall (0 to 3) from yaw angle
  const updateWallFromYaw = useCallback((yaw) => {
    // Normalize yaw to [0, 2*PI)
    let norm = (yaw % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    // Wall angles:
    // Front: 0 or 2*PI (center 0)
    // Right: PI/2 (center 1.57)
    // Back: PI (center 3.14)
    // Left: 3*PI/2 (center 4.71)
    const quarter = Math.PI / 2;
    const index = Math.round(norm / quarter) % 4;
    setActiveWallIndex(index);
  }, []);

  // Smoothly rotate camera to face a specific wall
  const rotateToWall = (index) => {
    setHasInteracted(true);
    const targetAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    const target = targetAngles[index % 4];

    // Find shortest angular distance from current yaw
    let current = controlsRef.current.targetYaw;
    let diff = ((target - (current % (2 * Math.PI)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    controlsRef.current.targetYaw = current + diff;
    controlsRef.current.targetPitch = 0; // level horizon
    setActiveWallIndex(index % 4);
    setSelectedPhoto(null);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__rotateToWall = rotateToWall;
      window.__photoRoomControls = controlsRef.current;
      window.__togglePlayVinyl = togglePlayVinyl;
      window.__getAudioState = () => ({
        playingId: audioManagerRef.current.playingId,
      });
      controlsRef.current.togglePlayVinyl = togglePlayVinyl;
    }
  }, [rotateToWall, togglePlayVinyl]);

  const handleNextWall = () => {
    rotateToWall((activeWallIndex + 1) % 4);
  };

  const handlePrevWall = () => {
    rotateToWall((activeWallIndex + 3) % 4);
  };

  const handleReset = () => {
    rotateToWall(0);
  };

  // Close photo inspection modal on Escape key
  useEffect(() => {
    const handleModalKeyDown = (e) => {
      if (e.key === 'Escape' && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleModalKeyDown);
    return () => window.removeEventListener('keydown', handleModalKeyDown);
  }, [selectedPhoto]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    // 1. Scene & Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x131417);

    // Camera at center of room (0, 0, 0)
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    // Ensure supersampling on all displays (at least 2x DPR) for crystal-clear texture & text sharpness
    renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 2), 2.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    if (renderer.domElement) {
      renderer.domElement.style.imageRendering = 'high-quality';
    }
    container.appendChild(renderer.domElement);

    // 2. Room Geometry & Dimensions
    const D = 6.0; // Distance from center to wall
    const roomW = 12.0;
    const roomH = 4.8;
    const roomL = 12.0;

    // Materials
    const floorTexture = createFloorTexture();
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.38,
      metalness: 0.12,
    });

    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0x141518,
      roughness: 0.85,
    });

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x222428,
      roughness: 0.9,
    });

    const baseboardMaterial = new THREE.MeshStandardMaterial({
      color: 0x111214,
      roughness: 0.7,
    });

    // Floor Mesh (y = -roomH/2 = -2.4)
    const floorGeo = new THREE.PlaneGeometry(roomW, roomL);
    const floor = new THREE.Mesh(floorGeo, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -roomH / 2;
    scene.add(floor);

    // Ceiling Mesh (y = +roomH/2 = +2.4)
    const ceilingGeo = new THREE.PlaneGeometry(roomW, roomL);
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomH / 2;
    scene.add(ceiling);

    // 4 Room Walls
    const wallGeoZ = new THREE.PlaneGeometry(roomW, roomH);
    const wallGeoX = new THREE.PlaneGeometry(roomL, roomH);

    // Front Wall (z = -D, faces +Z)
    const frontWall = new THREE.Mesh(wallGeoZ, wallMaterial);
    frontWall.position.set(0, 0, -D);
    scene.add(frontWall);

    // Right Wall (x = +D, faces -X)
    const rightWall = new THREE.Mesh(wallGeoX, wallMaterial);
    rightWall.position.set(D, 0, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Back Wall (z = +D, faces -Z)
    const backWall = new THREE.Mesh(wallGeoZ, wallMaterial);
    backWall.position.set(0, 0, D);
    backWall.rotation.y = Math.PI;
    scene.add(backWall);

    // Left Wall (x = -D, faces +X)
    const leftWall = new THREE.Mesh(wallGeoX, wallMaterial);
    leftWall.position.set(-D, 0, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Baseboard trims around bottom of all 4 walls
    const trimHeight = 0.18;
    const trimGeoZ = new THREE.BoxGeometry(roomW, trimHeight, 0.06);
    const trimGeoX = new THREE.BoxGeometry(0.06, trimHeight, roomL);

    const trimFront = new THREE.Mesh(trimGeoZ, baseboardMaterial);
    trimFront.position.set(0, -roomH / 2 + trimHeight / 2, -D + 0.03);
    scene.add(trimFront);

    const trimBack = new THREE.Mesh(trimGeoZ, baseboardMaterial);
    trimBack.position.set(0, -roomH / 2 + trimHeight / 2, D - 0.03);
    scene.add(trimBack);

    const trimRight = new THREE.Mesh(trimGeoX, baseboardMaterial);
    trimRight.position.set(D - 0.03, -roomH / 2 + trimHeight / 2, 0);
    scene.add(trimRight);

    const trimLeft = new THREE.Mesh(trimGeoX, baseboardMaterial);
    trimLeft.position.set(-D + 0.03, -roomH / 2 + trimHeight / 2, 0);
    scene.add(trimLeft);

    // 3. Lighting Setup
    // Soft Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Wall Spotlights (one dedicated warm wash light per wall)
    const wallLightConfigs = [
      { pos: [0, roomH / 2 - 0.2, -D + 2.4], target: [0, 0, -D] }, // Front
      { pos: [D - 2.4, roomH / 2 - 0.2, 0], target: [D, 0, 0] },   // Right
      { pos: [0, roomH / 2 - 0.2, D - 2.4], target: [0, 0, D] },   // Back
      { pos: [-D + 2.4, roomH / 2 - 0.2, 0], target: [-D, 0, 0] }, // Left
    ];

    wallLightConfigs.forEach(({ pos, target }) => {
      const spot = new THREE.SpotLight(0xfff5ea, 1.35, 14, Math.PI / 3, 0.45, 1.2);
      spot.position.set(...pos);
      const targetObj = new THREE.Object3D();
      targetObj.position.set(...target);
      scene.add(targetObj);
      spot.target = targetObj;
      scene.add(spot);
    });

    // 4. Create 16 Curated Framed Photographs across all 4 walls (Frameless, mounted directly on walls)
    const textureLoader = new THREE.TextureLoader();
    const clickablePhotos = [];
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    // Preload front wall, right wall, back wall, and left wall photos for immediate texture availability
    if (typeof window !== 'undefined') {
      PHOTO_ROOM_WALLS[0]?.photos.forEach((p) => {
        const pre = new Image();
        pre.src = p.src;
      });
      PHOTO_ROOM_WALLS[1]?.photos.forEach((p) => {
        const pre = new Image();
        pre.src = p.src;
      });
      PHOTO_ROOM_WALLS[2]?.photos.forEach((p) => {
        const pre = new Image();
        pre.src = p.src;
      });
      PHOTO_ROOM_WALLS[3]?.photos.forEach((p) => {
        const pre = new Image();
        pre.src = p.src;
      });
    }

    // Horizontal offsets for walls
    const standardXOffsets = [-3.75, -1.25, 1.25, 3.75];
    const frontXOffsets = [-4.14, -1.52, 1.11, 4.22];
    const rightXOffsets = [-3.66, -2.32, 0.13, 3.11];
    const leftXOffsets = [-3.73, -0.27, 3.45];
    const backXOffsets = [-3.0, 0, 3.0];
    const vinylRecords = [];

    PHOTO_ROOM_WALLS.forEach((wall, wallIdx) => {
      // Wall transformation matrix / pivot
      const wallGroup = new THREE.Group();
      const isFrontWall = wall.id === 'front';
      const isRightWall = wall.id === 'right';
      const isBackWall = wall.id === 'back';
      const isLeftWall = wall.id === 'left';

      if (wall.id === 'front') {
        wallGroup.position.set(0, 0, -D);
        wallGroup.rotation.y = 0;
      } else if (wall.id === 'right') {
        wallGroup.position.set(D, 0, 0);
        wallGroup.rotation.y = -Math.PI / 2;
      } else if (wall.id === 'back') {
        wallGroup.position.set(0, 0, D);
        wallGroup.rotation.y = Math.PI;
      } else if (wall.id === 'left') {
        wallGroup.position.set(-D, 0, 0);
        wallGroup.rotation.y = Math.PI / 2;
      }

      wall.photos.forEach((photoData, pIdx) => {
        const photoGroup = new THREE.Group();
        let posX = standardXOffsets[pIdx];
        if (isFrontWall) posX = frontXOffsets[pIdx];
        else if (isRightWall) posX = rightXOffsets[pIdx];
        else if (isLeftWall) posX = leftXOffsets[pIdx];
        else if (isBackWall) posX = backXOffsets[pIdx];

        const posY = (isFrontWall || isRightWall || isLeftWall || isBackWall) ? 0.20 : 0.08; // Eye level slightly above midpoint
        const posZ = 0.015; // Directly on the wall with minimal offset to avoid z-fighting

        photoGroup.position.set(posX, posY, posZ);

        // Calculate dimensions preserving original aspect ratio without distortion
        const aspect = photoData.aspectRatio || (4 / 3);
        let pWidth = 1.72;
        let pHeight = 1.25;

        if (isFrontWall) {
          // Front wall: larger display with proportional scaling
          if (pIdx === 1) {
            // Portrait orientation (Photo 2)
            pHeight = 2.05;
            pWidth = pHeight * aspect;
          } else {
            // Landscape orientation (Photos 1, 3, 4)
            pHeight = 1.95;
            pWidth = pHeight * aspect;
          }
        } else if (isRightWall) {
          // Right wall: Poetry & Anthologies collection from assets/museum (5.png - 8.png)
          pHeight = 1.80;
          pWidth = pHeight * aspect;
        } else if (isLeftWall) {
          // Left wall: Volunteering & Community collection from assets/museum (9.png - 11.png)
          pHeight = 1.80;
          pWidth = pHeight * aspect;
        } else {
          // Other walls: preserve exact original dimensions
          if (aspect >= 1.0) {
            pHeight = 1.25;
            pWidth = Math.min(1.95, pHeight * aspect);
          } else {
            pHeight = 1.35;
            pWidth = pHeight * aspect;
          }
        }

        if (!isBackWall) {
          // Direct Photograph Plane (unframed, mounted directly on wall)
          const photoGeo = new THREE.PlaneGeometry(pWidth, pHeight);
          const photoTexture = textureLoader.load(photoData.src, (loadedTex) => {
            loadedTex.colorSpace = THREE.SRGBColorSpace;
            if (isFrontWall || isRightWall || isLeftWall) {
              loadedTex.anisotropy = maxAniso;
              loadedTex.generateMipmaps = true;
              loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
              loadedTex.magFilter = THREE.LinearFilter;
              loadedTex.needsUpdate = true;
            }
          });
          photoTexture.colorSpace = THREE.SRGBColorSpace;

          if (isFrontWall || isRightWall || isLeftWall) {
            // Maximum sharpness & full resolution texture sampling with anisotropic filtering
            photoTexture.anisotropy = maxAniso;
            photoTexture.generateMipmaps = true;
            photoTexture.minFilter = THREE.LinearMipmapLinearFilter;
            photoTexture.magFilter = THREE.LinearFilter;
          }

          const photoMat = new THREE.MeshBasicMaterial({
            map: photoTexture,
            toneMapped: false, // Preserve original photograph color gamut & contrast without ACES compression
          });
          const photoMesh = new THREE.Mesh(photoGeo, photoMat);
          photoMesh.position.set(0, 0, 0);
          photoMesh.userData = { photoData, wallIdx, pIdx };
          photoGroup.add(photoMesh);
          clickablePhotos.push(photoMesh);
        } else {
          // =====================================================================
          // Back Wall: 3 Interactive Vinyl CDs Exhibition
          // =====================================================================
          const cdRadius = 0.90;

          // 1. Soft Wall Drop Shadow
          const shadowGeo = new THREE.CircleGeometry(cdRadius + 0.04, 48);
          const shadowMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.55,
            depthWrite: false,
          });
          const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
          shadowMesh.position.set(0, -0.015, 0.002);
          photoGroup.add(shadowMesh);

          // 2. Ambient Glowing Halo Ring (visible & pulses when playing)
          const glowColorHex = photoData.id === 'cd-01' ? 0xd97736 : (photoData.id === 'cd-02' ? 0x8b5cf6 : 0x14b8a6);
          const glowGeo = new THREE.RingGeometry(cdRadius * 0.94, cdRadius * 1.12, 48);
          const glowMat = new THREE.MeshBasicMaterial({
            color: glowColorHex,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            side: THREE.DoubleSide,
          });
          const glowMesh = new THREE.Mesh(glowGeo, glowMat);
          glowMesh.position.set(0, 0, 0.005);
          glowMesh.visible = false;
          photoGroup.add(glowMesh);

          // 3. Realistic Vinyl Record Disc Mesh (with microgrooves & center label)
          const discGeo = new THREE.CircleGeometry(cdRadius, 64);
          const discTexture = textureLoader.load(photoData.src, (loadedTex) => {
            loadedTex.colorSpace = THREE.SRGBColorSpace;
            loadedTex.anisotropy = maxAniso;
            loadedTex.generateMipmaps = true;
            loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
            loadedTex.magFilter = THREE.LinearFilter;
            loadedTex.needsUpdate = true;
          });
          discTexture.colorSpace = THREE.SRGBColorSpace;
          discTexture.anisotropy = maxAniso;
          discTexture.generateMipmaps = true;
          discTexture.minFilter = THREE.LinearMipmapLinearFilter;
          discTexture.magFilter = THREE.LinearFilter;

          const discMat = new THREE.MeshStandardMaterial({
            map: discTexture,
            roughness: 0.28,
            metalness: 0.12,
            transparent: true,
            toneMapped: false,
          });
          const discMesh = new THREE.Mesh(discGeo, discMat);
          discMesh.position.set(0, 0, 0.015);
          discMesh.userData = { isVinyl: true, vinylId: photoData.id, photoData };
          photoGroup.add(discMesh);
          clickablePhotos.push(discMesh);

          // 4. Center Turntable Spindle Pin (Stationary brass pin)
          const pegGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.024, 32);
          const pegMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37, // Metallic brass
            roughness: 0.35,
            metalness: 0.85,
          });
          const pegMesh = new THREE.Mesh(pegGeo, pegMat);
          pegMesh.rotation.x = Math.PI / 2;
          pegMesh.position.set(0, 0, 0.024);
          photoGroup.add(pegMesh);

          // 5. Museum Caption Plate Beneath the Vinyl Record
          const canvasW = 2048;
          const canvasH = 280;
          const captionCanvas = document.createElement('canvas');
          captionCanvas.width = canvasW;
          captionCanvas.height = canvasH;
          const ctx = captionCanvas.getContext('2d');

          const prefix = photoData.prefix || photoData.title;
          const text = photoData.text || '';

          const renderVinylCaptionCanvas = (isPlaying = false) => {
            ctx.clearRect(0, 0, canvasW, canvasH);

            const fontSize = 74;
            const startX = 0;
            const startY = 85;

            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            // Bold serif title
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${fontSize}px 'DM Serif Display', 'Bodoni Moda', Georgia, serif`;
            ctx.fillText(prefix, startX, startY);
            const prefixW = ctx.measureText(prefix + ' ').width;

            // Regular serif subtitle
            ctx.font = `400 ${fontSize}px 'DM Serif Display', 'Bodoni Moda', Georgia, serif`;
            ctx.fillText(text, startX + prefixW, startY);

            // Audio status cue line
            ctx.font = `500 52px 'Afacad Flux', sans-serif`;
            if (isPlaying) {
              ctx.fillStyle = '#34d399'; // Emerald green
              ctx.fillText('● Playing  ·  Click to pause', startX, 195);
            } else {
              ctx.fillStyle = '#9ca3af'; // Muted grey
              ctx.fillText('▶ Click to play audio', startX, 195);
            }
          };

          renderVinylCaptionCanvas(false);

          const captionTexture = new THREE.CanvasTexture(captionCanvas);
          captionTexture.anisotropy = maxAniso;
          captionTexture.minFilter = THREE.LinearFilter;
          captionTexture.magFilter = THREE.LinearFilter;
          captionTexture.generateMipmaps = false;

          if (typeof document !== 'undefined' && document.fonts) {
            document.fonts.ready.then(() => {
              renderVinylCaptionCanvas(false);
              captionTexture.needsUpdate = true;
            }).catch(() => {});
          }

          const captionMeshW = 3.20;
          const captionMeshH = 0.36;
          const captionGeo = new THREE.PlaneGeometry(captionMeshW, captionMeshH);
          const captionMat = new THREE.MeshBasicMaterial({
            map: captionTexture,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
          });

          const captionMesh = new THREE.Mesh(captionGeo, captionMat);
          captionMesh.position.x = -cdRadius + captionMeshW / 2;
          const captionGap = 0.14;
          captionMesh.position.y = -cdRadius - captionGap - captionMeshH / 2;
          captionMesh.position.z = 0.004;
          captionMesh.userData = { isVinyl: true, vinylId: photoData.id, photoData };
          photoGroup.add(captionMesh);
          clickablePhotos.push(captionMesh);

          // Register in vinylRecords array for continuous spin & glow animation
          vinylRecords.push({
            id: photoData.id,
            spinMesh: discMesh,
            glowMesh: glowMesh,
            currentSpeed: 0,
            targetSpeed: 0,
            wasPlaying: false,
            updateCaption: (playing) => {
              renderVinylCaptionCanvas(playing);
              captionTexture.needsUpdate = true;
            },
          });
        }

        // Front Wall: Add elegant serif caption (~18-20px on desktop) left-aligned with image left edge
        if (isFrontWall) {
          const canvasW = 2048;
          const canvasH = 256;
          const captionCanvas = document.createElement('canvas');
          captionCanvas.width = canvasW;
          captionCanvas.height = canvasH;
          const ctx = captionCanvas.getContext('2d');

          const captionText = photoData.title;

          const renderCaptionCanvas = () => {
            ctx.clearRect(0, 0, canvasW, canvasH);
            ctx.fillStyle = '#f5f3ec';
            // Regular weight DM Serif Display (~18-20px on desktop viewports, scaling responsively for mobile)
            ctx.font = "400 120px 'DM Serif Display', 'Bodoni Moda', Georgia, serif";
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(captionText, 0, canvasH / 2);
          };

          renderCaptionCanvas();

          const captionTexture = new THREE.CanvasTexture(captionCanvas);
          captionTexture.anisotropy = maxAniso;
          captionTexture.minFilter = THREE.LinearFilter;
          captionTexture.magFilter = THREE.LinearFilter;
          captionTexture.generateMipmaps = false;

          // Ensure DM Serif Display is loaded before updating texture
          if (typeof document !== 'undefined' && document.fonts) {
            if (document.fonts.load) {
              document.fonts.load("400 120px 'DM Serif Display'").then(() => {
                renderCaptionCanvas();
                captionTexture.needsUpdate = true;
              }).catch(() => {});
            }
            if (document.fonts.ready) {
              document.fonts.ready.then(() => {
                renderCaptionCanvas();
                captionTexture.needsUpdate = true;
              }).catch(() => {});
            }
          }

          const captionMeshW = 3.04;
          const captionMeshH = 0.38;
          const captionGeo = new THREE.PlaneGeometry(captionMeshW, captionMeshH);
          const captionMat = new THREE.MeshBasicMaterial({
            map: captionTexture,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
          });

          const captionMesh = new THREE.Mesh(captionGeo, captionMat);
          // Left-align with photo's left edge (-pWidth / 2)
          captionMesh.position.x = -pWidth / 2 + captionMeshW / 2;
          // Position directly beneath photo with consistent spacing
          const captionGap = 0.12;
          captionMesh.position.y = -pHeight / 2 - captionGap - captionMeshH / 2;
          captionMesh.position.z = 0.002;
          captionMesh.userData = { photoData, wallIdx, pIdx };

          photoGroup.add(captionMesh);
          clickablePhotos.push(captionMesh);
        }

        // Right Wall: Add elegant serif captions for Poetry & Anthologies left-aligned with image left edge
        if (isRightWall && !photoData.hideWallCaption) {
          const isSingleLineCoAuthor = pIdx === 0;
          const canvasW = isSingleLineCoAuthor ? 3072 : 2048;
          const canvasH = 256;
          const captionCanvas = document.createElement('canvas');
          captionCanvas.width = canvasW;
          captionCanvas.height = canvasH;
          const ctx = captionCanvas.getContext('2d');

          const prefix = photoData.prefix || '';
          const text = photoData.text || photoData.caption;

          const renderRightCaptionCanvas = () => {
            ctx.clearRect(0, 0, canvasW, canvasH);
            ctx.fillStyle = '#ffffff';

            const fontSize = 76;
            const startX = 0;
            const startY = canvasH / 2;

            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            // Prefix in bold serif
            ctx.font = `bold ${fontSize}px 'DM Serif Display', 'Bodoni Moda', Georgia, serif`;
            ctx.fillText(prefix, startX, startY);
            const prefixW = ctx.measureText(prefix + ' ').width;

            // Rest of text in regular serif on the exact same line
            ctx.font = `400 ${fontSize}px 'DM Serif Display', 'Bodoni Moda', Georgia, serif`;
            ctx.fillText(text, startX + prefixW, startY);
          };

          renderRightCaptionCanvas();

          const captionTexture = new THREE.CanvasTexture(captionCanvas);
          captionTexture.anisotropy = maxAniso;
          captionTexture.minFilter = THREE.LinearFilter;
          captionTexture.magFilter = THREE.LinearFilter;
          captionTexture.generateMipmaps = false;

          // Ensure DM Serif Display is loaded before updating texture
          if (typeof document !== 'undefined' && document.fonts) {
            if (document.fonts.load) {
              document.fonts.load("400 76px 'DM Serif Display'").then(() => {
                renderRightCaptionCanvas();
                captionTexture.needsUpdate = true;
              }).catch(() => {});
              document.fonts.load("700 76px 'DM Serif Display'").then(() => {
                renderRightCaptionCanvas();
                captionTexture.needsUpdate = true;
              }).catch(() => {});
            }
            if (document.fonts.ready) {
              document.fonts.ready.then(() => {
                renderRightCaptionCanvas();
                captionTexture.needsUpdate = true;
              }).catch(() => {});
            }
          }

          const captionMeshW = isSingleLineCoAuthor ? 3.60 : 2.40;
          const captionMeshH = 0.30;
          const captionGeo = new THREE.PlaneGeometry(captionMeshW, captionMeshH);
          const captionMat = new THREE.MeshBasicMaterial({
            map: captionTexture,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
          });

          const captionMesh = new THREE.Mesh(captionGeo, captionMat);
          // Left-align with photo's left edge (-pWidth / 2)
          captionMesh.position.x = -pWidth / 2 + captionMeshW / 2;
          const captionGap = 0.12;
          captionMesh.position.y = -pHeight / 2 - captionGap - captionMeshH / 2;
          captionMesh.position.z = 0.002;
          captionMesh.userData = { photoData, wallIdx, pIdx };

          photoGroup.add(captionMesh);
          clickablePhotos.push(captionMesh);
        }

        // Left Wall: Add elegant serif captions for Volunteering & Community left-aligned with image left edge
        if (isLeftWall) {
          const canvasW = 3072;
          const canvasH = 256;
          const captionCanvas = document.createElement('canvas');
          captionCanvas.width = canvasW;
          captionCanvas.height = canvasH;
          const ctx = captionCanvas.getContext('2d');

          const prefix = photoData.prefix || '';
          const text = photoData.text || photoData.caption;

          const renderLeftCaptionCanvas = () => {
            ctx.clearRect(0, 0, canvasW, canvasH);
            ctx.fillStyle = '#ffffff';

            const fontSize = 76;
            const startX = 0;
            const startY = canvasH / 2;

            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            // Activity title in bold serif
            ctx.font = `bold ${fontSize}px 'DM Serif Display', 'Bodoni Moda', Georgia, serif`;
            ctx.fillText(prefix, startX, startY);
            const prefixW = ctx.measureText(prefix + ' ').width;

            // Remaining detail text in regular serif
            ctx.font = `400 ${fontSize}px 'DM Serif Display', 'Bodoni Moda', Georgia, serif`;
            ctx.fillText(text, startX + prefixW, startY);
          };

          renderLeftCaptionCanvas();

          const captionTexture = new THREE.CanvasTexture(captionCanvas);
          captionTexture.anisotropy = maxAniso;
          captionTexture.minFilter = THREE.LinearFilter;
          captionTexture.magFilter = THREE.LinearFilter;
          captionTexture.generateMipmaps = false;

          // Ensure DM Serif Display is loaded before updating texture
          if (typeof document !== 'undefined' && document.fonts) {
            if (document.fonts.load) {
              document.fonts.load("400 76px 'DM Serif Display'").then(() => {
                renderLeftCaptionCanvas();
                captionTexture.needsUpdate = true;
              }).catch(() => {});
              document.fonts.load("700 76px 'DM Serif Display'").then(() => {
                renderLeftCaptionCanvas();
                captionTexture.needsUpdate = true;
              }).catch(() => {});
            }
            if (document.fonts.ready) {
              document.fonts.ready.then(() => {
                renderLeftCaptionCanvas();
                captionTexture.needsUpdate = true;
              }).catch(() => {});
            }
          }

          const captionMeshW = 3.60;
          const captionMeshH = 0.30;
          const captionGeo = new THREE.PlaneGeometry(captionMeshW, captionMeshH);
          const captionMat = new THREE.MeshBasicMaterial({
            map: captionTexture,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
          });

          const captionMesh = new THREE.Mesh(captionGeo, captionMat);
          // Left-align with photo's left edge (-pWidth / 2)
          captionMesh.position.x = -pWidth / 2 + captionMeshW / 2;
          const captionGap = 0.12;
          captionMesh.position.y = -pHeight / 2 - captionGap - captionMeshH / 2;
          captionMesh.position.z = 0.002;
          captionMesh.userData = { photoData, wallIdx, pIdx };

          photoGroup.add(captionMesh);
          clickablePhotos.push(captionMesh);
        }

        wallGroup.add(photoGroup);
      });

      scene.add(wallGroup);
    });

    // 5. Drag & Touch Pointer Interaction
    const controls = controlsRef.current;
    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
    let hasMoved = false;

    const onPointerDown = (e) => {
      isPointerDown = true;
      startX = e.clientX;
      startY = e.clientY;
      controls.lastX = e.clientX;
      controls.lastY = e.clientY;
      hasMoved = false;
      if (container) container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (!isPointerDown) {
        if (container) {
          const rect = container.getBoundingClientRect();
          const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          const hoverRaycaster = new THREE.Raycaster();
          hoverRaycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
          const intersects = hoverRaycaster.intersectObjects(clickablePhotos);
          if (intersects.length > 0) {
            container.style.cursor = 'pointer';
          } else {
            container.style.cursor = 'grab';
          }
        }
        return;
      }

      const dx = e.clientX - controls.lastX;
      const dy = e.clientY - controls.lastY;

      if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5) {
        hasMoved = true;
        setHasInteracted(true);
      }

      // Drag sensitivity: direct manipulation (dragging left rotates camera right, sliding wall left)
      const sensitivity = 0.0038;
      controls.targetYaw -= dx * sensitivity;
      // Vertical pitch clamped safely between -22deg (-0.38 rad) and +22deg (+0.38 rad)
      controls.targetPitch = Math.max(
        -0.38,
        Math.min(0.38, controls.targetPitch + dy * sensitivity)
      );

      controls.lastX = e.clientX;
      controls.lastY = e.clientY;
    };

    const onPointerCancel = () => {
      isPointerDown = false;
      if (container) container.style.cursor = 'grab';
    };

    const onPointerUp = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      if (container) container.style.cursor = 'grab';

      // If clicked without dragging, check for photo inspection or vinyl record toggle
      if (!hasMoved) {
        const rect = container.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
        const intersects = raycaster.intersectObjects(clickablePhotos);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData && hit.userData.isVinyl) {
            togglePlayVinyl(hit.userData.vinylId);
            setHasInteracted(true);
            return;
          }
          if (hit.userData && hit.userData.photoData) {
            setSelectedPhoto(hit.userData.photoData);
            setHasInteracted(true);
          }
        }
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);

    // Keyboard Arrow navigation (Left / Right to rotate)
    const onKeyDown = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowLeft') {
        controls.targetYaw -= 0.15;
        setHasInteracted(true);
      } else if (e.key === 'ArrowRight') {
        controls.targetYaw += 0.15;
        setHasInteracted(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    // 6. Responsive Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. Render Animation Loop with Inertial Damping
    let animationFrameId;
    let lastWallUpdate = 0;

    const animate = (time) => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth lerp damping for camera rotation
      const damp = 0.12;
      controls.currentYaw += (controls.targetYaw - controls.currentYaw) * damp;
      controls.currentPitch += (controls.targetPitch - controls.currentPitch) * damp;
      if (Math.abs(controls.targetYaw - controls.currentYaw) < 0.001) {
        controls.currentYaw = controls.targetYaw;
      }
      if (Math.abs(controls.targetPitch - controls.currentPitch) < 0.001) {
        controls.currentPitch = controls.targetPitch;
      }

      // Calculate camera look-at direction vector
      const cosPitch = Math.cos(controls.currentPitch);
      const lookX = Math.sin(controls.currentYaw) * cosPitch;
      const lookY = Math.sin(controls.currentPitch);
      const lookZ = -Math.cos(controls.currentYaw) * cosPitch;

      camera.lookAt(lookX, lookY, lookZ);

      // Continuous vinyl spinning & synchronized visual feedback
      const activePlayingId = audioManagerRef.current.playingId;
      vinylRecords.forEach((record) => {
        const isPlaying = activePlayingId === record.id;
        const targetSpeed = isPlaying ? 2.4 : 0.0;
        record.currentSpeed += (targetSpeed - record.currentSpeed) * 0.08;

        if (record.currentSpeed > 0.001) {
          // Clockwise spin like a turntable
          record.spinMesh.rotation.z -= record.currentSpeed * 0.016;
        }

        if (record.glowMesh) {
          if (isPlaying) {
            record.glowMesh.visible = true;
            const pulse = 0.55 + 0.25 * Math.sin(time * 0.005);
            record.glowMesh.material.opacity = pulse;
          } else {
            record.glowMesh.visible = false;
          }
        }

        if (record.wasPlaying !== isPlaying) {
          record.wasPlaying = isPlaying;
          record.updateCaption(isPlaying);
        }
      });

      // Periodically update active wall index for HUD
      if (time - lastWallUpdate > 100) {
        lastWallUpdate = time;
        updateWallFromYaw(controls.currentYaw);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 8. Cleanup on Component Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', handleResize);

      // Stop all vinyl audio on unmount
      const mgr = audioManagerRef.current;
      if (mgr && mgr.audios) {
        Object.values(mgr.audios).forEach((a) => {
          a.pause();
          a.currentTime = 0;
        });
      }

      // Traverse scene to cleanly dispose all geometries, materials, and textures
      scene.traverse((obj) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => {
              if (m.map) m.map.dispose();
              m.dispose();
            });
          } else {
            if (obj.material.map) obj.material.map.dispose();
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [updateWallFromYaw]);

  const currentWall = PHOTO_ROOM_WALLS[activeWallIndex] || PHOTO_ROOM_WALLS[0];

  return (
    <section
      id="photo-room"
      aria-label="3D Virtual Photo Room Exhibition"
      className="relative w-full bg-[#131417] text-white overflow-hidden select-none scroll-mt-[64px] sm:scroll-mt-[72px] md:scroll-mt-[78px] lg:scroll-mt-[84px] xl:scroll-mt-[90px]"
      style={{
        height: 'calc(100dvh - 64px)',
        minHeight: '580px',
        maxHeight: '980px',
      }}
    >
      {/* 3D WebGL Canvas Viewport */}
      {webGLSupported ? (
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
        />
      ) : (
        /* Accessible Fallback when WebGL is unavailable */
        <div className="absolute inset-0 w-full h-full overflow-y-auto p-6 flex flex-col items-center justify-center bg-[#131417]">
          <h3 className="font-['Literata'] text-2xl text-white mb-4">
            {currentWall.name} — {currentWall.subheading}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl">
            {currentWall.photos.map((p) => (
              <div 
                key={p.id} 
                onClick={() => {
                  if (activeWallIndex === 2) {
                    togglePlayVinyl(p.id);
                  }
                }}
                className={`bg-[#1f2025] p-3 rounded-lg border transition-all ${
                  activeWallIndex === 2 ? 'cursor-pointer hover:border-amber-400' : 'border-white/10'
                } ${playingCdId === p.id ? 'ring-2 ring-emerald-400' : ''}`}
              >
                <img src={p.src} alt={p.title} className="w-full aspect-square object-contain rounded mb-2" />
                <h4 className="font-semibold text-sm">{p.title}</h4>
                <p className="text-xs text-white/60">{p.caption}</p>
                {activeWallIndex === 2 && (
                  <p className="text-xs mt-1 text-emerald-400 font-medium">
                    {playingCdId === p.id ? '● Playing · Click to pause' : '▶ Click to play'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Minimal Unboxed Navigation Arrows at Left and Right Edges of Room */}
      <button
        type="button"
        onClick={handlePrevWall}
        className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/75 hover:text-white hover:scale-110 active:scale-90 text-[38px] sm:text-[48px] md:text-[54px] font-extralight leading-none transition-all p-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] cursor-pointer select-none pointer-events-auto"
        title="Turn left to previous wall"
        aria-label="Previous Wall"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={handleNextWall}
        className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/75 hover:text-white hover:scale-110 active:scale-90 text-[38px] sm:text-[48px] md:text-[54px] font-extralight leading-none transition-all p-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] cursor-pointer select-none pointer-events-auto"
        title="Turn right to next wall"
        aria-label="Next Wall"
      >
        ›
      </button>

      {/* Selected Photo Modal for Intimate Inspection */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative bg-[#1e2026] border border-white/20 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Close photo inspection"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Unframed Image Preview */}
            <div className="p-2 sm:p-3 bg-[#131417] rounded-xl shadow-inner max-w-lg w-full mb-4 flex items-center justify-center">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-h-[55vh] w-auto max-w-full object-contain rounded shadow"
              />
            </div>

            {/* Photo Details */}
            <h3 className="font-['DM_Serif_Display',serif] text-xl sm:text-2xl text-white font-normal mb-1 text-center">
              {selectedPhoto.title}
            </h3>
            {selectedPhoto.caption && selectedPhoto.caption !== selectedPhoto.title && (
              <p className="text-sm sm:text-base text-white/80 text-center max-w-md font-['Afacad_Flux'] mb-4">
                {selectedPhoto.prefix ? (
                  <>
                    <strong className="font-bold text-white">{selectedPhoto.prefix}</strong>{' '}
                    <span>{selectedPhoto.text}</span>
                  </>
                ) : (
                  selectedPhoto.caption
                )}
              </p>
            )}

            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs sm:text-sm rounded-lg transition-all"
            >
              Return to 3D Room
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
