class CitySelector {
  constructor() {

  }

  setupScene(scene) {
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );

    var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( ambientLight );

    var planeGeometry = new THREE.PlaneGeometry(90, 50);
    planeGeometry.rotateX(-Math.PI/2);
    var planeMesh = new THREE.Mesh(planeGeometry, new THREE.MeshStandardMaterial({color: 0xFF0000, side: THREE.DoubleSide}));
    planeMesh.position.set(0, 0, 0);
    
    scene.add(planeMesh);
  }

  teardownScene(scene) {

  }
}