class CitySelector {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    this.width = 90;
    this.depth = 50;
    this.xBuildingCount = 15;
    this.zBuildingCount = 8;
    this.buildingWidth = this.width / this.xBuildingCount;
    this.buildingDepth = this.depth / this.zBuildingCount;
    this.heightMap = [];
    for(var i = 0; i < this.xBuildingCount; i++) {
      this.heightMap.push([]);
    }
  }

  setupScene(scene, camera) {
    camera.position.set(0, 75, 50);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
    scene.add( directionalLight );

    // var spotlight = new THREE.SpotLight(0xffffff, 0.5, 100, Math.PI, 1);
    // spotlight.position.set(-this.depth, 50, 0);
    // spotlight.target.position.set(0, 0, 0);
    // scene.add(spotlight);

    var ambientLight = new THREE.AmbientLight( 0xcccccc );
    scene.add( ambientLight );

    var planeGeometry = new THREE.PlaneGeometry(this.width, this.depth);
    planeGeometry.rotateX(-Math.PI/2);
    var planeMesh = new THREE.Mesh(planeGeometry, new THREE.MeshStandardMaterial({color: 0xFF0000, side: THREE.DoubleSide}));
    planeMesh.position.set(0, 0, 0);
    
    scene.add(planeMesh);

    this.addBuildings(scene);
    this.addCities(scene);
  }

  addCities(scene) {
    for (var i = 0; i < 6; i++) {
      var xIndex = Math.floor(Math.random()*this.xBuildingCount);
      var zIndex = Math.floor(Math.random()*this.zBuildingCount);
      var x = this.xForIndex(xIndex);
      var z = this.zForIndex(zIndex);
      var y = this.heightMap[xIndex][zIndex] + 0.5;

      this.addCity(scene, x, y, z);
    }
  }

  addCity(scene, x, y, z) {
    var self = this;

    var c1 = 0x660000;
    var intensity = 1.0;
    var distance = 30;
    var decay = 0.5;
    // var light1 = new THREE.PointLight( c1, intensity, 20 );
    var sphereGeometry = new THREE.SphereBufferGeometry(2, 15, 15);
    // light1.add( );
    var city = new THREE.Mesh( sphereGeometry, new THREE.MeshStandardMaterial( { color: c1 , metalness: 0, roughness: 0.34} ) );
    city.position.set(x, y, z);
    city.onMouseEnter = function() {
      city.material.color.set(0xff0000);
    }
    city.onMouseLeave = function() {
      city.material.color.set(c1);
    }
    city.onMouseClick = function() {
      city.material.color.set(0x00ff00);
      self.stateMachine.transition('city');
    }

    scene.add(city);
  }

  addBuildings(scene) {
    var totalGeometry = new THREE.BoxBufferGeometry();

    var geometry = new THREE.BoxBufferGeometry(this.buildingWidth, 1, this.buildingDepth);
    var material = new THREE.MeshStandardMaterial({color: 0x666666, metalness: 0.8, roughness: 0.05});

    for (var i = 0; i < this.xBuildingCount; i++) {
      for (var j = 0; j < this.zBuildingCount; j++) {
        var height = Math.random()*10 + 3;
        this.heightMap[i][j] = height;
    
        var mesh = new THREE.Mesh(geometry, material);    
        mesh.position.set(this.xForIndex(i), height/2-0.1, this.zForIndex(j));
        mesh.scale.set(1, height, 1);
        scene.add(mesh);
      }
    }
  }

  xForIndex(index) {
    return index*this.buildingWidth - this.width/2 + this.buildingWidth/2;
  }

  zForIndex(index) {
    return index*this.buildingDepth - this.depth/2 + this.buildingDepth/2;
  }

  teardownScene(scene) {
    for( var i = scene.children.length - 1; i >= 0; i--){
      scene.remove(scene.children[i]);
    }
  }
}