class Game {
  constructor() {
    this.width = 800;
    this.height = 450;
    this.mousePos = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.initThreeJS();
    this.stateMachine = new StateMachine();
    this.citySelector = new CitySelector(this.stateMachine);
    this.initStateMachine();

    this.container.on('mousemove', this.onMouseMove.bind(this));
    this.container.on('click', this.onMouseClick.bind(this));

    this.animate();
  }

  initThreeJS() {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var container = document.createElement( 'div' );
    container.id = 'threejs-container';
    document.body.appendChild( container );
    this.container = $('#threejs-container');
    this.container.css('width', this.width);
    this.container.css('height', this.height);

    this.stats = new Stats();
    container.appendChild( this.stats.dom );

    this.scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera( 45, this.width/this.height, 1, 2000 );
    camera.position.set( 0, 100, 100 );
    camera.lookAt(0, 0, 0);
    this.camera = camera;

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( this.width, this.height );
    renderer.setClearColor( 0x666666 );
    renderer.sortObjects = false;
    container.appendChild( renderer.domElement );
    this.renderer = renderer

    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.enableZoom = true;
    this.controls = controls;
  }

  initStateMachine() {
    var self = this;
    var stateMachine = this.stateMachine;

    var enteringCitySelector = function() {
      self.citySelector.setupScene(self.scene, self.camera, self.changeCameraTarget.bind(self), self.renderer);
    };

    var leavingCitySelector = function() {
      self.citySelector.teardownScene(self.scene);
    };

    stateMachine.addState('city_selector', enteringCitySelector, leavingCitySelector, true);

    var enteringCity = function(data) {
      self.city = new City();
      self.city.setupScene(self.scene, self.camera, self.changeCameraTarget.bind(self), self.renderer);      
    }

    var leavingCity = function() {
      self.city.teardownScene(self.scene);
    }

    stateMachine.addState('city', enteringCity, leavingCity);

    stateMachine.connectStatePair('city_selector', 'city');

    stateMachine.start();
  }

  onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    var offset = this.container.offset();
    var canvasX = offset.left;
    var canvasY = offset.top;
    var relativeMouseX = event.clientX - canvasX;
    var relativeMouseY = event.clientY - canvasY;
    var canvasWidth = this.container.width();
    var canvasHeight = this.container.height();

    this.mousePos.x = ( relativeMouseX / canvasWidth ) * 2 - 1;
    this.mousePos.y = - ( relativeMouseY / canvasHeight ) * 2 + 1;

    this.checkForIntersectedObjects();
  }

  onMouseClick() {
    this.scene.children.forEach(child => {
      if (child.hasMouse && child.onMouseClick) {
        child.onMouseClick();
      }
    });
  }

  checkForIntersectedObjects() {
    // update the picking ray with the camera and mouse position  
    this.raycaster.setFromCamera( this.mousePos, this.camera ); 

    // calculate objects intersecting the picking ray
    var intersects = this.raycaster.intersectObjects( this.scene.children );

    for ( var i = 0; i < intersects.length; i++ ) {

      var object = intersects[ i ].object;
      if (object.onMouseEnter && !object.hasMouse) {
        object.onMouseEnter();
        object.hasMouse = true;
      }
    }

    this.scene.children.forEach(child => {
      var doesNotActuallyHaveMouse = !this.mouseIsOverObject(child, intersects);
      if (doesNotActuallyHaveMouse && child.hasMouse) {
        if (child.onMouseLeave) {
          child.onMouseLeave();
          child.hasMouse = false;
        }
      }
    });
  }

  changeCameraTarget(newTarget) {
    // this.cameraTarget.set(newTarget.x, newTarget.y, newTarget.z);
    if (this.controls) {
      this.controls.target.set(newTarget.x, newTarget.y, newTarget.z);
    }

    this.camera.lookAt(newTarget);
  }

  mouseIsOverObject(object, intersections) {
    
    //Only check the first intersection object since it's 
    //the one nearest the camera
    if (intersections.length > 0) {
      return intersections[0].object === object;
    } else {
      return false;
    }
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