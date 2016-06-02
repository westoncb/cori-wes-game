class Game {
  constructor() {
    this.citySelector = new CitySelector();

    this.initThreeJS();
    this.initStateMachine();

    this.animate();
  }

  initThreeJS() {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var container = document.createElement( 'div' );
    container.id = 'threejs-container';
    document.body.appendChild( container );

    this.stats = new Stats();
    container.appendChild( this.stats.dom );

    this.scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera( 45, 800/600, 1, 2000 );
    camera.position.set( 0, 100, 100 );
    camera.lookAt(0, 0, 0);
    this.camera = camera;

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 800, 600 );
    renderer.setClearColor( 0x666666 );
    container.appendChild( renderer.domElement );
    this.renderer = renderer

    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    this.controls = controls;
  }

  initStateMachine() {
    var self = this;
    var stateMachine = new StateMachine();
    this.stateMachine = stateMachine;

    var enteringCitySelector = function() {
      self.citySelector.setupScene(self.scene, self.camera);
    };

    var leavingCitySelector = function() {
      console.log("leaving city selector");
    };

    stateMachine.addState('city_selector', enteringCitySelector, leavingCitySelector, true);

    var enteringCity = function() {
      console.log("entering city");
    }

    var leavingCity = function() {
      console.log("leaving city");
    }

    stateMachine.addState('city', enteringCity, leavingCity);

    stateMachine.connectStatePair('city_selector', 'city');

    stateMachine.start();

    stateMachine.transition('city');
    stateMachine.transition('city_selector');
  }

  animate() {
    requestAnimationFrame( this.animate.bind(this) );

    this.stats.update();
    this.controls.update();

    this.render();
  }

  render() {
    var timer = 0.0001 * Date.now();
    
    this.renderer.render( this.scene, this.camera );
  }

}





$(document).ready(function() {

var game = new Game();
  
});