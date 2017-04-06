/** @overview Main file. Contains the init, render, animate and show functions.
*/
var request, mesh, renderer, scene, camera, directionalLight, controls, phantom;
/** @var {string} path
  * Path to file in the JSON request.
*/
var path = "phantom_save.json";
var container = document.getElementById('container');
var meshConstraints = {
  /** @constant {object} meshConstraint Constant used in Phantom.addFiber Phantom.addIsotropicRegion for defining segments in meshes.
  Used as a parameter for WEBGL stability.
  * @property {number} maxTotalAxialSegments Maximum number of Axial Segments in fiber tube mesh to appear in the scene
  * @property {number} maxMeshAxialSegments Maximum number of Axial Segments to feature in a fiber tube mesh
  * @property {number} maxTotalRadialSegments Maximum number of Radial Segments in fiber tube mesh to appear in the scene
  * @property {number} maxMeshRadialSegments Maximum number of Radial Segments to feature in a fiber tube mesh
  * @property {number} maxTotalLineSegments Maximum number of Line Segments to appear in the scene
  * @property {number} maxMeshLineSegments Maximum number of Line Segments to feature in a single skeleton line
  * @property {number} maxTotalSkeletonSphereSegments Maximum number of Radial Segments in skeleton control points to appear in the scene
  * @property {number} maxMeshSkeletonSphereSegments Maximum number of Radial Segments to feature in a single control point sphere mesh
  * @property {number} maxTotalIsotropicRegionSegments Maximum number of Radial Segments in Isotropic Regions to appear in the scene
  * @property {number} maxMeshIsotropicRegionSegments Maximum number of Radial Segments in Isotropic Regions to appear in a single mesh
  */
    maxTotalAxialSegments: 1440,
    maxMeshAxialSegments: 128,

    maxTotalRadialSegments: 480,
    maxMeshRadialSegments: 32,

    maxTotalLineSegments: 960,
    maxMeshLineSegments: 128,

    maxTotalSkeletonSphereSegments: 240,
    maxMeshSkeletonSphereSegments: 32,

    maxTotalIsotropicRegionSegments: 1024,
    maxMeshIsotropicRegionSegments: 32
}

/** @constant precision Number of decimal digits present in all values given.
*/
var precision = 1; // in amount of decimal digits
function roundToPrecision(number) {
/** @function roundToPrecision
  * @desc Applies precision to any value.
  * @param {number|string} number Number to round
  * @return {number} The rounded number
  */

  // Correct type
  number = Number(number);

  number *= 10 * precision;
  number = Math.round(number);
  number /= 10 * precision;
  return number;
}
init();

function render() {
/** @function render
  * @desc Renders the scene. Must be called anytime the scene is changed.
  */
  renderer.render(scene, camera);
}

function animate() {
/** @function animate
  * @desc Called recursively. Updates the controls as well.
  */
  requestAnimationFrame( animate );
  controls.update();
}
function init() {
/** @function init
  * @desc Initialises the app. Starting from a XMLHttpRequest, calls [show()]{@link show} and [setupGUI()]{@link setupGUI}.
  */
  request = new XMLHttpRequest();
  request.overrideMimeType("text/plain");
  request.open("get", path, true);
  request.onreadystatechange = function() {
    if ( (request.readyState === 4) && (request.status === 200) ) {
      show();
      setupGUI();
      }
    };
  request.send(null);
}
/** @function show
  * @desc Initialises everything regarding the THREE.js environtment. Adds window events.
  * @requires THREE.js
  * @requires TrackballControls.js
*/
function show() { // The rendering engine is initialized
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.offsetWidth, window.innerHeight);
  // It is appended to the div container in the HTML5 tree
  container.appendChild(renderer.domElement);

  // We create a scene and a camera. Position is to be corrected further in the code.
  camera = new THREE.PerspectiveCamera(50,
                                       container.offsetWidth / (window.innerHeight),
                                       1,
                                       10000);
  camera.position.set(0, 0, 0);

  // Create, the scene and add cameras, lights.
  scene = new THREE.Scene();
  scene.add(camera);
  scene.add(new THREE.AmbientLight( 0xffffff, .5 ) );
  // Directional lights are added in all directions
  for (var x = -100; x <= 100; x=x+200) {
    for (var y = -100; y <= 100; y=y+200) {
      for (var z = -100; z <= 100; z=z+20) {
        var directionalLight = new THREE.DirectionalLight(0x555555, .15);
        directionalLight.position.x = x;
        directionalLight.position.y = y;
        directionalLight.position.z = z;
        scene.add(directionalLight);
      }
    }
  }

  // Load phantom and add it in the scene
  phantom = loadPhantom( request );
  phantom.addToScene(scene);
  camera.position.z = phantom.radius() * 2 * 1.5;

  renderer.render(scene, camera);

  // Add mouse control to the camera
  controls = new THREE.TrackballControls( camera , renderer.domElement );
  controls.enableZoom = true;
  controls.rotateSpeed = 2.5;
  controls.zoomSpeed = 1;
  controls.noPan = false;
  controls.addEventListener('change', render);

  // Leave confirmation. From https://stackoverflow.com/questions/10311341/confirmation-before-closing-of-tab-browser
  window.onbeforeunload = function (e) {
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Leave Phantomas?';
    }

    // For Safari
    return 'Leave Phantomas?';
  };
  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize(){
    camera.aspect = container.offsetWidth / (window.innerHeight);
    camera.updateProjectionMatrix();

    renderer.setSize( container.offsetWidth, window.innerHeight);
    render();

    resizeGUI();
  }
  // Call animate to start the recursive call.
  animate();
}
