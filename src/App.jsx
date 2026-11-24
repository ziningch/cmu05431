import "./App.css"
import sticky from "./assets/sticky.png";
import connector from "./assets/connector.png";
import mouse from "./assets/mouse.png";

import {useState, useEffect} from "react";

export default function App() {
  //keep track of which tool is active
  const [activeTool, setActiveTool] = useState(null);

  //keep track of which textbox is selected
  const [boxes, setBoxes] = useState([]);
  const [selectedID, setSelectedID] = useState(null);
  const selected = boxes.find((box) => box.id === selectedID);

  //text can be small, medium, or large
  const sizeOptions = [
    {label: "S", px: 18},
    {label: "M", px: 24},
    {label: "L", px: 30}
  ]

  //focus textbox as soon as it appears on the canvas
  useEffect(() => {
    if (selectedID) document.getElementById(`text-${selectedID}`)?.focus();
  }, [selectedID]);

  //saves users text input in the correct textbox
  function updateText(id, text) {
    setBoxes((prev) => prev.map((box) => (box.id === id ? {...box, text} : box)));
  }

  //change all text in a textbox to bold
  function toggleBold(id) {
    setBoxes((prev) => prev.map((box) => (box.id === id ? {...box, bold: !box.bold} : box)));
  }

  function handleCanvasClicked(event) {
    //remove empty textbox
    const keep = (box) => box.text.trim() !== "";

    if (activeTool === "tool-text") {
      //draw the textbox by getting current bounding rectangle
      const rect = event.currentTarget.getBoundingClientRect();
      const id = Date.now();
      //default is blank text
      setBoxes((prev) => [
        ...prev.filter(keep),
        {id, x : event.clientX - rect.left, y : event.clientY - rect.top, text: "", bold: false},
      ]);
      setSelectedID(id);
      setActiveTool("mouse-icon");
    } else {
      //if we are not using textbox tool just clear the empty textboxes
      setBoxes((prev)=>prev.filter(keep));
      setSelectedID(null);
    }
  }

  return (
    <div>
      {/*Drawing the canvas for the textbox*/}
      <div className = {`canvas ${activeTool === "tool-text" ? "text-mode" : ""}`}
      onClick = {handleCanvasClicked}
      >
       {boxes.map((box) => (
        <div
          //gives unique id to the current object
          key = {box.id}
          id = {`text-${box.id}`}

          //it is always a textbox object and only selected if id matches the current id being selected
          className = {`text-box ${box.id === selectedID ? "selected" : ""}`}

          //let's user edit object
          contentEditable
          suppressContentEditableWarning
          style={{left: box.x, top: box.y, fontWeight: box.bold ? 700:400}}

          //clicking stops event from reaching the canvas which would deselect the textbox
          onClick = {(event) =>{
            event.stopPropagation();
            setSelectedID(box.id);
          }}

          //user's input is saved when they click away
          onBlur = {(event) => updateText(box.id, event.currentTarget.innerText)}
        >
          {box.text}
        </div>
       ))} 

       {/*Draw the bold toggle */}
       {selected && (
        <button
          className= {`bold-button ${selected.bold ? "active" : ""}`}
          style = {{left:selected.x,top:selected.y-44}}
          //Keep textbox focused when bold button is pressed
          onMouseDown={(event)=>event.preventDefault()}
          onClick ={(event)=>{
            event.stopPropagation();
            toggleBold(selected.id);
          }}
        >
          B
        </button>
       )}
      </div>

      <div className = 'toolbar'>
        {/*drawing the mouse tool*/}
        <button
          className ={`tool ${activeTool === "mouse-icon" ? "active" : ""}`}
          onClick={()=>setActiveTool("mouse-icon")}
        >
          <img className= "mouse-icon" src={mouse} alt="mouse tool" />
        </button>
        

        {/*drawing the tool divider*/}
        <div className = 'divider'></div>

        {/*drawing the flowchart shape tool*/}
        <button
          className ={`tool ${activeTool === "flowchart-shape" ? "active" : ""}`}
          onClick={()=>setActiveTool("flowchart-shape")}
        >
          {/*drawing a diamond with svg*/}
          <svg width = "44" height = "44" viewBox="0 0 44 44">
          <polygon
            points="22,11 43,22 22,33 1,22"
            fill="white"
            stroke="#333333"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          </svg>
        </button>


        {/*drawing the text tool*/}
        <button
          className ={`tool ${activeTool === "tool-text" ? "active" : ""}`}
          onClick={()=>setActiveTool("tool-text")}
        >
          <div className = 'tool-text'>T</div>
        </button>      

        {/*drawing the sticky note tool*/}
        <button
          className ={`tool ${activeTool === "sticky-icon" ? "active" : ""}`}
          onClick={()=>setActiveTool("sticky-icon")}
        >
          <img className="sticky-icon" src={sticky} alt="sticky note tool" />
        </button>

        {/*drawing the connector tool*/}
        <button
          className ={`tool ${activeTool === "connector-icon" ? "active" : ""}`}
          onClick={()=>setActiveTool("connector-icon")}
        >
          <img className="connector-icon" src={connector} alt="connector tool" />
        </button>


      </div>
    </div>
  );
}