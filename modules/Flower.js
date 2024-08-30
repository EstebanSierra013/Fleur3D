import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

class CustomSinCurve extends THREE.Curve {

	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {
		const ty = t * 3 - 1.5;
		const tx = 0.1* Math.sin( 2 * Math.PI * t );
		const tz = 0;
		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}


class Flower {
  constructor(){
    this.canvas = document.querySelector(".js-canvas")
    this.canvasWidth = window.innerWidth
    this.canvasHeight = window.innerHeight
    this.flowerSize = 10
    this.init()
  }

  init(){
    this.createScene()
    this.createCamera()     
    this.createRender()   

    this.createGroupofObjects()    
    this.createStem()
    this.createPistil()
    this.createPetals()
    
    this.createOrbitControls()

    this.addGroupToScene() 

    this.animate()
  }

  createScene(){
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#fcfbf2')
  }

  createCamera(){
    const aspectRatio = this.canvasWidth / this.canvasHeight
    this.camera = new THREE.PerspectiveCamera( 45, aspectRatio, 0.1, 1000 )
    this.camera.position.z = 50
    this.camera.position.y = 100
    this.camera.position.x = 0
  } 

  createRender(){
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( this.canvasWidth, this.canvasHeight )
    this.canvas.appendChild( this.renderer.domElement )
  }

  createGroupofObjects(){
    this.flowerGroup = new THREE.Group()
  }

  createStem(){
    const path = new CustomSinCurve( this.flowerSize );
    const geometry = new THREE.TubeGeometry( path, 20, 1, 8, false );
    const material = new THREE.MeshMatcapMaterial( { color: "#6D8B0D" } );
    const stem = new THREE.Mesh( geometry, material );
    stem.position.y = this.flowerSize / 2  
    this.flowerGroup.add( stem )    
  }

  createPistil(){
    const geometry = new THREE.SphereGeometry( 2, 32, 16 )
    const material = new THREE.MeshMatcapMaterial( { color: "#C89C35" } );
    const sphere = new THREE.Mesh( geometry, material )
    sphere.position.y = this.flowerSize * 2
    this.flowerGroup.add( sphere )
  }

  createPetals(){

    const petalShape = new THREE.Shape()
    petalShape.moveTo(0, 5)
    petalShape.bezierCurveTo(0, 5, 4, -2, 0.5, -5)
    petalShape.bezierCurveTo(0.5, -5, 0, -6, -0.5, -5)
    petalShape.bezierCurveTo(-0.5, -5, -4, -2, 0, 5)
    
    const extrudeSettings = {
      curveSegments: 50,
      steps: 0,
      depth: 0,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.5,
      bevelOffset: 0,
      bevelSegments: 10
    }

    const geometry = new THREE.ExtrudeGeometry( petalShape, extrudeSettings)

    var material = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: new THREE.Color("#E2A2B6")
        },
        color2: {
          value: new THREE.Color("#E7A4B9")
        }
      },
      vertexShader: `
        varying vec2 vUv;
    
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
      
        varying vec2 vUv;
        
        void main() {
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1);
        }
      `
    });
    
    const AxisY = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < 16; i++){
      for (let j = 0; j < 2; j++){
        const petal = new THREE.Mesh( geometry, material )
        petal.position.y = this.flowerSize * 2.02 - ( 1 * j)
        petal.position.x = 0
        petal.position.z = 5
        petal.rotation.x = THREE.MathUtils.degToRad(60)
        petal.rotation.z = THREE.MathUtils.degToRad(0)
        var pivot = new THREE.Group();        
        pivot.rotation.y = THREE.MathUtils.degToRad((22 * j) + (45 * i))
        pivot.add( petal )
        this.flowerGroup.add( pivot )
      }        
    }      
  }

  addGroupToScene() {
    this.scene.add(this.flowerGroup)
  }


  createOrbitControls(){
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
  }

  animate(){
    requestAnimationFrame( this.animate.bind(this) )
    this.controls.update()  
    this.renderer.render(this.scene, this.camera)
  }
}

export { Flower }