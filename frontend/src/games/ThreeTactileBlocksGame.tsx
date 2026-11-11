import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, RotateCw, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { audio } from '../components/AudioService.ts';

interface ThreeTactileBlocksGameProps {
  onTap: () => void;
  onComplete: () => void;
}

export const ThreeTactileBlocksGame: React.FC<ThreeTactileBlocksGameProps> = ({
  onTap,
  onComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeShape, setActiveShape] = useState<'cube' | 'cylinder' | 'sphere'>('cube');
  const [interactionsCount, setInteractionsCount] = useState(0);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = 340;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfbf9);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = false; // lightweight for CPU rendering
    container.appendChild(renderer.domElement);

    // 2. Soft Ambient Lighting (Calming & Warm)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(4, 8, 5);
    scene.add(dirLight);

    // 3. Wooden Support Base / Mat
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.25, 24);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0xede4da });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.15;
    scene.add(baseMesh);

    // 4. Group for Tactile 3D Blocks
    const group = new THREE.Group();
    scene.add(group);
    meshGroupRef.current = group;

    // Helper to build friendly blocks
    const createBlocks = (shape: 'cube' | 'cylinder' | 'sphere') => {
      // Clear previous
      while (group.children.length > 0) {
        const obj = group.children[0];
        group.remove(obj);
      }

      const colors = [0xa8e6cf, 0xa0d2eb, 0xd1c4e9]; // mint, sky blue, lavender

      colors.forEach((col, idx) => {
        let geo: THREE.BufferGeometry;
        if (shape === 'cube') {
          geo = new THREE.BoxGeometry(1.0, 0.9, 1.0);
        } else if (shape === 'cylinder') {
          geo = new THREE.CylinderGeometry(0.55, 0.55, 0.9, 20);
        } else {
          geo = new THREE.SphereGeometry(0.55, 16, 16);
        }

        const mat = new THREE.MeshLambertMaterial({ color: col });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((idx - 1) * 1.35, 0.5 + idx * 0.1, 0);
        mesh.castShadow = false;
        group.add(mesh);
      });
    };

    createBlocks(activeShape);

    // 5. Drag to inspect rotation
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !meshGroupRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;

      meshGroupRef.current.rotation.y += deltaX * 0.01;
      meshGroupRef.current.rotation.x += deltaY * 0.01;

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 6. Gentle Render Loop (Software friendly)
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (meshGroupRef.current && !isDraggingRef.current) {
        meshGroupRef.current.rotation.y += 0.005; // very gentle, calming idle rotation
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, []);

  // Update shape when user clicks
  const handleChangeShape = (shape: 'cube' | 'cylinder' | 'sphere') => {
    onTap();
    audio.playSnap();
    setActiveShape(shape);
    setInteractionsCount((prev) => {
      const next = prev + 1;
      if (next >= 4) {
        audio.playSuccessArpeggio();
        onComplete();
      }
      return next;
    });

    if (meshGroupRef.current) {
      while (meshGroupRef.current.children.length > 0) {
        meshGroupRef.current.remove(meshGroupRef.current.children[0]);
      }
      const colors = [0xa8e6cf, 0xa0d2eb, 0xd1c4e9];
      colors.forEach((col, idx) => {
        let geo: THREE.BufferGeometry;
        if (shape === 'cube') {
          geo = new THREE.BoxGeometry(1.0, 0.9, 1.0);
        } else if (shape === 'cylinder') {
          geo = new THREE.CylinderGeometry(0.55, 0.55, 0.9, 20);
        } else {
          geo = new THREE.SphereGeometry(0.55, 16, 16);
        }

        const mat = new THREE.MeshLambertMaterial({ color: col });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((idx - 1) * 1.35, 0.5 + idx * 0.1, 0);
        meshGroupRef.current?.add(mesh);
      });
    }
  };

  const handleJiggle = () => {
    onTap();
    audio.playPop();
    if (meshGroupRef.current) {
      meshGroupRef.current.rotation.y += 0.4;
      meshGroupRef.current.rotation.x += 0.2;
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[520px] w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FCFBF9] rounded-3xl border border-[#EDE4DA] shadow-xs select-none">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#EDE4DA]">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#5E35B1] bg-[#EDE7F6] px-2.5 py-0.5 rounded-full inline-block mb-1">
            Espacialidade 3D • Three.js
          </span>
          <h2 className="text-xl font-bold text-[#1E293B]">
            Blocos Táteis Tridimensionais
          </h2>
        </div>

        <button
          onClick={handleJiggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F3EE] hover:bg-[#EDE4DA] text-xs font-bold text-[#1E293B] border border-[#EDE4DA] transition-all"
          title="Girar blocos no espaço"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#3E8EBF]" />
          <span>Girar Suave</span>
        </button>
      </div>

      {/* Guide text */}
      <div className="w-full text-center py-2 bg-[#F7F3EE]/80 rounded-2xl border border-[#EDE4DA] text-xs sm:text-sm font-semibold text-[#475569] my-2">
        Arraste com o mouse ou toque para rotacionar os blocos tridimensionais. Explore as formas!
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[320px] rounded-3xl overflow-hidden border-2 border-[#EDE4DA] shadow-inner bg-[#FCFBF9] cursor-grab active:cursor-grabbing flex items-center justify-center my-2"
        data-testid="threejs-canvas-stage"
      />

      {/* Shape Selector Controls */}
      <div className="w-full bg-[#F7F3EE] p-4 rounded-2xl border border-[#EDE4DA]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Escolher Formato Tridimensional
          </span>
          <span className="text-xs font-bold text-[#2D6A4F]">
            Interações: {interactionsCount}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'cube' as const, label: 'Cubos Táteis', desc: 'Faces planas e cantos suaves' },
            { id: 'cylinder' as const, label: 'Cilindros', desc: 'Bases redondas para empilhar' },
            { id: 'sphere' as const, label: 'Esferas', desc: 'Formas curvas e rolantes' },
          ].map((item) => {
            const isSelected = activeShape === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleChangeShape(item.id)}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#4FA88E] ring-2 ring-[#A8E6CF] shadow-xs'
                    : 'bg-[#FAF8F5] border-[#EDE4DA] hover:border-[#CBD5E1]'
                }`}
              >
                <Box className={`w-5 h-5 mb-1 ${isSelected ? 'text-[#4FA88E]' : 'text-[#64748B]'}`} />
                <span className="text-xs font-extrabold text-[#1E293B]">{item.label}</span>
                <span className="text-[10px] text-[#64748B] hidden sm:block text-center mt-0.5">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
