import React, { useEffect, useState } from "react";
import "../styles/LabelSelector.css";
import { setObjectData } from "../utility/LabelSelectorHelpers";
import useLabelSelector from "../utility/useLabelSelector";

function ManagerLabelSelector(props) {
  //States for manager Case.
  const customHookProps = {
    ctrlPressed: props.ctrlPressed,
    getData: true,
    panoramaState: props.panoramaState,
    setZoom: props.setZoom,
  };

  const {
    animationActive,
    lables,
    lablesSize,
    flicker,
    objectDataArray,
    setObjectDataArray,
    startAnimation,
    handlePageClick,
    handlePageSelect,
    handlePageFinish,
  } = useLabelSelector(customHookProps);

  //Managers "Add data" button was clicked.
  const handleAddDataClick = () => {
    if (objectDataArray.length > 0) {
      setObjectData(objectDataArray);
      setObjectDataArray([]);
    }
  };

  const handleRemoveButton = (all) => {
    if (objectDataArray.length > 0) {
      if (all) {
        setObjectDataArray([]);
      } else {
        setObjectDataArray(objectDataArray.slice(0, -1));
      }
    }
  };

  const [openRemoveWindow, setOpenRemoveWindow] = useState(false);
  const handleRemoveWindowSize = () => {
    if (!openRemoveWindow) {
      setOpenRemoveWindow(true);
    } else {
      setOpenRemoveWindow(false);
    }
  };

  // make sure doesn't clash with clues
  // handle ctrl+tab edge case
  return (
    <>
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
              flicker === "orange"
                ? "rgba(250,160,68,0.63)"
                : "rgba(253, 253, 253, 0.5)",
          }}
        ></div>
      </div>

      <div className="fixed top-0 left-0 flex w-64 flex-col items-center text-center text-white select-none">
        <div className="w-full py-2 bg-slate-600/80 rounded-t-lg">
          number of labels: {objectDataArray.length}
        </div>

        <div
          className={`${
            openRemoveWindow ? "visible" : "hidden"
          } w-full flex flex-col items-center bg-slate-400/75`}
        >
          <div className="my-8">
            {objectDataArray.length > 0 ? (
              <ul className="list-none">
                <li className="p-4">last object labeled</li>
                <li>lat: {objectDataArray[objectDataArray.length - 1].lat}</li>
                <li>lng: {objectDataArray[objectDataArray.length - 1].lng}</li>
                <li>
                  zoom:{" "}
                  {Math.round(objectDataArray[objectDataArray.length - 1].zoom)}
                </li>
              </ul>
            ) : (
              "none"
            )}
          </div>

          <button
            className="my-4 removeButton w-1/2 p-2
                                       select-none bg-indigo-500 rounded-full hover:bg-sky-700"
            onClick={() => {
              handleRemoveButton(false);
            }}
          >
            remove last
          </button>

          <button
            className="my-4 removeButton w-1/2 p-2
                                       select-none bg-indigo-500 rounded-full hover:bg-sky-700"
            onClick={() => {
              handleRemoveButton(true);
            }}
          >
            remove all
          </button>
        </div>

        <button
          className="w-full bg-slate-400/75 text-2xl select-none
                                   font-bold rounded-b-lg hover:text-black"
          onClick={handleRemoveWindowSize}
        >
          ≡
        </button>
      </div>

      <button
        className="addButton select-none"
        style={
          objectDataArray.length > 0
            ? { background: "limegreen" }
            : {
                background: "darkgreen",
                color: "black",
                opacity: 1,
                cursor: "default",
              }
        }
        onClick={handleAddDataClick}
      >
        Add Data
      </button>

      <button className="labelButton select-none" onClick={startAnimation}>
        [ ]
      </button>
    </>
  );
}

export default ManagerLabelSelector;
