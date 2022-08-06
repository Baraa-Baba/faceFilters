import "./styles.css";
import Filters from './filters'
import React, { useEffect, useState, useRef } from "react";
export default function App() {
  const userVideo = useRef(); 
  const tmpUserVideo = useRef()
  const [stream,setStream]=useState()
  const [filter,setFilter]=useState('none')
  useEffect(()=>{

    function getSilence() {
      let ctx = new AudioContext(),
        oscillator = ctx.createOscillator();
      let dst = oscillator.connect(ctx.createMediaStreamDestination());
      oscillator.start();
      return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    }
  
    function getBlack() {
      let width = 580;
      let height = 400;
      let canvas = Object.assign(document.createElement("canvas"), {
        width,
        height,
      });
      let ctx = canvas.getContext("2d");
      let stream = canvas.captureStream(30);
      return Object.assign(stream.getVideoTracks()[0]);
    }
  
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
      (newStream) => {
        // setStream(newStream);
        if (tmpUserVideo.current) {
          tmpUserVideo.current.srcObject = newStream;
        }
        var canvas = document.getElementById("myCanvas");
        var mystream = canvas.captureStream();
        let filterStreamm = new MediaStream([
          ...newStream.getAudioTracks(),
          ...mystream.getVideoTracks(),
        ]);
        setStream(newStream);
        if (userVideo.current) {
          userVideo.current.srcObject = newStream;
        } 
      },
      () => { 

        navigator.mediaDevices.getUserMedia({ video: true }).then(

          (newStream) => {
            let silenceStream = new MediaStream([
              getSilence(),
              ...newStream.getVideoTracks(),
            ]);
            if (tmpUserVideo.current) {
              tmpUserVideo.current.srcObject = newStream;
            }
            var canvas = document.getElementById("myCanvas");
            var mystream = canvas.captureStream();
            let filterStreamm = new MediaStream([
              getSilence(),
              ...mystream.getVideoTracks(),
            ]);
            setStream(silenceStream);
            if (userVideo.current) {
              userVideo.current.srcObject = filterStreamm;
            } 
          },
          () => {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(
              (newStream) => {
                let blackStream = new MediaStream([
                  getBlack(),
                  ...newStream.getAudioTracks(),
                ]);
                if (tmpUserVideo.current) {
                  tmpUserVideo.current.srcObject = blackStream;
                }
                setStream(blackStream);
                if (userVideo.current) {
                  userVideo.current.srcObject = blackStream;
                }
              },
              () => {
                let dummyStream = new MediaStream([getSilence(), getBlack()]);
                if (tmpUserVideo.current) {
                  tmpUserVideo.current.srcObject = dummyStream;
                }
                setStream(dummyStream);
                if (userVideo.current) {
                  userVideo.current.srcObject = dummyStream;
                }
              }
            );
          }
        );
      }
    );
  },[])
  let UserVideo;
  useEffect(() => {
    if (userVideo.current && stream) {

      if (filter === 'none'||filter==='inverted') {
        userVideo.current.srcObject = stream; 
      } 
      else {
        if (document.getElementById("myCanvas"))  { 
          var canvas = document.getElementById("myCanvas");
          var mystream = canvas.captureStream();
          let filterStreamm = new MediaStream([
            ...stream.getAudioTracks(),
            ...mystream.getVideoTracks(),
          ]); 
          userVideo.current.srcObject = filterStreamm;
          
        } else {
          userVideo.current.srcObject = stream; 

        }
      }
    }
  }, [filter, stream])
  if (stream) {
    UserVideo = (
      <video
        id='videoOfUser'
        className="video userVideo"
        playsInline
        muted
        ref={userVideo}
        autoPlay
        delay
      />
    );

  }
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      {UserVideo}
       <video
        id='tmpVideo'
        className="video userVideo"
        playsInline
        style={{ display: 'none' }}
        muted
        ref={tmpUserVideo}
        autoPlay
        delay
      />
      <Filters />
    </div>
  );
}
