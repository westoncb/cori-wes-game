class City {

  setupScene(scene, camera, changeCameraTargetFunc, renderer) {
    var groundThickness = 20;

    camera.position.set(-200, 130, -140);
    // camera.lookAt();
    changeCameraTargetFunc(new THREE.Vector3(250, -150, 600));
    // camera.updateProjectionMatrix();

    renderer.setClearColor(0x3cade6);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set(-300, 200, 500);
    scene.add( directionalLight );

    var directionalLight2 = new THREE.DirectionalLight( 0xffdc82, 0.5 );
    directionalLight2.position.set(-100, 300, 0);
    scene.add( directionalLight2 );

    // var spotlight = new THREE.SpotLight(0xffffff, 0.5, 100, Math.PI, 1);
    // spotlight.position.set(-100, 100, 600);
    // spotlight.target.position.set(0, 0, 0);
    // scene.add(spotlight);

    var ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add( ambientLight );

      var loader = new THREE.TextureLoader();
      var texture = loader.load("/resources/images/asphalt.png", function() {
        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 6);
        
        var material =  new THREE.MeshStandardMaterial({map: texture, metalness: 0.2, roughness: 1});
        material.transparent = false;
        material.side = THREE.DoubleSide;

        var planeLength = 800;
        var planeGeometry = new THREE.BoxGeometry(350, groundThickness, planeLength);
        // planeGeometry.rotateX(-Math.PI/2);
        var planeMesh = new THREE.Mesh(planeGeometry, material);
        planeMesh.position.set(0, 0, planeLength/2);
        
        scene.add(planeMesh);
      });




    // model
    var onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        // console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };
    var onError = function ( xhr ) { };
    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'resources/models/building/' );
    mtlLoader.load( 'edifici_prat.mtl', function( materials ) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials( materials );
      objLoader.setPath( 'resources/models/building/' );
      objLoader.load( 'edifici_prat.obj', function ( object ) {

        object.scale.set(8, 8, 8);
        object.rotation.set(0, -Math.PI/2, 0);
        object.position.set(30, groundThickness/2, 100);
        scene.add( object );
      }, onProgress, onError );
    });
  }

  teardownScene(scene) {

  }
}