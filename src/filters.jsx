import React, { useEffect } from 'react';

const Filters = () => {
    useEffect(() => {
        function runScript(src) {
            const script = document.createElement("script");
            script.type = 'module';
            script.src = src;
            script.async = true;

            document.body.appendChild(script);
        }

        function main() {
            var VIDEOELEMENT
            if (document.getElementById('tmpVideo') && document.getElementById('videoOfUser')) {
                VIDEOELEMENT = document.getElementById('tmpVideo');
            } else {
                setTimeout(main, 1000);
                return
            }
            if (VIDEOELEMENT['currentTime'] && VIDEOELEMENT['videoWidth']
                && VIDEOELEMENT['videoHeight']) {
                runScript('/filters2Scripts/jeelizFaceFilter.js')
                runScript('/filters2Scripts/three.min.js')
                runScript('/filters2Scripts/JeelizResizer.js')
                runScript('/filters2Scripts/JeelizThreeHelper.js')
                runScript('/filters2Scripts/main.js')
            } else {
                setTimeout(main, 1000);
                VIDEOELEMENT['play']();
            }


        }
        main()
    }, [])
    return (
        <>
        <canvas style={{display:'block',top:'0',position:'absolute'
    }} width="600" height="600" id='jeeFaceFilterCanvas'></canvas>
            <div style={{ display: 'none' }}>
                <canvas width="600" height="600" id='myCanvas'></canvas>
                <video playsinline autoplay muted width="600" height="600" id="video"></video>
                <video playsinline autoplay muted width="600" height="600" id="tmpUserVideo"></video>
            </div>
        </>
    );
}

export default Filters;
