
import * as THREE from 'three';
import css from './css/style.css';
import vertex from './shaders/vertex.js';
import fragment from './shaders/fragment.js';
import tShader from './shaders/triangleShader.js';
import shoe from './images/shoe.jpeg';
import shoe2 from './images/shoe2.jpeg';

export default class Main
{
  constructor()
  {
    this.scene = new THREE.Scene();

    this.mouse = new THREE.Vector2(0, 0);
    this.vel = new THREE.Vector2(0, 0);

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    this.light = new THREE.PointLight(0x888888, 1, 100);
    this.scene.add(this.light);

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );

    this.time = new THREE.Clock();
    this.count = -1.0;
    this.t = 0;

    this.mouseDown = false;

    this.geometry = new THREE.PlaneGeometry(8, 8);

    this.triangleShape1 = new THREE.Shape()
    .moveTo(0, 0)
    .lineTo(0, 1)
    .lineTo(0.5, 0.5)

    this.triangleShape2 = new THREE.Shape()
    .moveTo(0, 0)
    .lineTo(0, 1)
    .lineTo(-0.5, 0.5);

    const extrudeSettings = { depth: 0.1, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 0.5, bevelThickness: .1 };

    this.extrudeTriangle1 = new THREE.ExtrudeGeometry(this.triangleShape1, extrudeSettings);
    this.extrudeTriangle2 = new THREE.ExtrudeGeometry(this.triangleShape2, extrudeSettings);    

    //this.triangleMaterial = new THREE.MeshPhongMaterial({ color: 0xffaa11, side: THREE.DoubleSide });
    this.triangleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 }
      },

      vertexShader: vertex.vert,
      fragmentShader: tShader.triangleShader,
     });    
    
    this.material = new THREE.ShaderMaterial( { 
      uniforms: {
        time: { value: 0.0 },
        spin: { value: 0.0 },
        mouse: { value: this.mouse },
        mainTex: { value: null },
        tex: { value: new THREE.TextureLoader().load(shoe) },
        tex2: { value: new THREE.TextureLoader().load(shoe2) }
      },

      vertexShader: vertex.vert,
      fragmentShader: fragment.frag
     } );

    this.mainMesh = new THREE.Mesh( this.geometry, this.material );
    this.triangleMesh1 = new THREE.Mesh( this.extrudeTriangle1, this.triangleMaterial );    
    this.triangleMesh2 = new THREE.Mesh( this.extrudeTriangle2, this.triangleMaterial );        

    this.triangleMesh1.name = 'triangleMesh1';
    this.triangleMesh2.name = 'triangleMesh2';    

    this.triangleMesh1.position.x = 0.9;
    this.triangleMesh2.position.x = -0.9;    

    this.triangleMesh1.position.y = 0.9;
    this.triangleMesh2.position.y = 0.9;    

    this.light.position.set(this.triangleMesh1.position.x, this.triangleMesh1.position.y, this.triangleMesh1.position.z + 1.5);

    this.triangleMesh1.scale.set( 0.5, 0.5, 0.5 )
    this.triangleMesh2.scale.set( 0.5, 0.5, 0.5 )    

    this.scene.add( this.mainMesh );
    this.scene.add( this.triangleMesh1, this.triangleMesh2 );

    document.addEventListener('mousedown', () => {
      //this.mouseDown = true;

      this.intersects = this.raycaster.intersectObjects([this.scene.children[2], this.scene.children[3]]);      

      for(let i = 0; i < this.intersects.length; i++){

        if(this.intersects.length){
          this.count = 0;          
        }
      }

    });

    document.addEventListener('mouseup', () => {
      //this.mouseDown = false;
    });

    document.addEventListener('mousemove', (e) => {
      if(this.mouseDown){
        this.mouse.x = e.pageX / window.innerWidth - 0.5;
        this.mouse.y = -e.pageY / window.innerHeight + 0.5;
      }

      this.onPointMove(e)
    })

    this.innerRaduis

    this.camera.position.z = 3;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.intersects = this.raycaster.intersectObjects([this.scene.children[2], this.scene.children[3]]);      

    this.triangleMesh1.position.z = 1.0;
    this.triangleMesh2.position.z = 1.0;    

    this.animate = this.animate.bind(this);

    this.animate();
  }

  springEffect(){
    const k = 0.1;
    const velDamp = 0.9;

    let screenCenter = new THREE.Vector2(0.0, 0.0);

    // distance from mouse position to center of the screen
    let dist = screenCenter.sub(this.mouse);

    // slowing down the spring speed with the k constant
    let offSet = dist.multiplyScalar(k);

    // adding the offset force to velocity
    this.vel.add(offSet);

    // multiply the velocity force by the dampening factor to eventually stop the spring bouncing
    this.vel.multiplyScalar(velDamp);

    // add the updated velocity force to the mouse position to start spring effect
    this.mouse.add(this.vel);
  }

  onPointMove(e){
    this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1; 
  }

  easeFunction(count){
    // cubic function starts at 0 runs to 0.5 then back to 0, try to plug this into a math plotting library to see what the function does visually
     return (-2 * (count * count)) + (2 * count);      
  }

  animate(){
    requestAnimationFrame( this.animate );

    this.triangleMaterial.uniforms.time.value += this.time.getDelta();     

    this.raycaster.setFromCamera(this.pointer, this.camera);

    if(this.intersects.length > 0){
      if(this.intersects[0].object.name === 'triangleMesh1'){
        this.intersects[0].object.rotation.y = this.easeFunction(this.count);
      }
      else if(this.intersects[0].object.name === 'triangleMesh2'){
        this.intersects[0].object.rotation.y = -this.easeFunction(this.count);        
      }
    }

    let center = new THREE.Vector2(0.0, 0.0);

    let one = center.distanceToSquared(this.pointer) < 0.1;
    let two = center.distanceToSquared(this.pointer) < 0.7;

    if(one && two){
      this.mouseDown = true;
    }

    if(!one && !two){
      this.mouseDown = false;
    }

    console.log(one, two);

    if(this.count <= 1){
      this.count += 0.05;
    }

    if(!this.mouseDown){
      this.springEffect();
    }
  
    this.renderer.render( this.scene, this.camera );
  };

}

new Main();
