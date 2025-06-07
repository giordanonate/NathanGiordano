'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'

export default function EarthCanvas() {
  const mountRef = useRef(null)
  const spinVelocity = useRef(0)
  const lastTouchX = useRef(null)
  const spin = useRef(0)
  const cloudSpin = useRef(0)
  const lightTarget = useRef(new THREE.Vector3(0, 0, 5))
  const rendererRef = useRef(null)

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
    rendererRef.current = renderer

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(
      new BokehPass(scene, camera, {
        focus: 2.6,
        aperture: 0.025,
        maxblur: 0.01,
        width: mount.clientWidth,
        height: mount.clientHeight
      })
    )

    const spotLight = new THREE.SpotLight(0xffddaa, 60, 0, Math.PI / 1, 0.1)
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
      emissiveIntensity: .7,
      shininess: 5,
      specular: new THREE.Color(0xffffff)
    })
    const earth = new THREE.Mesh(new THREE.SphereGeometry(0.44, 64, 64), earthMaterial)
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
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(0.444, 64, 64), cloudMaterial)
    scene.add(clouds)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const updateLightFromXY = (x, y) => {
      const radius = 5
      lightTarget.current.set(radius * x, radius * y, 5)
    }

    const handleMouseMove = (event) => {
      const rect = mount.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      updateLightFromXY(x, y)

      mouse.x = x
      mouse.y = y
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(earth)
      mount.style.cursor = intersects.length > 0 ? 'pointer' : 'default'
    }

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return
      const touch = e.touches[0]
      const rect = mount.getBoundingClientRect()
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1
      updateLightFromXY(x, y)

      if (lastTouchX.current !== null) {
        const dx = touch.clientX - lastTouchX.current
        spinVelocity.current = dx * 0.005
      }
      lastTouchX.current = touch.clientX
    }

    const handleTouchEnd = () => {
      lastTouchX.current = null
    }

    const handleClick = (event) => {
      const rect = mount.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
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
      const baseSpin = 0.001
      spinVelocity.current *= 0.95
      spin.current += spinVelocity.current + baseSpin
      cloudSpin.current += (spinVelocity.current + baseSpin) * 1.3

      earth.rotation.y = spin.current
      clouds.rotation.y = cloudSpin.current

      spotLight.position.lerp(lightTarget.current, 0.05)

      composer.render()
      requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('resize', handleResize)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('click', handleClick)
      if (renderer && mount.contains(renderer.domElement)) {
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
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  )
}
