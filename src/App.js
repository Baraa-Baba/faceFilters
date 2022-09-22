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
  const [slide,setSlide] =useState(0)
  const [filter,setFilter]=useState('none')
  const filterValue =useRef()
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
        setStream(newStream);
        var canvas = document.getElementById("jeeFaceFilterCanvas");
        var mystream = canvas.captureStream();
        let filterStreamm = new MediaStream([
          ...stream.getAudioTracks(),
          ...mystream.getVideoTracks(),
        ]); 
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
    filterValue.current.value=filter
    document.getElementById('filterValue').value=filter
    if (userVideo.current && stream) {

      if (filter === 'none'||filter==='inverted') {
        var canvas = document.getElementById("jeeFaceFilterCanvas");
        var mystream = canvas.captureStream();
        let filterStreamm = new MediaStream([
          ...stream.getAudioTracks(),
          ...mystream.getVideoTracks(),
        ]); 
        userVideo.current.srcObject = filterStreamm;
      } 
      else {
        if (document.getElementById("jeeFaceFilterCanvas"))  { 
          var canvas = document.getElementById("jeeFaceFilterCanvas");
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
        style={{display:'none'}}
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
    }} id='bgInvertedImages'
      className={`filter-image  ${filter == 'none' && 'opacity'}`} height={55} width={55} src='/assets/noSign.png' />
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
      className={`filter-image  ${filter == 'hair' && 'opacity'}`} height={55} width={55} 
      src='/assets/gingerHair.jpg' />,
      <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
        e.preventDefault()
        setFilter('driftMask')
      }}
        className={`filter-image  ${filter == 'driftMask' && 'opacity'}`} height={55} 
        width={55} src='/assets/driftMaksIcon.png' />
  ,  <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
    e.preventDefault()
    setFilter('scaryMask')
  }}
   className={`filter-image  ${filter == 'scaryMask' && 'opacity'}`}
    height={55} width={55} src='/assets/scaryIconMask.png' />,
    <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
      e.preventDefault()
      setFilter('heartEmoji')
    }}
     className={`filter-image  ${filter == 'heartEmoji' && 'opacity'}`}
      height={55} width={55} src='/assets/hearteyesIcon.jfif' />,
      <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
        e.preventDefault()
        setFilter('bandana_mask')
      }}
       className={`filter-image  ${filter == 'bandana_mask' && 'opacity'}`}
        height={55} width={55} src='/assets/bandanaIcon.png' />,
        <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
          e.preventDefault()
          setFilter('welding_mask')
        }}
         className={`filter-image  ${filter == 'welding_mask' && 'opacity'}`}
          height={55} width={55} src='/assets/welding_maskIcon.png' />,
          <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
            e.preventDefault()
            setFilter('masquerade_cat_mask_3')
          }}
           className={`filter-image  ${filter == 'masquerade_cat_mask_3' && 'opacity'}`}
            height={55} width={55} src='/assets/masquerade_cat_mask_3icon.png' />,
            <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
              e.preventDefault()
              setFilter('forest_mask')
            }}
             className={`filter-image  ${filter == 'forest_mask' && 'opacity'}`}
              height={55} width={55} src='/assets/forestmaskIcon.png' />,
              <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
                e.preventDefault()
                setFilter('clown_2_mask')
              }}
               className={`filter-image  ${filter == 'clown_2_mask' && 'opacity'}`}
                height={55} width={55} src='/assets/clownIconMask.png' />,

                <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
                  e.preventDefault()
                  setFilter('magicHat')
                }}
                 className={`filter-image  ${filter == 'magicHat' && 'opacity'}`}
                  height={55} width={55} src='/assets/noenglassesIcon.png' />,
                <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
                  e.preventDefault()
                  setFilter('joker_mask')
                }}
                 className={`filter-image  ${filter == 'joker_mask' && 'opacity'}`}
                  height={55} width={55} src='/assets/jokerMaskIcon.png' />,
                  
                  <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
                    e.preventDefault()
                    setFilter('batman_mask')
                  }}
                   className={`filter-image  ${filter == 'batman_mask' && 'opacity'}`}
                    height={55} width={55} src='/assets/batmanMaskIcon.png' />,
                    <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
                      e.preventDefault()
                      setFilter('egypt_cat_mask')
                    }}
                     className={`filter-image  ${filter == 'egypt_cat_maskIcon' && 'opacity'}`}
                      height={55} width={55} src='/assets/egypt_cat_maskIcon.png' />
                      ,
                      <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
                        e.preventDefault()
                        setFilter('samurai_mask')
                      }}
                       className={`filter-image  ${filter == 'samurai_mask' && 'opacity'}`}
                        height={55} width={55} src='/assets/samuraMaskIcon.png' />
                        ,
                      <img onDragStart={handleDragStart} role="presentation" onClick={(e) => {
                        e.preventDefault()
                        setFilter('bunnyEars')
                      }}
                       className={`filter-image  ${filter == 'bunnyEars' && 'opacity'}`}
                        height={55} width={55} src='/assets/bunnyEars.png' />
                        


  ] 
  return (
    <div className="App"> 
    
    <input style={{ display: 'none' }} id='filterValue' type="text" value={filter} ref={filterValue} />
   
      {UserVideo}
       <video
        id='tmpVideo'
        className="video userVideo"
        playsInline 
        style={{display:'none'}}
        muted
        ref={tmpUserVideo}
        autoPlay
        delay
      />
        <div id='chooseFilter' onClick={(e) => e.preventDefault()} className={`chooseFilter`}>
            <div style={{ position: 'absolute' }} className={`filter-coursel-cont `}>
              <AliceCarousel onSlideChanged={(e)=>setSlide(e.item)}   keyboardNavigation={true}
              activeIndex={slide}
               renderPrevButton={() => <button style={{ left: "0" }} className='filter-pagination-button'>{'<'}</button>
              } renderNextButton={() => <button style={{ right: "0" }} className='filter-pagination-button'>{'>'}</button>}
                infinite={true} responsive={{
                  0: { items: 3 },
                  368: { items: 4 },
                  568: { items: 6 },
                  1024: { items: 6 },
                }}
                disableDotsControls={true} mouseTracking renderKey={() => <button className='filter-pagination-button'>hello</button>}
                items={filterOptions} />
            </div>

          </div>
      <Filters filter={filter} />
      <style jsx>{`
        iframe{
          display:none !important ;
        }
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
