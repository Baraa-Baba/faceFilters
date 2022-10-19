import NN_STANDARD_2 from './neuralNets/NN_STANDARD_2.json' assert { type: "json" };
import { GLTFLoader } from './GLTFLoader.js'   
let THREECAMERA = null;
var mainChanger1
var mainChanger1Light
var light1
var mainChanger2
var mainChanger3
var myspec
var threeStuffs
var threeCube
var mainChanger = new THREE.Object3D()
var y = 19
let HATOBJ3D
let casaMask
let ANONYMOUSOBJ3D
let ANONYMOUSMESH
let ponyTail
let light
let covidMask
let driftMask
let heartEmoji
let scaryMask
let bandana_mask
let welding_mask
let masquerade_cat_mask_3
let forest_mask
let clown_2_mask
let joker_mask
let batman_mask
let egypt_cat_mask
let samurai_mask
let bunnyEars
let magicHat
// callback: launched if a face is detected or lost.
function detect_callback(faceIndex, isDetected) {
    if (isDetected) {  
    } else {  
    }
}
function getSilence() {
    let ctx = new AudioContext(),
        oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
}
// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
    console.log('from three scence')
    threeStuffs = JeelizThreeHelper.init(spec, detect_callback);
    const cubeGeometry = new THREE.BoxGeometry(Math.random(), Math.random(), Math.random());
    const cubeMaterial = new THREE.MeshNormalMaterial();
    threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    threeCube.frustumCulled = false;   
    // threeStuffs.faceObjects[0].add(mainChanger.clone()) 
    // threeStuffs.faceObjects[1].add(mainChanger.clone()) 
    // threeStuffs.faceObjects[2].add(mainChanger.clone())
    
    THREECAMERA = JeelizThreeHelper.create_camera();
    myspec = spec
    
} // end init_threeScene()

