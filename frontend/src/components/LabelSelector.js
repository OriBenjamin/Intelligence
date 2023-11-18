import React, { useEffect, useState } from "react";
import "../styles/LabelSelector.css";
import {
  setObjectData,
  objectPositionOnScreen,
  closest,
} from "../utility/LabelSelectorHelpers";
import useLabelSelector from "../utility/useLabelSelector";
import { twMerge } from "tailwind-merge";

/*
    An upgraded LabelObject component, with darkening animation and a resizable label.
*/
function LabelSelector(props) {
  const customHookProps = {
    ctrlPressed: props.ctrlPressed,
    getData: false,
    panoramaState: props.panoramaState,
    setZoom: props.setZoom,
  }

  const {
    animationActive,
    lables,
    lablesSize,
    flicker,
    startAnimation,
    handlePageClick,
    handlePageSelect,
    handlePageFinish
  } = useLabelSelector(customHookProps);

  const [[widthSize, heightSize], setWH] = useState([0, 0]);
  const panoramaState = props.panoramaState;

  //TODO:: can be removed later.
  const [[xTrack, yTrack], setTrack] = useState([0, 0]);

  /*
    //TODO:: when removing the debugging squares add if labelSize != [0, 0] and can even remove.

      The function receives event of mouseUp.
      Returns true if object was labeled, else false.
 */
  const wasDetected = (e) => {
    const lat = Math.floor(panoramaState?.position?.lat() * 1e12) / 1e12;
    const lng = Math.floor(panoramaState?.position?.lng() * 1e12) / 1e12;
    const currentZoom = closest(panoramaState.zoom);

    let data = props.data.filter((d) => {
      return (
          parseFloat(d.lat) === lat &&
          parseFloat(d.lng) === lng &&
          d.zoom === parseFloat(currentZoom)
      )
    });

    //Position is wrong.
    if(data.length <= 0){
      return false;
    }

    const objectData = data[0];
    const [objectXposition, objectYposition] = objectPositionOnScreen(
      e,
      panoramaState,
      objectData
    );

    const xEndPos = e.clientX;
    const yEndPos = e.clientY;

    setTrack([objectXposition, objectYposition]);

    const wSize = (objectData.labelW)*window.innerWidth/2;
    const hSize = (objectData.labelH)*window.innerHeight/2;

    //TODO:: can remove when removing green and red squares.
    setWH([wSize, hSize]);

    const squareStartX = objectXposition - wSize / 2;
    const squareEndX = objectXposition + wSize / 2;

    const squareStartY = objectYposition - hSize / 2;
    const squareEndY = objectYposition + hSize / 2;

    //TODO:: change to be relative to window size & zoom.
    const Ydelta = hSize/2 + 120;
    const Xdelta = wSize/2 + 120;
    const outSquare =
      lables[1] >= squareStartY - Ydelta && yEndPos <= squareEndY + Ydelta &&
      lables[0] >= squareStartX - Xdelta && xEndPos <= squareEndX + Xdelta;

    const inSquare =
      lables[1] <= squareStartY && yEndPos >= squareEndY &&
      lables[0] <= squareStartX && xEndPos >= squareEndX;

    return outSquare && inSquare;
  };

  const handleMouseUp = (e) =>{
    handlePageFinish(e, wasDetected(e));
  }

  // make sure doesn't clash with clues
  // handle ctrl+tab edge case
  return (
    <>
      <div
        className="select-none"
        style={{
          background: "rgba(220,55,55,0.5)",
          position: "absolute",
          top: yTrack - heightSize / 2,
          left:
            xTrack - widthSize / 2,
          width: widthSize,
          height: heightSize,
        }}
      ></div>
      <div
        className="select-none"
        style={{
          background: "rgba(31,71,27,0.5)",
          position: "absolute",
          top:
            yTrack -
              heightSize -
            120,
          left:
            xTrack -
              widthSize -
            120,
          width: (widthSize + 120)*2,
          height: (heightSize + 120)*2,
        }}
      ></div>
      <div
        className="select-none"
        style={{
          background: "rgba(0,0,0)",
          position: "absolute",
          top: yTrack,
          left: xTrack,
          color: "green",
        }}
      >
        +
      </div>

      <div
        className={twMerge(
          animationActive ? "animate-fade-in" : "hidden",
        "w-full h-full hole bg-black/30 cursor-crosshair")}
        onMouseDown={handlePageClick}
        onMouseMove={handlePageSelect}
        onMouseUp={handleMouseUp}
      >
        <div
          className="labelDiv"
          style={{
            top: lables[1],
            left: lables[0],
            width: lablesSize[0],
            height: lablesSize[1],
            backgroundColor:
              flicker === "red"
                ? "rgba(204, 17, 17, 0.5)"
                : flicker === "green"
                ? "rgba(17, 204, 76, 0.5)"
                : "rgba(253, 253, 253, 0.5)",
          }}
        ></div>
      </div>

      <button className="labelButton select-none" onClick={startAnimation}>
        [ ]
      </button>
    </>
  );
}

