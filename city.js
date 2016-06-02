class City {

  setupScene(scene, camera, changeCameraTargetFunc, renderer) {
    camera.position.set(-100, 70, 0);
    // camera.lookAt();
    changeCameraTargetFunc(new THREE.Vector3(150, -100, 450));
    // camera.updateProjectionMatrix();

    renderer.setClearColor(0x3cade6);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
    scene.add( directionalLight );

    // var spotlight = new THREE.SpotLight(0xffffff, 0.5, 100, Math.PI, 1);
    // spotlight.position.set(-this.depth, 50, 0);
    // spotlight.target.position.set(0, 0, 0);
    // scene.add(spotlight);

    var ambientLight = new THREE.AmbientLight( 0xcccccc );
    scene.add( ambientLight );

      var loader = new THREE.TextureLoader();
      var texture = loader.load("/resources/images/asphalt.png", function() {
        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 4);
        
        var material =  new THREE.MeshBasicMaterial({map: texture});
        material.transparent = false;
        material.side = THREE.DoubleSide;

        var planeLength = 800;
        var planeGeometry = new THREE.PlaneGeometry(200, planeLength);
        planeGeometry.rotateX(-Math.PI/2);
        var planeMesh = new THREE.Mesh(planeGeometry, material);
        planeMesh.position.set(0, 0, planeLength/2);
        
        scene.add(planeMesh);
      });

    
  }

  teardownScene(scene) {

  }
}