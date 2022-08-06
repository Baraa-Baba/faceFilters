import React, { useState, useEffect, useRef } from 'react'

// import main script and neural network model from Jeeliz FaceFilter NPM package
import { JEELIZFACEFILTER } from 'facefilter'
import { JeelizThreeHelper } from './helpers/JeelizThreeHelper.js'
import * as THREE from 'three' 
import './dev/faceLowPoly.blend'

// import THREE.js helper, useful to compute pose
// The helper is not minified, feel free to customize it (and submit pull requests bro):
import NN_STANDARD_2 from 'facefilter/neuralNets/NN_STANDARD_2.json'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
let THREECAMERA = null;

const Filters = ({filter }) => {
    const theCanvas = useRef(null)
    const someVideo = useRef(null)
    const partnerCanvas = useRef(null)
    const [specTmp, setspecTmp] = useState({})
    const [fps, setfps] = useState(15)
    const [anomnMask, setAnomnMask] = useState({})
    const [laCasaMask, setLaCasaMask] = useState({})
    const [IsCameraStarted, setIsCameraStarted] = useState(false)
    const [luffyHat, setLuffyHat] = useState({})
    const [covidMask, setCovidMask] = useState({})
    const [isInt, setIsInt] = useState(false)

    function detect_callback(faceIndex, isDetected) {
        if (isDetected) {
            console.log('INFO in detect_callback(): DETECTED');
        } else {
            console.log('INFO in detect_callback(): LOST');
        }
    }
    // build the 3D. called once when Jeeliz Face Filter is OK:
    function init_basicThreeScence(spec) {
        spec.threeCanvasId = 'threeCanvas'


        //CREATE THE CAMERA
        THREECAMERA = JeelizThreeHelper.create_camera();
        JEELIZFACEFILTER.render_video()
    }
    useEffect(() => {
        /* JeelizResizer.size_canvas({
             canvas: theCanvas.current,
             callback: function (isError, bestVideoSettings) {
                 init_filters(bestVideoSettings);
             }
         })*/

        function main() {
            var VIDEOELEMENT
            if (document.getElementById('tmpVideo')) {
                VIDEOELEMENT = document.getElementById('tmpVideo');
            } else {
                setTimeout(main, 1000);
                return
            }
            if (VIDEOELEMENT['currentTime'] && VIDEOELEMENT['videoWidth']
                && VIDEOELEMENT['videoHeight']) {
                const c = document.getElementById('jeeFaceFilterCanvas')
                var video = document.getElementById("tmpVideo");
                c.height = video.videoHeight
                c.width = video.videoWidth
                const canvas = document.getElementById('myCanvas')
                const threeCanvas = document.getElementById('threeCanvas')
                canvas.height = video.videoHeight
                canvas.width = video.videoWidth
                const ctx = canvas.getContext("2d");
                const loop = setInterval(() => {
                    ctx.drawImage(video, 0, 0);
                    ctx.drawImage(threeCanvas, 0, 0, canvas.width, canvas.height);
                }, 1000 / 3)
                start_camera(VIDEOELEMENT)
                setIsCameraStarted(true)
            } else {
                setTimeout(main, 1000);
                VIDEOELEMENT['play']();
            }
        }
        main()
    }, [])
    function start_videoFile() {
        const JEELIZFACEFILTER2 = JEELIZFACEFILTER.create_new();
        init_filters(JEELIZFACEFILTER2, null, partnerCanvas.current);
    }


    function start_camera(videoElement) {

        init_filters(JEELIZFACEFILTER, videoElement, theCanvas.current);
    }
    function init_filters(jeeFaceFilterAPIInstance, VIDEOELEMENT, canvas) {
        jeeFaceFilterAPIInstance.init({
            canvas: canvas,
            isKeepRunningOnWinFocusLost: true,
            NNC: NN_STANDARD_2, // root of NN_DEFAULT.json file
            videoSettings: {
                videoElement: VIDEOELEMENT
            },
            callbackReady: function (errCode, spec) {
                if (errCode) {
                    if (VIDEOELEMENT === null) {
                        console.log('AN ERROR HAPPENS in user. SORRY BRO :( . ERR =', errCode);
                    } else {
                        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);

                    }
                    return;
                }
                // let canvas = document.getElementById("threeCanvas")
                // let stream = canvas.captureStream(30);
                // const canvasStream = Object.assign(stream.getVideoTracks()[0]);

                // let ctx = new AudioContext(),
                //     oscillator = ctx.createOscillator();
                // let dst = oscillator.connect(ctx.createMediaStreamDestination());
                // oscillator.start();
                // const silience = Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
                // let dummyStream = new MediaStream([canvasStream, silience]);

                // setCanvasStream(dummyStream);
                // if (someVideo.current) {
                //     someVideo.current.srcObject = dummyStream;
                // }
                JEELIZFACEFILTER.get_videoDevices((d) => {
                    console.log(d)
                })
                setIsInt(true)
                console.log('INFO: JEELIZFACEFILTER IS READY');
                init_covidMakThreeScene(spec)
                console.log(spec, 'init_AnyomnMaskthreeScene')
                setspecTmp(spec)

            },

            // called at each render iteration (drawing loop):
            callbackTrack: function (detectState) {
                JeelizThreeHelper.render(detectState, THREECAMERA)
            }
        }); //end JEELIZFACEFILTER.init call
    }


    useEffect(() => {
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

                const maskMesh = new THREE.Mesh(maskGeometry, maskMaterial);
                maskMesh.scale.multiplyScalar(0.06);
                maskMesh.position.y = -0.8;
                maskMesh.scale.x = 0.07;

                setLaCasaMask(maskMesh)
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

                const ANONYMOUSMESH = new THREE.Mesh(geometryHead, mat);
                ANONYMOUSMESH.frustumCulled = false;
                ANONYMOUSMESH.scale.multiplyScalar(0.065);
                ANONYMOUSMESH.position.set(0, -0.75, 0.35)
                // FOR THE APPEAR ANIMATION
                // we set the opacity of the materials to zero
                // the mesh will appear when the user growwlsss (or simply open his mouth)

                const ANONYMOUSOBJ3D = new THREE.Object3D();
                ANONYMOUSOBJ3D.add(ANONYMOUSMESH);
                setAnomnMask(ANONYMOUSOBJ3D)
            }
        );

        let HATOBJ3D = new THREE.Object3D();
        // Create the JSONLoader for our hat
        const loader = new THREE.BufferGeometryLoader();
        // Load our cool hat
        loader.load(
            '/models/luffys_hat/luffys_hat.json',
            function (geometry) {
                // we create our Hat mesh
                const mat = new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load("/models/luffys_hat/Texture2.jpg")
                });

                const HATMESH = new THREE.Mesh(geometry, mat);

                HATMESH.scale.multiplyScalar(1.2 * 1.2);
                HATMESH.rotation.set(-0.1, 0, 0);
                HATMESH.position.set(0.0, 0.7, -0.6);
                HATMESH.frustumCulled = false;
                HATMESH.side = THREE.DoubleSide;


                HATOBJ3D.add(HATMESH);
                setLuffyHat(HATOBJ3D)
            }
        );
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('/medicalsurgical_mask/scene.gltf', gltf => {

            gltf.scene.scale.set(10, 8, 10);
            gltf.scene.position.set(0, -1.6, 0)
            setCovidMask(gltf.scene)
        });
    }, [])




    function init_covidMakThreeScene(spec) {

        const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);

        const light = new THREE.PointLight(0xffffff, 1);
        light.position.z = +6;

        threeStuffs.faceObject.add(light);
        threeStuffs.faceObject.add(covidMask);
    }

    function init_HairThreeScene(spec) {

        const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);


        const loader = new GLTFLoader();
        loader.load('/3d_beautiful_style_hair/scene.gltf', gltf => {

            gltf.scene.scale.set(0.1, 0.1, 0.05);
            gltf.scene.position.set(0, -1, 0)
            gltf.scene.rotation.set(0, 160, 0)
            gltf.scene.opacity = 0.5;
            const light = new THREE.PointLight(0xF0E2B6, 10);
            light.position.z = +4;

            threeStuffs.faceObject.add(light);
            threeStuffs.faceObject.add(gltf.scene);
        });


    }


    // build the 3D. called once when Jeeliz Face Filter is OK
    function init_LuffyHatthreeScene(spec) {

        const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);


        threeStuffs.faceObject.add(luffyHat);


    }

    function init_AnyomnMaskthreeScene(spec) {

        const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);
        const light = new THREE.AmbientLight(0xfffffff);
        light.position.z = +1;
        threeStuffs.faceObject.add(light);
        threeStuffs.faceObject.add(anomnMask);


    }
    function init_MaskLaCasaThreeScene(spec) {

        const THREESTUFF = JeelizThreeHelper.init(spec, detect_callback);
        const light = new THREE.AmbientLight(0xfffffff);
        light.position.z = +1;
        THREESTUFF.faceObject.add(light);
        THREESTUFF.faceObject.add(laCasaMask);


    }
    useEffect(() => {
        if (isInt && document.getElementById('videoOfUser')) {
            if (filter === 'none') {
                if (document.getElementById('videoOfUser')) {
                    document.getElementById('videoOfUser').style.transform = `rotateY(${0}deg)`
                    init_basicThreeScence(specTmp)
                    setfps(15)
                }
                return
            }
            if (filter === 'inverted') {
                init_basicThreeScence(specTmp)
                document.getElementById('videoOfUser').style.transform = `rotateY(${180}deg)`
                setfps(15)

                return
            }
            if (filter === 'laCasaMask') {
                init_MaskLaCasaThreeScene(specTmp, 'threeCanvas')
                document.getElementById('videoOfUser').style.transform = `rotateY(${0}deg)`
                setfps(3)

                return
            }
            if (filter === 'AnoymnMask') {
                init_AnyomnMaskthreeScene(specTmp, 'threeCanvas')
                document.getElementById('videoOfUser').style.transform = `rotateY(${0}deg)`
                setfps(3)
                return
            }
            if (filter === 'LuffyHat') {
                init_LuffyHatthreeScene(specTmp, 'threeCanvas')
                document.getElementById('videoOfUser').style.transform = `rotateY(${0}deg)`
                setfps(3)
            }
            if (filter === 'covidMask') {
                init_covidMakThreeScene(specTmp, 'threeCanvas')
                document.getElementById('videoOfUser').style.transform = `rotateY(${0}deg)`
                setfps(3)
            }
            if (filter === 'hair') {
                init_HairThreeScene(specTmp, 'threeCanvas')
                document.getElementById('videoOfUser').style.transform = `rotateY(${0}deg)`
                setfps(3)
            }
            document.getElementById('videoOfUser').style.transform = `rotateY(${0}deg)`
        } else {
        }
    }, [filter]) 
    return (
        <>
            <video
                className="video userVideo"
                playsInline
                muted
                ref={someVideo}
                autoPlay
                id='videothree'
            />

            <canvas className={
                "videoContainer userVideoContainer "
            } id='threeCanvas'></canvas>
            <canvas className={
                "videoContainer partnerVideoContainer "
            } id='partnerThreeCanvas'></canvas>

            <canvas id='jeeFaceFilterCanvas' height='400' width='400' ref={theCanvas}>  </canvas>
            <canvas id='myCanvas'></canvas>

        </>
    );
}

export default Filters