import * as THREE from 'https://cdn.skypack.dev/three'
import { RGBELoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js'
let camera, scene, renderer, controls;
let Next = false;
let Prev = false;
let x = 0;
let v1 = new THREE.Vector3(x, 1, 2.25);
init();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 2.25;
    camera.position.y = 1;

    scene = new THREE.Scene();

    /*geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshStandardMaterial();

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );*/

    new RGBELoader().setPath( 'img/' ).load( 'studio_small_08_1k.hdr', function ( texture ) {

        texture.mapping = THREE.EquirectangularReflectionMapping;

        //scene.background = texture;
        scene.environment = texture;

    } );
    for(var i = 0; i < 6; i++){
        LoadModels("Arcade" + i, i);
    }

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true} );
    renderer.setClearColor( 0x000000, 0 );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .25;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animation );
    document.getElementById("RenderContainer").appendChild( renderer.domElement );
    //controls = new OrbitControls( camera, renderer.domElement );
    window.addEventListener("resize", onWindowResize);

}

function animation( time ) {

    camera.position.lerp(v1, 0.05);
    renderer.render( scene, camera );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    animation();

}

function LoadModels(ModelName, XPosition){
    const loader = new GLTFLoader().setPath( 'Models/' );
    loader.load( ModelName + '.glb', function ( gltf ) {   
        /*gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                roughnessMipmapper.generateMipmaps( child.material );
            }
        } );*/
        console.log(gltf.scene);
        gltf.scene.position.x = XPosition * 5;
        scene.add( gltf.scene );
        console.log(scene);
    } );
}

document.getElementById('NextButton').addEventListener('click', function () {
    x+=5;
    if(x > (scene.children.length * 5) - 5){
        x = 0;
    }
    v1 = new THREE.Vector3(x, 1, 2.25);
});

document.getElementById('PrevButton').addEventListener('click', function () {
    x-=5;
    if(x < 0){
        x = (scene.children.length * 5) - 5;
    }
    v1 = new THREE.Vector3(x, 1, 2.25);
});