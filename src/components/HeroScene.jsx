import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { useReducedMotion } from "framer-motion";

const orange = 0xff702b;
const white = 0xffffff;

function HeroScene() {
  const mountRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    scene.add(new THREE.AmbientLight(white, 1.7));

    const keyLight = new THREE.DirectionalLight(white, 3.5);
    keyLight.position.set(-3, 4, 6);
    scene.add(keyLight);

    const orangeLight = new THREE.PointLight(orange, 12, 10);
    orangeLight.position.set(2.5, 1.2, 3);
    scene.add(orangeLight);

    const composition = new THREE.Group();
    const mark = new THREE.Group();
    const barHeights = [0.92, 1.48, 1.16, 0.22];
    const barPositions = [-0.9, -0.3, 0.3, 0.9];
    const markMaterial = new THREE.MeshStandardMaterial({
      color: orange,
      emissive: orange,
      emissiveIntensity: 0.13,
      metalness: 0.12,
      roughness: 0.34,
    });

    barHeights.forEach((height, index) => {
      const isBlock = index === 3;
      const geometry = new RoundedBoxGeometry(
        isBlock ? 0.22 : 0.3,
        height,
        0.24,
        5,
        isBlock ? 0.045 : 0.12
      );
      const bar = new THREE.Mesh(geometry, markMaterial);
      bar.position.set(barPositions[index], 0, 0);
      mark.add(bar);
    });
    composition.add(mark);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: white,
      transparent: true,
      opacity: 0.34,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.03, 0.009, 6, 160), ringMaterial);
    ring.rotation.set(0.78, 0.16, -0.23);
    composition.add(ring);

    const secondaryRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.72, 0.006, 6, 160),
      new THREE.MeshBasicMaterial({ color: white, transparent: true, opacity: 0.18 })
    );
    secondaryRing.rotation.set(-0.82, -0.24, 0.3);
    composition.add(secondaryRing);

    const moduleGeometry = new THREE.BoxGeometry(0.42, 0.42, 0.42);
    const moduleEdges = new THREE.EdgesGeometry(moduleGeometry);
    const moduleMaterial = new THREE.LineBasicMaterial({ color: white, transparent: true, opacity: 0.7 });
    const modules = [
      [-1.82, 0.94, 0.15],
      [1.78, 0.78, -0.12],
      [-1.62, -1.04, -0.12],
      [1.68, -1.12, 0.2],
    ];

    modules.forEach(([x, y, z], index) => {
      const module = new THREE.LineSegments(moduleEdges, moduleMaterial);
      module.position.set(x, y, z);
      module.rotation.set(index * 0.24, index * 0.35, index * -0.18);
      composition.add(module);
    });

    const fragments = new THREE.Group();
    const fragmentGeometry = new THREE.BoxGeometry(0.11, 0.11, 0.11);
    const fragmentMaterials = [
      new THREE.MeshBasicMaterial({ color: orange }),
      new THREE.MeshBasicMaterial({ color: white }),
    ];

    for (let index = 0; index < 18; index += 1) {
      const angle = (index / 18) * Math.PI * 2;
      const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterials[index % 4 === 0 ? 0 : 1]);
      fragment.position.set(Math.cos(angle) * 2.42, Math.sin(angle) * 1.88, (index % 3 - 1) * 0.16);
      fragment.scale.setScalar(index % 3 === 0 ? 1.25 : 0.72);
      fragments.add(fragment);
    }
    composition.add(fragments);
    scene.add(composition);

    let frameId = 0;
    let scrollProgress = 0;

    const onScroll = () => {
      const bounds = mount.getBoundingClientRect();
      const travel = window.innerHeight + bounds.height;
      scrollProgress = THREE.MathUtils.clamp((window.innerHeight - bounds.top) / travel, 0, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const resizeObserver = new ResizeObserver(() => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(mount);

    const startedAt = performance.now();
    const render = () => {
      const time = (performance.now() - startedAt) / 1000;
      composition.rotation.y = reduceMotion ? 0 : time * 0.08 + scrollProgress * 0.42;
      composition.scale.setScalar(reduceMotion ? 1 : 1 + scrollProgress * 0.08);
      mark.rotation.z = reduceMotion ? 0 : Math.sin(time * 0.45) * 0.035;
      ring.rotation.z = reduceMotion ? 0 : time * 0.07 + scrollProgress * 0.5;
      secondaryRing.rotation.x = reduceMotion ? -0.82 : -0.82 + Math.sin(time * 0.25 + scrollProgress) * 0.04;
      fragments.rotation.z = reduceMotion ? 0 : -time * 0.025 - scrollProgress * 0.22;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reduceMotion]);

  return <div ref={mountRef} className="hero-scene" role="img" aria-label="Animated three-dimensional HUMBYTES logo mark" />;
}

export default HeroScene;