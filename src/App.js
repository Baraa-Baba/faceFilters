import "./styles.css";
import Filters from './filters'
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import React, { useEffect, useState, useRef } from "react";
export default function App() {
  const userVideo = useRef(); 
  const tmpUserVideo = useRef()
  const [isOneVideo,setIsOneVideo]=useState(false)
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
              userVideo.current.srcObject = silenceStream;
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
  
  const handleDragStart = (e) => e.preventDefault()
  const filterOptions = [
    <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
      e.preventDefault()
      setFilter('none')
    }}
      className={`filter-image  ${filter == 'none' && 'opacity'}`} height={55} width={55} src='/assets/noSign.png' />
    ,

    <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
      e.preventDefault()
      setFilter('inverted')
    }}
      className={`filter-image  ${filter == 'inverted' && 'opacity'}`} height={55} width={55} src='/assets/inveted-icon.png' />
    ,

    <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
      e.preventDefault()
      setFilter('laCasaMask')
    }}
      className={`filter-image  ${filter == 'laCasaMask' && 'opacity'}`} height={55} width={55} src='/assets/laCasaMask.jpg' />
    ,

    <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
      e.preventDefault()
      setFilter('AnoymnMask')
    }}
      className={`filter-image  ${filter == 'AnoymnMask' && 'opacity'}`} height={55} width={55} src='/assets/anomny.png' />
    ,

    <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
      e.preventDefault()
      setFilter('LuffyHat')
    }}
      className={`filter-image  ${filter == 'LuffyHat' && 'opacity'}`} height={55} width={55} src='/assets/luffyHat.jpg' />
    ,

    <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
      e.preventDefault()
      setFilter('covidMask')
    }}
      className={`filter-image  ${filter == 'covidMask' && 'opacity'}`} height={55} width={55} src='/assets/covidMask.png' />
    ,

    <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
      e.preventDefault()
      setFilter('hair')
    }}
      className={`filter-image  ${filter == 'hair' && 'opacity'}`} height={55} width={55} src='/assets/gingerHair.jpg' />

  ]
  return (
    <div className="App"> 
      {UserVideo}
       <video
        id='tmpVideo'
        className="video userVideo"
        playsInline 
        muted
        ref={tmpUserVideo}
        autoPlay
        delay
      />
       <div style={{ position: 'absolute' }} className={`filter-coursel-cont`}>
              <AliceCarousel renderPrevButton={() => <button style={{ left: "0" }} className='filter-pagination-button'>{'<'}</button>
              } renderNextButton={() => <button style={{ right: "0" }} className='filter-pagination-button'>{'>'}</button>}
                infinite={true} responsive={{
                  0: { items: 1 },
                  568: { items: 6 },
                  1024: { items: 6 },
                }}
                disableDotsControls={true} mouseTracking renderKey={() => <button className='filter-pagination-button'>hello</button>}
                items={filterOptions} />

            </div> 
      <Filters filter={filter} />
      <style jsx>{`
      #tmpVideo { 

        position:absolute;
        left:${isOneVideo&&'-400%'} 
      } 
      #threeCanvas { 
        position:absolute;
        left:${isOneVideo&&'-400%'}
      }
      #videoOfUser{
        position:absolute;
        left:${!isOneVideo&&'-400%'}
      }
      `}</style>
    </div>
  );
}