// launched by body.onload():
function main() { 
        const c = document.getElementById('jeeFaceFilterCanvas')
        var video = document.getElementById("tmpVideo");
        c.height = video.videoHeight
        c.width = video.videoWidth
        init_faceFilter(null); 

    loadFilterModels()
}
function loadFilterModels() {
    // CREATE OUR MASK OBJECT AND ADD IT TO OUR SCENE
    const casaLoader = new THREE.BufferGeometryLoader();

    casaLoader.load(
        './models/casa_de_papel/casa_de_papel.json',
        (maskGeometry) => {
            const maskMaterial = new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load('./models/casa_de_papel/CasaDePapel_DIFFUSE.png'),
                normalMap: new THREE.TextureLoader().load('./models/casa_de_papel/CasaDePapel_NRM.png'),
                reflectivity: 1,
                emissiveMap: new THREE.TextureLoader().load('./models/casa_de_papel/CasaDePapel_REFLECT.png')
            });

            casaMask = new THREE.Mesh(maskGeometry, maskMaterial);
            casaMask.scale.multiplyScalar(0.06);
            casaMask.position.y = -0.8;
            casaMask.scale.x = 0.07;

        }
    )

    // CREATE OUR ANONYMOUS MASK:
    const headLoader = new THREE.BufferGeometryLoader();
    headLoader.load(
        './models/anonymous/anonymous.json',
        (geometryHead) => {
            const mat = new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load('./models/anonymous/anonymous.png'),
                transparent: true
            });

            ANONYMOUSMESH = new THREE.Mesh(geometryHead, mat);
            ANONYMOUSMESH.frustumCulled = false;
            ANONYMOUSMESH.scale.multiplyScalar(0.065);
            ANONYMOUSMESH.position.set(0, -0.65, 0.35)
            // FOR THE APPEAR ANIMATION
            // we set the opacity of the materials to zero
            // the mesh will appear when the user growwlsss (or simply open his mouth)

            ANONYMOUSOBJ3D = new THREE.Object3D();
            const light = new THREE.AmbientLight(0xfffffff);
            light.position.z = +1;
            ANONYMOUSOBJ3D.add(ANONYMOUSMESH);
        }
    );

    HATOBJ3D = new THREE.Object3D();
    // Create the JSONLoader for our hat
    const bufferloader = new THREE.BufferGeometryLoader();
    // Load our cool hat
    bufferloader.load(
        './models/luffys_hat/luffys_hat.json',
        function (geometry) {
            // we create our Hat mesh
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/luffys_hat/Texture2.jpg")
            });

            const HATMESH = new THREE.Mesh(geometry, mat);

            HATMESH.scale.multiplyScalar(1.2 * 1.2);
            HATMESH.rotation.set(-0.1, 0, 0);
            HATMESH.position.set(0.0, 0.7, -0.6);
            HATMESH.frustumCulled = false;
            HATMESH.side = THREE.DoubleSide;


            HATOBJ3D.add(HATMESH);


        }
    );
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('../covidmaskglb.glb', gltf => {

        gltf.scene.scale.set(10, 8, 10);
        gltf.scene.position.set(0, -1.6, 0)
        covidMask = gltf.scene
    }); 
 
    gltfLoader.load('../models/scary_mask.glb', gltf => {

        gltf.scene.scale.set(0.75, 0.75, 0.75);
        gltf.scene.position.set(0, 0.4, -0)
        gltf.scene.rotation.set(0, 0, 0)
        scaryMask = gltf.scene
    });
    gltfLoader.load('../models/drift_mask.glb', gltf => { 
        gltf.scene.scale.set(1.25, 1.25, 1.25);
        gltf.scene.position.set(0, -0.7, -0.2)
        gltf.scene.rotation.set(0, -64.5, 0)
        driftMask = gltf.scene
    })
    gltfLoader.load('../models/3d_love_emoji.glb', gltf => {

        gltf.scene.scale.set(0.035, 0.035, 0.035);
        gltf.scene.position.set(0, 0.4, 0)
        gltf.scene.rotation.set(0, 0, 0)
        heartEmoji = gltf.scene
    });
    gltfLoader.load('../models/bandana_mask.glb', gltf => {

        gltf.scene.scale.set(1.2, 1.2, 1.2);
        gltf.scene.position.set(0, -0.45, 0)
        gltf.scene.rotation.set(0, 0, 0)
        bandana_mask = gltf.scene
    });
    gltfLoader.load('../models/welding_mask.glb', gltf => {

        gltf.scene.scale.set(8.5, 8.5, 8.5);
        gltf.scene.position.set(0, 1, 0)
        gltf.scene.rotation.set(0, 89.5, 0)
        welding_mask = gltf.scene
    });
    gltfLoader.load('../models/masquerade_cat_mask_3.glb', gltf => {

        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(0, -0.2, 0)
        gltf.scene.rotation.set(0, 0, 0)
        masquerade_cat_mask_3 = gltf.scene
    });
    gltfLoader.load('../models/forest_mask.glb', gltf => {

        gltf.scene.scale.set(0.1, 0.1, 0.1);
        gltf.scene.position.set(0, 0.5, 0)
        gltf.scene.rotation.set(0, 0, 0)
        forest_mask = gltf.scene
    });
    gltfLoader.load('../models/clown_2_mask.glb', gltf => {

        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(0, -1, 0)
        gltf.scene.rotation.set(0, 0, 0)
        clown_2_mask = gltf.scene
    });
    gltfLoader.load('../models/joker_mask.glb', gltf => {

        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(0, -1, 0)
        gltf.scene.rotation.set(0, 0, 0)
        joker_mask = gltf.scene
    });
    gltfLoader.load('../models/batman_mask.glb', gltf => {

        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(0, -0.3, 0)
        gltf.scene.rotation.set(0, 0, 0)
        batman_mask = gltf.scene
    });
    gltfLoader.load('../models/egypt_cat_mask.glb', gltf => {

        gltf.scene.scale.set(0.011, 0.011, 0.011);
        gltf.scene.position.set(0.08, 0.2, 0)
        gltf.scene.rotation.set(0, 0, 0)
        egypt_cat_mask = gltf.scene
    });
    gltfLoader.load('../models/samurai_mask.glb', gltf => {

        gltf.scene.scale.set(1.75, 1.75, 1.75);
        gltf.scene.position.set(0, -2.6, 0)
        gltf.scene.rotation.set(0, 0, 0)
        samurai_mask = gltf.scene
    });
    gltfLoader.load('../models/bunnyEars.glb', gltf => {

        gltf.scene.scale.set(0.01, 0.01, 0.01);
        gltf.scene.position.set(0, 1, 0)
        gltf.scene.rotation.set(0, 0, 0)
        bunnyEars = gltf.scene
    });
    gltfLoader.load('../models/noenglassesPositionedTest.glb', gltf => {

        gltf.scene.scale.set(0.0035, 0.0035, 0.0035);
        gltf.scene.position.set(0, 0.46, 0)
        gltf.scene.rotation.set(0, 0, 0)
        magicHat = gltf.scene
    });
    const loader = new GLTFLoader();
    loader.load('../ponyTialTest1001.glb', gltf => {
        console.log('loded')
        gltf.scene.scale.set(1.4, 1.4, 1.4)
        gltf.scene.position.set(0, -9.3, 0)
        gltf.scene.rotation.set(0, 150, 0)

        ponyTail = gltf.scene
    });
}
console.log('from main')
function init_faceFilter(VIDEOELEMENT) {
    handleFilterChange()
    JEELIZFACEFILTER.init({
        followZRot: true,
        canvasId: 'jeeFaceFilterCanvas', 
        stabilizationSettings:{
            translationFactorRange:[0.0002, 0.0006],
            // alphaRange:[0.99, 1.0],
            // rotationFactorRange:[15, 30]
            //qualityFactorRange:[0.9, 0.98]
        },
        scanSettings:{
            nDetectsPerLoop :5.5,
        },
        NNC: NN_STANDARD_2, // root of NN_DEFAULT.json file
        isKeepRunningOnWinFocusLost: true,
        maxFacesDetected: 3,
        videoSettings: {
            videoElement: VIDEOELEMENT,
        },
        callbackReady: function (errCode, spec) {
            if (errCode) {
                console.log('AN ERROR HAPPENS. ERR =', errCode);
                return;
            }

            console.log('INFO: JEELIZFACEFILTER IS READY');
            init_threeScene(spec); 
        },

        // called at each render iteration (drawing loop):
        callbackTrack: function (detectState) { 
            JeelizThreeHelper.render(detectState, THREECAMERA);


        }
    }); //end JEELIZFACEFILTER.init call  
}
function handleFilterChange() {
    document.getElementById('chooseFilter').addEventListener('click', () => { 
        clearMainChanger()
        setTimeout(() => {
            var filter = document.getElementById('filterValue').value
            document.getElementById('tmpVideo').style.transform = `rotateY(${0}deg)`
           
            
    const gltfLoader = new GLTFLoader();
            if (filter == 'none') {
                light = new THREE.PointLight(0xffffff, 1);
                light.position.z = +10;
            }
            if (filter == 'inverted') {
                document.getElementById('JEELIZFACEFILTER ').style.transform = `rotateY(${180}deg)`
            }
            if (filter == 'laCasaMask') {

                light = new THREE.PointLight(0xffffff, 1);
                light.position.z = +6;
                
                mainChanger.add(casaMask)
           
            }
            if (filter == 'AnoymnMask') {
                light = new THREE.PointLight(0xffffff, 1);
                light.position.z = +6;
                
                mainChanger.add(ANONYMOUSMESH)
            }
            if (filter == 'LuffyHat') {
                
                mainChanger.add(HATOBJ3D)

            }
            if (filter == 'covidMask') {
                light = new THREE.PointLight(0xffffff, 1);
                light.position.z = +6;
                
                mainChanger.add(covidMask)

            }
            if (filter == 'hair') {
                light = new THREE.PointLight(0x313131, 50);
                light.position.z = +4;
                light.position.y = -5;
                
                mainChanger.add(ponyTail)
            }if(filter=='driftMask'){
             
                    light = new THREE.PointLight(0xffffff, 1);
                    light.position.z = +10;
                    
                    mainChanger.add(driftMask) 
            }if(filter=='scaryMask'){
                light = new THREE.PointLight(0xffffff, 2);
                light.position.z = +10;
                
                mainChanger.add(scaryMask)
            }if(filter=='heartEmoji'){
                light = new THREE.PointLight(0xffffff, 1);
                light.position.z = +10;
                
                mainChanger.add(heartEmoji)
            }if(filter=='bandana_mask'){
                light = new THREE.PointLight(0xffffff, 1);
                light.position.z = +10;
                
                mainChanger.add(bandana_mask)
            }if(filter=='welding_mask'){
                light = new THREE.PointLight(0xffffff, 20);
                light.position.z = +10;
                
                mainChanger.add(welding_mask)
            }
            if(filter=='masquerade_cat_mask_3'){
                light = new THREE.PointLight(0xffffff, 2);
                light.position.z = +10;
                
                mainChanger.add(masquerade_cat_mask_3)
            }
            if(filter=='forest_mask'){
                light = new THREE.PointLight(0xffffff, 5);
                light.position.z = +10;
                
                mainChanger.add(forest_mask)
            }
              if(filter=='clown_2_mask'){
                light = new THREE.PointLight(0xffffff, 2);
                light.position.z = +10;
                
                mainChanger.add(clown_2_mask)
            }
            if(filter=='joker_mask'){
                light = new THREE.PointLight(0xffffff, 1);
                light.position.z = +10;
                
                mainChanger.add(joker_mask)
            }
            if(filter=='batman_mask'){
                light = new THREE.PointLight(0xffffff, 1);
                light.position.z = +10;
                
                mainChanger.add(batman_mask)
            }
            if(filter=='egypt_cat_mask'){
                light = new THREE.PointLight(0xffffff, 1);
                light.position.z = +10;
                
                mainChanger.add(egypt_cat_mask)
            }
            if(filter=='samurai_mask'){
                light = new THREE.PointLight(0xffffff, 2);
                light.position.z = +10;
                
                mainChanger.add(samurai_mask)
            }
            if(filter=='bunnyEars'){
                light = new THREE.PointLight(0xffffff, 1);
                light.position.z = +10;
                
                mainChanger.add(bunnyEars)
            }
            if(filter=='magicHat'){
                light = new THREE.PointLight(0xffffff, 1);
                light.position.z = +10;
                
                mainChanger.add(magicHat)
            }  
            JeelizThreeHelper.addLight(light)
            //mainChanger.add(light)
            threeStuffs.faceObjects[0].remove(mainChanger1) 
            threeStuffs.faceObjects[1].remove(mainChanger2) 
            threeStuffs.faceObjects[2].remove(mainChanger3)  
            mainChanger1=mainChanger.clone() 
            mainChanger2=mainChanger.clone()
            mainChanger3=mainChanger.clone()  
            threeStuffs.faceObjects[0].add(mainChanger1) 
            threeStuffs.faceObjects[1].add(mainChanger2) 
            threeStuffs.faceObjects[2].add(mainChanger3)
            //threeStuffs.faceObject.add(mainChanger) 
        }, 1)
    })
}
function clearMainChanger() {
//     threeStuffs.faceObjects.forEach(function(faceObject){ // display the cube for each detected face
        
//    faceObject.remove(mainChanger.clone())
//    faceObject.remove(threeCube.clone())
//    faceObject.remove(forest_mask.clone())
//         faceObject.remove(ANONYMOUSOBJ3D.clone())
//         faceObject.remove(ANONYMOUSMESH.clone())
//         faceObject.remove(light.clone())
//         faceObject.remove(ponyTail.clone())
//         faceObject.remove(covidMask.clone())
//         faceObject.remove(casaMask.clone())
//         faceObject.remove(HATOBJ3D.clone())
//         faceObject.remove(driftMask.clone())
//         faceObject.remove(scaryMask.clone())
//         faceObject.remove(heartEmoji.clone())
//         faceObject.remove(bandana_mask.clone())
//         faceObject.remove(welding_mask.clone())
//         faceObject.remove(masquerade_cat_mask_3.clone())
//         faceObject.remove(clown_2_mask.clone())
//         faceObject.remove(joker_mask.clone())
//         faceObject.remove(batman_mask.clone())
//         faceObject.remove(egypt_cat_mask.clone())
//         faceObject.remove(samurai_mask.clone())
//         faceObject.remove(bunnyEars.clone())
//         faceObject.remove(magicHat.clone())
//       });
              
   mainChanger.remove(threeCube)
   mainChanger.remove(forest_mask)
        mainChanger.remove(ANONYMOUSOBJ3D)
        mainChanger.remove(ANONYMOUSMESH)
        mainChanger.remove(light)
        mainChanger.remove(ponyTail)
        mainChanger.remove(covidMask)
        mainChanger.remove(casaMask)
        mainChanger.remove(HATOBJ3D)
        mainChanger.remove(driftMask)
        mainChanger.remove(scaryMask)
        mainChanger.remove(heartEmoji)
        mainChanger.remove(bandana_mask)
        mainChanger.remove(welding_mask)
        mainChanger.remove(masquerade_cat_mask_3)
        mainChanger.remove(clown_2_mask)
        mainChanger.remove(joker_mask)
        mainChanger.remove(batman_mask)
        mainChanger.remove(egypt_cat_mask)
        mainChanger.remove(samurai_mask)
        mainChanger.remove(bunnyEars)
        mainChanger.remove(magicHat) 
}
var i
function n() {
    i = 100
}
n()
console.log(i)
n()
main()
console.log('loaded main') 
