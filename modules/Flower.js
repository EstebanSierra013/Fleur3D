import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

class CustomSinCurve extends THREE.Curve {

	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {
		const ty = t * 3;
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
    this.animation = {
      rotationY: 0,
      rotationX: 0
    }
    this.offsetAxisY = 180
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
    this.createNumbers()
    this.createPot()
    
    this.createOrbitControls()
    this.createHelper()

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
    this.camera.position.set(0,50,100)
    this.flowerGroup = new THREE.Group()
    var cameraPivot = new THREE.Group();     
    cameraPivot .rotation.y = THREE.MathUtils.degToRad(45)
    cameraPivot .add( this.camera )
    this.camera.rotateOnWorldAxis(new THREE.Vector3(0.5,-0.7,1), Math.PI)
    this.scene.add( cameraPivot )
  } 

  createRender(){
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( this.canvasWidth, this.canvasHeight )
    this.canvas.appendChild( this.renderer.domElement )
  }

  createGroupofObjects(){
    this.flowerGroup = new THREE.Group()
  }

  createHelper() {
    const axesHelper = new THREE.AxesHelper( 50 ) 
    axesHelper.rotation.y = THREE.MathUtils.degToRad(180)  
    this.scene.add( axesHelper )
  }

  createStem(){
    const path = new CustomSinCurve( this.flowerSize );
    const geometry = new THREE.TubeGeometry( path, 20, 1, 8, false );
    const material = new THREE.MeshMatcapMaterial( { color: "#6D8B0D" } );
    const stem = new THREE.Mesh( geometry, material );
    this.flowerGroup.add( stem )    
  }

  createPistil(){
    const geometry = new THREE.SphereGeometry( 2, 32, 16 )
    const material = new THREE.MeshMatcapMaterial( { color: "#C89C35" } );
    const sphere = new THREE.Mesh( geometry, material )
    sphere.position.y = this.flowerSize * 3
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

    for (let i = 0; i < 16; i++){
      for (let j = 0; j < 2; j++){
        const petal = new THREE.Mesh( geometry, material )
        petal.position.y = this.flowerSize * 3.1 - ( 1 * j)
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

  loadFont(url) {
    return new Promise((resolve, reject) => {
      const loader = new FontLoader();
      loader.load(url, resolve, undefined, reject)
    })
  }

  async createNumbers() {    
    const font = await this.loadFont('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json')
    let numbers = ['0','90','180','270']
    let positionx = [0, this.flowerSize * 4, 0, -this.flowerSize * 4]
    let positionz = [-this.flowerSize * 4, 0, this.flowerSize * 4, 0]
    for(let i = 0; i < numbers.length; i++){
      const geometry = new TextGeometry(numbers[i], {
        font: font,
        size: 3,
        depth: 1,
        curveSegments: 12,
        bevelEnabled: false
      })
      const material = new THREE.MeshMatcapMaterial( { color: "#C89C35" } );
      const mesh = new THREE.Mesh(geometry, material)
      geometry.computeBoundingBox()
      geometry.computeVertexNormals()
      geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1)
      mesh.position.y = 0.5
      mesh.rotation.x = - Math.PI / 2 
      mesh.position.x = -geometry.boundingBox.max.x / 2 + positionx[i]
      mesh.position.z = positionz[i]
      this.scene.add( mesh )
    }
    
  }

  createPot(){
    
    const geometry = new THREE.CylinderGeometry(this.flowerSize * 3, this.flowerSize * 2, 20, 64); 
    const material = new THREE.MeshMatcapMaterial( { color: "#A43B21" } );    
    const cylinder = new THREE.Mesh( geometry, material );   
    cylinder.position.y = -this.flowerSize
    this.scene.add(cylinder)

    const texture = new THREE.TextureLoader().load("./assets/texture-ground.jpeg");
    const geometry2 = new THREE.CircleGeometry( this.flowerSize * 2.8, 64 ); 
    const material2 = new THREE.MeshBasicMaterial({
      map: texture ,
      color: "#77572d"
    });
    const circle = new THREE.Mesh( geometry2, material2 );
    circle.rotation.x = - Math.PI / 2 
    circle.position.y = 0.5
    this.scene.add(circle)
    
  }

  addGroupToScene() {
    this.flowerGroup.rotation.order = "YZX"
    this.scene.add(this.flowerGroup)
  }


  createOrbitControls(){
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
  }

  animate(){
    requestAnimationFrame( this.animate.bind(this) )
    this.controls.update()  

    if(window.app.city === ""){
      this.flowerGroup.rotation.y += 0.01
    }else{
      if (window.app.resetAnimation) {
        this.animation.rotationY = 0
        this.animation.rotationX = 0
        document.querySelector(".js-data-direction").innerHTML = ""
        document.querySelector(".js-data-speed").innerHTML = ""
        window.app.resetAnimation = false
      } else {    
        const speedY = 0.1 * window.app.windSpeed     
        const speedX = 0.03 * window.app.windSpeed      
        if (this.animation.rotationX <= 45){            
          this.animation.rotationX += speedX
        }
        if(window.app.windDirection >= 0 ){
          if (this.animation.rotationY <= window.app.windDirection) {                              
            this.animation.rotationY += speedY
          }
        } else {
          if (this.animation.rotationY >= window.app.windDirection) {               
            this.animation.rotationY -= speedY           
          }
        }                     
      }      
      this.flowerGroup.rotation.x = THREE.MathUtils.degToRad(this.animation.rotationX)
      this.flowerGroup.rotation.y = THREE.MathUtils.degToRad(this.offsetAxisY - this.animation.rotationY)     
    }
    this.renderer.render(this.scene, this.camera)
  }
}

export { Flower }