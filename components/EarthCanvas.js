'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'

export default function EarthCanvas() {
  const mountRef = useRef(null)
  const isHoveringRef = useRef(false)
  const spinMultiplier = useRef(1)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#ffffff')

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mount.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(
      new BokehPass(scene, camera, {
        focus: 2.7,
        aperture: 0.025,
        maxblur: 0.01,
        width: mount.clientWidth,
        height: mount.clientHeight
      })
    )

    const spotLight = new THREE.SpotLight(0xffddaa, 50, 0, Math.PI / 1, 0.1)
    spotLight.position.set(0, 0, 50)
    spotLight.target.position.set(0, 0, 0)
    scene.add(spotLight)
    scene.add(spotLight.target)

    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    const loader = new THREE.TextureLoader()
    const colorMap = loader.load('/earthmap1k.jpg')
    const specMap = loader.load('/earthspec1k.jpg')
    const emissiveMap = loader.load('/earthlights1k.jpg')
    const cloudMap = loader.load('/earthcloudmap.jpg')
    const alphaMap = loader.load('/earthcloudmaptrans.jpg')

    const textures = [colorMap, specMap, emissiveMap, cloudMap, alphaMap]

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: colorMap,
      specularMap: specMap,
      emissiveMap: emissiveMap,
      emissive: new THREE.Color(0xffcc88),
      emissiveIntensity: 1,
      shininess: 5,
      specular: new THREE.Color(0xffffff)
    })
    const earth = new THREE.Mesh(new THREE.SphereGeometry(0.3, 64, 64), earthMaterial)
    scene.add(earth)

    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudMap,
      alphaMap: alphaMap,
      transparent: true,
      depthWrite: false,
      opacity: 1.0,
      side: THREE.DoubleSide,
      emissiveMap: cloudMap,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.3
    })
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(0.305, 64, 64), cloudMaterial)
    scene.add(clouds)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const targetLightPos = new THREE.Vector3(0, 0, 5)

    const updateLightFromPointer = (x, y) => {
      const radius = 5
      targetLightPos.set(radius * x, radius * y, 5)
    }

    const handleMouseMove = (event) => {
      const rect = mount.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      updateLightFromPointer(x, y)

      mouse.set(x, y)
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(earth)

      if (intersects.length > 0 && !isHoveringRef.current) {
        mount.style.cursor = 'pointer'
        isHoveringRef.current = true
      } else if (intersects.length === 0 && isHoveringRef.current) {
        mount.style.cursor = 'default'
        isHoveringRef.current = false
      }
    }

    const handleTouchMove = (event) => {
      if (!event.touches.length) return
      const touch = event.touches[0]
      const rect = mount.getBoundingClientRect()
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1
      updateLightFromPointer(x, y)
    }

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(earth)
      if (intersects.length > 0) {
        window.dispatchEvent(new CustomEvent('earth-click'))
      }
    }

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      composer.setSize(mount.clientWidth, mount.clientHeight)
    }

    const animate = () => {
      const target = isHoveringRef.current ? 1.5 : 1
      spinMultiplier.current = THREE.MathUtils.lerp(spinMultiplier.current, target, 0.05)

      earth.rotation.y += 0.002 * spinMultiplier.current
      clouds.rotation.y += 0.003 * spinMultiplier.current

      spotLight.position.lerp(targetLightPos, 0.05)
      composer.render()
      requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('resize', handleResize)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('click', handleClick)
      if (renderer?.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      textures.forEach(t => t.dispose?.())
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }}
    />
  )
}