export default LabelSelector;

//Older working version of label selector.
/*
function LabelSelector(props) {
  const [animationActive, setAnimationActive] = useState(false);

  //Using ctrlPressed prop to know if ctrl was clicked.
  const ctrlPressed = props.ctrlPressed;

  useEffect(() => {
    if (ctrlPressed) {
      setAnimationActive(true);
      zoomTo1();
    }
    if (!ctrlPressed) {
      setAnimationActive(false);
    }

    //Cleanup function
    return () => {};
  }, [ctrlPressed]);

  const [lables, setLablePosition] = useState([0, 0]);
  const [lablesSize, setLableSize] = useState([0, 0]);
  const [mouseDown, setMouseDown] = useState(false);
  const [flicker, setFlicker] = useState("none");
  const [[widthSize, heightSize], setWH] = useState([0, 0]);

  const handlePageClick = (e) => {
    if (animationActive) {
      setLablePosition([e.clientX, e.clientY]);
      setMouseDown(true);
    }
  };
  // allow the user to select upwords
  const handlePageSelect = (e) => {
    if (mouseDown && flicker === "none") {
      //console.log([e.clientX, e.clientY]);
      setLableSize([e.clientX - lables[0], e.clientY - lables[1]]);
    }
  };

  // Checking if the object was labeled.
  const panoramaState = props.panoramaState;
  const [[xTrack, yTrack], setTrack] = useState([0, 0]);

  // TODO: fix bug - doesn't go all the way to 1.
  const zoomTo1 = () => {
    if (props.setZoom && panoramaState.zoom && panoramaState.zoom < 1) {
      // console.log(panoramaState.zoom);

      const timer = setInterval(() => {
        props.setZoom((oldZ) => {
          return oldZ + 0.1;
        });
      }, 10);
      // stop after got to 1
      const stopTime = (1 - panoramaState.zoom) * 100;
      setTimeout(() => {
        clearInterval(timer);
      }, stopTime);
    }
  }

  const startAnimation = () => {
    if (!animationActive) {
      setAnimationActive(true);
      zoomTo1();
    }
  };

/*
      The function receives event of mouseUp.
      Returns true if object was labeled, else false.
 *//*
  const wasDetected = (e) => {

    const lat = Math.floor(panoramaState?.position?.lat() * 1e12) / 1e12;
    const lng = Math.floor(panoramaState?.position?.lng() * 1e12) / 1e12;
    const currentZoom = closest(panoramaState.zoom);

    let data = props.data.filter((d) => {
      return (
          parseFloat(d.lat) === lat &&
          parseFloat(d.lng) === lng &&
          d.zoom === parseFloat(currentZoom)
      )
    });

    //Position is wrong.
    if(data.length <= 0){
      return false;
    }

    const objectData = data[0];
    const [objectXposition, objectYposition] = objectPositionOnScreen(
      e,
      panoramaState,
      objectData
    );

    const xEndPos = e.clientX;
    const yEndPos = e.clientY;

    setTrack([objectXposition, objectYposition]);

    const wSize = (objectData.labelW)*window.innerWidth;
    const hSize = (objectData.labelH)*window.innerHeight;

    //TODO:: can remove when removing green and red squares.
    setWH([wSize, hSize]);

    const squareStartX = objectXposition - wSize / 2;
    const squareEndX = objectXposition + wSize / 2;

    const squareStartY = objectYposition - hSize / 2;
    const squareEndY = objectYposition + hSize / 2;

    //TODO:: change to be relative to window size & zoom.
    const delta = 120;
    const outSquare =
      lables[1] >= squareStartY - delta && yEndPos <= squareEndY + delta &&
      lables[0] >= squareStartX - delta && xEndPos <= squareEndX + delta;

    const inSquare =
      lables[1] <= squareStartY && yEndPos >= squareEndY &&
      lables[0] <= squareStartX && xEndPos >= squareEndX;

    return outSquare && inSquare;
  };

  //States for manager Case.
  const [sendData, setSendData] = useState(false);
  const [objectDataArray, setObjectDataArray] = useState([]);
  const handlePageFinish = (e) => {
    if (mouseDown) {
      // flicker animation
      if (props.isManager) {
        // Manager sets object data.
        objectDataArray.push(getObjectData(e, panoramaState, lables))
        setObjectDataArray(objectDataArray);
        setFlicker("orange");
        if(!sendData) {
          setSendData(true);
        }
      }
      else if (wasDetected(e)) {
        // player found the object
        setFlicker("green");
      }
      else {
        setFlicker("red");
      }

      setTimeout(() => {
        setFlicker("none");
        setMouseDown(false);
        setAnimationActive(false);
        setLablePosition([0, 0]);
        setLableSize([0, 0]);
      }, 200);
    }
  };

  //Managers "Add data" button was clicked.
  const handleAddDataClick = () => {
    if(sendData) {
      setObjectData(objectDataArray);
      setObjectDataArray([]);
      setSendData(false);
    }
  }

  // make sure doesn't clash with clues
  // handle ctrl+tab edge case
  return (
    <>
      <div
        className="select-none"
        onMouseDown={(e) => {
          wasDetected(e);
        }}
        style={{
          background: "rgba(220,55,55,0.5)",
          position: "absolute",
          top: yTrack - heightSize / 2,
          left:
            xTrack - widthSize / 2,
          width: widthSize,
          height: heightSize,
        }}
      ></div>
      <div
        className="select-none"
        onMouseDown={(e) => {
          wasDetected(e);
        }}
        style={{
          background: "rgba(31,71,27,0.5)",
          position: "absolute",
          top:
            yTrack -
              heightSize / 2 -
            60,
          left:
            xTrack -
              widthSize / 2 -
            60,
          width: widthSize + 120,
          height: heightSize + 120,
        }}
      ></div>
      <div
        className="select-none"
        onMouseDown={(e) => {
          wasDetected(e);
        }}
        style={{
          background: "rgba(0,0,0)",
          position: "absolute",
          top: yTrack,
          left: xTrack,
          color: "green",
        }}
      >
        +
      </div>

      <div
        className={`${
          animationActive ? "animate-fade-in" : "hidden"
        } w-full h-full hole bg-black/30 cursor-crosshair`}
        onMouseDown={handlePageClick}
        onMouseMove={handlePageSelect}
        onMouseUp={handlePageFinish}
      >
        <div
          className="labelDiv"
          style={{
            top: lables[1],
            left: lables[0],
            width: lablesSize[0],
            height: lablesSize[1],
            backgroundColor:
              flicker === "red"
                ? "rgba(204, 17, 17, 0.5)"
                : flicker === "green"
                ? "rgba(17, 204, 76, 0.5)"
                : flicker === "orange"
                ? "rgba(250,160,68,0.63)"
                : "rgba(253, 253, 253, 0.5)",
          }}
        ></div>
      </div>

      {
        props.isManager &&
        <button className="addButton select-none"
                style={sendData ?
                      {background: "limegreen"} :
                      {background: "darkgreen", color: "black", opacity: 1, cursor: "default"}}
                onClick={handleAddDataClick}>
          Add Data
        </button>
      }

      <button className="labelButton select-none" onClick={startAnimation}>
        [ ]
      </button>
    </>
  );
}
*/
