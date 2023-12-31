
  import React, {useEffect, useState} from 'react';
  import usePanorama from '../utility/usePanorama';

  /*
   This is a reference page for showing Panorama state in real time
  */
  function Panorama() {
    const [panoRef, panoramaState, setPov, setZoom] = usePanorama();
    const [[x, y], setXY] = useState([0,0]);



    const [startPos, setStartPos] = useState(0);
    const [endPos, setEndPos] = useState(0);
    const [startPitch, setStartPitch] = useState(0);
    const [endPitch, setEndPitch] = useState(0);
    const [ratio, setRatio] = useState(0);
    const [sumRatio, setSumRatio] = useState(0);
    const [timesRatio, setTimesRatio] = useState(0);


    function handleKeyDown(event) {
      // looking up/down keys
      if (event.key === 'i') {
        // event.preventDefault();
        // event.stopPropagation();

        setPov( (oldH, oldpP)=>{return {heading: oldH, pitch: oldpP+3}} )

      }
      else if (event.key === 'k') {
        // event.preventDefault();
        // event.stopPropagation();
        setPov( (oldH, oldpP)=>{return {heading: oldH, pitch: oldpP-3}} )
      }
      // zoom keys
      else if (event.key === 'l') {
        // event.preventDefault();
        // event.stopPropagation();
        setZoom( (oldZ)=>{return oldZ+1} )
      }
      else if (event.key === 'j') {
        // event.preventDefault();
        // event.stopPropagation();
        setZoom( (oldZ)=>{return oldZ-1} )
      }
    }



    const handlePageSelect = (e) => {
      setXY([e.clientX, e.clientY]);
    }

    const handlePageClick = (e, x) => {
      setStartPos(e.clientY/window.innerHeight);
      setStartPitch(panoramaState?.pov?.pitch);
    };

    const handlePageUp = (e) => {
      setEndPos(e.clientY/window.innerHeight);
      setEndPitch(panoramaState?.pov?.pitch);
      let r = (startPitch - panoramaState?.pov?.pitch)/(startPos - e.clientY/window.innerHeight);
      setRatio(r);

      setSumRatio((prevState) => prevState + r);
      setTimesRatio((prevState) => prevState + 1);


      //Calculate Y

      console.log(startPos - (startPitch - panoramaState?.pov?.pitch)*
          (startPos - e.clientY)/(startPitch - panoramaState?.pov?.pitch))

      //console.log("Y ratio:");
      //console.log(e.clientY/window.innerHeight);

      //calc ourY:
      let managerRatio = 0.7466666666666667;
      let managerPitch = 10.737394195575263;

      console.log("ourY:");
      let ourY = managerRatio*window.innerHeight + (panoramaState?.pov?.pitch - managerPitch)/r;
      console.log(managerRatio*window.innerHeight + (panoramaState?.pov?.pitch - managerPitch)/r);

      console.log("avg ratio:");
      console.log(sumRatio/timesRatio);
      console.log("our avg y:");
      console.log(managerRatio*window.innerHeight + (panoramaState?.pov?.pitch - managerPitch)/(sumRatio/timesRatio));


    };



    /*
        const handlePageSelect = (e) => {
            setXY([e.clientX, e.clientY]);
        }

        const handlePageClick = (e) => {
            setStartPos(e.clientY);
            setStartPitch(panoramaState?.pov?.pitch);
        };

        const handlePageUp = (e) => {
            const endOfPitch = panoramaState?.pov?.pitch;
            setEndPos(e.clientY);
            setEndPitch(endOfPitch);
            setRatio((startPos - e.clientY)/(startPitch - panoramaState?.pov?.pitch));
            //console.log(startPos - (startPitch - panoramaState?.pov?.pitch)*
               // (startPos - e.clientY)/(startPitch - panoramaState?.pov?.pitch))


            const pitchZone = 42;
            const pitchStart = 31.5;
            const ourRatio = (pitchStart + endOfPitch)/pitchZone;
            console.log('Horizontal Scroll Position: ' + window.scrollY);

            console.log("ratio:" + ourRatio);
            console.log(400*ourRatio+230);

            const leftHeading = 38.50923839733043;
            const rightHeading = 308.2589123218176;

            let heading = panoramaState?.pov?.heading;

            let headingInterval = leftHeading - rightHeading;
            let deg =  heading - rightHeading;

            //Going throw 360deg edge case.
            if(rightHeading > leftHeading)
            {
                headingInterval = (360 - rightHeading) + leftHeading;
                if(heading < rightHeading) {
                    deg = (360 - rightHeading) + heading;
                }
            }

            let xRatio = deg / headingInterval;
            console.log("deg is: " + deg);
            console.log("heading interval is: " + headingInterval);
            console.log("deg is: " + xRatio);


            // TODO:: need to retrieve according to panoramaMap location.
            const windowLeft = 0;
            const windowRight = 1023;
            console.log((windowRight - windowLeft) * xRatio );

            let objectXposition = windowRight - (windowRight - windowLeft) * xRatio + windowLeft;

            console.log("x position of object is: " + objectXposition);


        };

    */


    //
    // //TODO: for some reason this doesn't work very well in PanoramaMap.js
    // useEffect(() => {
    //   // only 0.6,1,2 zoom levels are allowed
    //   if (setZoom && panoramaState.zoom) {
    //     // console.log(panoramaState.zoom);
    //     setZoom((oldZ) => {
    //       return panoramaState.zoom;
    //     });
    //
    //   }
    // }, [panoramaState.zoom]);


    // try adding more panorama windows
    return (
        <div className="absolute w-full h-full -z-10" >
          <div className="absolute w-full h-full -z-10"><div ref={panoRef} onKeyDown={handleKeyDown} onMouseDown={handlePageClick} onMouseMove={handlePageSelect}
                                                             onMouseUp = {handlePageUp} if="pano"
                                                             style={{ height: "100%", width: "100%" }}></div></div>
          <div id="floating-panel" style={{width: "70%"}}>
            <table>
              <tbody>
              <tr>
                <td><b>Position</b></td>
                <td id="position-cell">{JSON.stringify(panoramaState?.position)}</td>
              </tr>
              <tr>
                <td><b>POV Heading</b></td>
                <td id="heading-cell">{panoramaState.pov?.heading}</td>
              </tr>
              <tr>
                <td><b>POV Pitch</b></td>
                <td id="pitch-cell">{panoramaState.pov?.pitch}</td>
              </tr>
              <tr>
                <td><b>Pano ID</b></td>
                <td id="pano-cell">{panoramaState.id}</td>
              </tr>
              <tr>
                <td><b>Zoom</b></td>
                <td id="zoom-cell">{panoramaState.zoom}</td>
              </tr>
              <tr>
                <td><b>Screen pixels</b></td>
                <td id="x-y">x: {x}, y: {y}, inner width: {window.innerHeight / 9.3}</td>
              </tr>
              <tr>
                <td><b>Screen size</b></td>
                <td id="size">inner width: {window.innerWidth}, inner height: {window.innerHeight}</td>
              </tr>
              {/*<tr>
                <td><b>Calc ratio:</b></td>
                <td id="x-y">y to pitch: {startPos}, {endPos}, {startPitch}, {endPitch}, ratio {ratio} </td>
              </tr>*/}
              </tbody>
            </table>
          </div>
          {/* <Streetview apiKey="AIzaSyD4J0LPRji3WKllVxLji7YDbd5LSt6HA7o"></Streetview> */}


          {/* <Map /> */}
        </div>
    );
  }

  export default Panorama;



