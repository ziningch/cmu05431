import "./App.css"
import sticky from "./assets/sticky.png";
import connector from "./assets/connector.png";
import mouse from "./assets/mouse.png";

import {useState, useEffect, useRef} from "react";

export default function App() {
  //keep track of which tool is active
  const [activeTool, setActiveTool] = useState(null);

  //keep track of which textbox is selected
  const [boxes, setBoxes] = useState([]);
  const [selectedID, setSelectedID] = useState(null);
  const selected = boxes.find((box) => box.id === selectedID);

  //determine whether the current selected component is textbox
  const selectedText = selected?.type === "text";

  //whether the size popup is showing
  const [sizeMenuOpen, setSizeMenuOpen] = useState(false);

  //keep track of sticky menu visibility and current sticky color
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [stickyColor, setStickyColor] = useState(null);

  //keep track of cursor position so a tiny square representing the sticky can fall under it
  const [cursurPos, setCursorPos] = useState(null);

  //text can be small, medium, or large, this is the literal for representing each pixel size
  const sizeOptions = [
    {label: "S", px: 18},
    {label: "M", px: 24},
    {label: "L", px: 30}
  ];

  //stickies can be pink, yellow, blue, green, and purple
  const stickyColors = [
    {name: "pink", hex: "#F9A8C9"},
    {name: "yellow", hex: "#FFE680"},
    {name: "blue", hex: "#9CCBF5"},
    {name: "green", hex: "#A8E0A0"},
    {name: "purple", hex: "#C9AEF0"}
  ];

  //representing the textbox corners
  const CORNERS = ["nw", "ne", "sw", "se"];

  //minimum resizing size for textbox
  const minWidth = 60;
  const minHeight = 40;

  //minimum size for sticky note
  const stickyMin = 120;

  //mouse tool is active when it's picked or before anything else is picked
  const mouseActive = (activeTool === null || activeTool === "mouse-icon");

  //keep track of current move or resize
  const dragReference = useRef(null);

  //ignores double clicking right after drag
  const justDraggedRef = useRef(false);

  //listens for mouse dragging and releasing anywhere on canvas
  useEffect(() => {

    function handleMouseMove(event) {
      const drag = dragReference.current;
      if (!drag) return;

      //determining if it's just a slight movement or an actual click
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.abs(dx) + Math.abs(dy) >  3) drag.moved = true;

      setBoxes((prev) => prev.map((box) => {
        if (box.id !== drag.id) return box;

        //move textbox to mouse if cursor is on edge of textbox
        if (drag.mode === "move") {
          return {...box, x: drag.startBox.x+dx, y: drag.startBox.y+dy};
        }

        //if dragging the corners, resize according to dragged corner and fix the diagonal corner
        const start = drag.startBox;
        let {x,y,width,height} = start;

        if (drag.corner.includes("e")) width = Math.max(drag.minW,start.width+dx);
        if (drag.corner.includes("s")) height = Math.max(drag.minH,start.height+dy);
        if (drag.corner.includes("w")) {
          width = Math.max(drag.minW,start.width-dx);
          x = start.x+start.width-width;
        }
        if (drag.corner.includes("n")) {
          height = Math.max(drag.minH,start.height-dy);
          y = start.y+start.height-height;
        }

        return {...box,x,y,width,height};
      }));
    }
    
    function handleMouseUp() {
      const drag = dragReference.current;
      if (!drag) return;

      //pressing the upper right corner without dragging will delete the textbox
      if (drag.corner === "ne" && !drag.moved) {
        setBoxes((prev) => prev.filter((box) => box.id !== drag.id));
        setSelectedID(null);
        setSizeMenuOpen(false);
      }

      dragReference.current = null;
      justDraggedRef.current = true;
      setTimeout(()=> {justDraggedRef.current = false;}, 0);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  //focus textbox as soon as it appears on the canvas
  useEffect(() => {
    if (selectedID) document.getElementById(`text-${selectedID}`)?.focus();
  }, [selectedID]);

  function chooseTool(tool) {
    setActiveTool(tool);
    if (tool !== "sticky-icon") {
      setColorMenuOpen(false);
    }
  }

  //tracks the beginning of moving/resizing through drag
  function startDrag(event, box, mode, corner) {
    //stop highlighting/changing text, keep textbox selected
    event.preventDefault();
    event.stopPropagation();
    setSelectedID(box.id);
    setSizeMenuOpen(false);
    
    dragReference.current = {
      id: box.id,
      mode,
      corner,
      startX: event.clientX,
      startY: event.clientY,
      startBox: {x: box.x, y: box.y, width: box.width, height: box.height},
      minW: box.type === "sticky" ? stickyMin : minWidth,
      minH: box.type === "sticky" ? stickyMin : minHeight,
      moved: false
    };
  }

  //saves users text input in the correct textbox
  function updateText(id, text) {
    setBoxes((prev) => prev.map((box) => (box.id === id ? {...box, text} : box)));
  }

  //change all text in a textbox to bold
  function toggleBold(id) {
    setBoxes((prev) => prev.map((box) => (box.id === id ? {...box, bold: !box.bold} : box)));
  }

  //set size of given textbox and close popup
  function changeSize(id, fontSize) {
    setBoxes((prev) => prev.map((box) => (box.id === id ? {...box,fontSize} : box)));
    setSizeMenuOpen(false);
  }

  function handleCanvasClicked(event) {
    //ignores click right after dragging
    if (justDraggedRef.current) return;
    
    setSizeMenuOpen(false);

    if (colorMenuOpen) {
      setColorMenuOpen(false);
      return;
    }

    //remove empty textbox
    const keep = (box) => box.type === "sticky" || box.text.trim() !== "";

    if (activeTool === "tool-text") {
      //draw the textbox by getting current bounding rectangle
      const rect = event.currentTarget.getBoundingClientRect();
      const id = Date.now();

      //default is blank text
      setBoxes((prev) => [
        ...prev.filter(keep),
        {
          id,
          type: "text",
          x : event.clientX - rect.left,
          y : event.clientY - rect.top,
          width: 180,
          height: 56,
          text: "",
          bold: false,
          fontSize: 24
        },
      ]);
      setSelectedID(id);
      setActiveTool("mouse-icon");
    } else if (activeTool === "sticky-icon" && stickyColor) {
      //places sticky aligned with the cursor with the picked color
      const rect = event.currentTarget.getBoundingClientRect();
      const id = Date.now();

      setBoxes((prev) => [
        ...prev.filter(keep), {
          id,
          type: "sticky",
          x : event.clientX - rect.left,
          y : event.clientY - rect.top,
          width: 160,
          height: 160,
          text: "",
          color: stickyColor
        }
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
      {/*Drawing the canvas for the textbox and stickies*/}
      <div className = {`canvas ${activeTool === "tool-text" ? "text-mode" : ""}`}
      //keep mouse shape and keep track of its position
      onMouseMove={(event) => setCursorPos({x: event.clientX, y: event.clientY})}
      onMouseLeave={()=>setCursorPos(null)}
      onClick = {handleCanvasClicked}
      >
       {boxes.map((box) => (
        <div
          //gives unique id to the current object
          key = {box.id}
          className = {`text-wrap ${box.type === "sticky" ? "sticky" : ""} ${box.id === selectedID ? "selected" : ""} ${mouseActive ? "movable" : ""}`}
          style={{
            left: box.x,
            top: box.y,
            width: box.width,
            minHeight: box.height,
            backgroundColor: box.type === "sticky" ? box.color : undefined
          }}

          //pressing the edge moves the textbox
          onMouseDown={(event) => {
            if (mouseActive && event.target === event.currentTarget) {
              startDrag(event,box,"move");
            }
          }}

          //clicking stops event from reaching the canvas which would deselect the textbox
          onClick = {(event) =>{
            event.stopPropagation();
            if (justDraggedRef.current) return;
            setSelectedID(box.id);
            setSizeMenuOpen(false);
          }}
        >
          {/*where the user types text*/}
          <div
            id = {`text-${box.id}`}
            className = "text-box"

            //let's user edit object
            contentEditable
            suppressContentEditableWarning
            style = {{fontWeight:box.bold ? 700 : 400, fontSize: box.type === "sticky" ? 20 : box.fontSize}}

            //saves user input when they click away
            onBlur = {(event) => updateText(box.id,event.currentTarget.innerText)}
          >
          {box.text}
          </div>

          {/*corner handles, visible when using mouse tool */}
          {box.id === selectedID && mouseActive && CORNERS.map((corner) => (
            <div
              key = {corner}
              className = {`handle ${corner}`}
              onMouseDown= {(event) => startDrag(event,box,"resize",corner)}
            >
              {corner === "ne" && "x"}
            </div>
          ))}
       </div>
       ))} 

       {/*Draw the bold toggle */}
       {selectedText && (
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

       {/*Draw the size button*/}
       {selectedText && (
        <button
          className= "size-button"
          style = {{left:selected.x+40,top:selected.y-44}}

          onMouseDown={(event)=>event.preventDefault()}

          //when clicked, stop event from reaching the canvas and flip the state of whether the menu is open
          onClick ={(event)=>{
            event.stopPropagation();
            setSizeMenuOpen(!sizeMenuOpen);
          }}
        >
          {/*Draw size label according to current selected textbox's font size*/}
          {sizeOptions.find((option)=>option.px === selected.fontSize)?.label}
        </button>
       )}

       {/*Draw the size popup which closes as soon as a size is picked*/}
       {selectedText && sizeMenuOpen && (
        <div
          className= "size-menu"
          style = {{left:selected.x+40,top:selected.y-84}}
        >
          {sizeOptions.map((option) => (
            <button
              key = {option.label}
              className = {`size-option ${selected.fontSize === option.px ? "active" : ""}`}
              onMouseDown = {(event) => event.preventDefault()}

              //when the size popup button is clicked, change size accordingly
              onClick = {(event) => {
                event.stopPropagation()
                changeSize(selected.id, option.px);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
       )}
      </div>

      <div className = 'toolbar'>
        {/*drawing the mouse tool*/}
        <button
          className ={`tool ${activeTool === "mouse-icon" ? "active" : ""}`}
          onClick={()=>chooseTool("mouse-icon")}
        >
          <img className= "mouse-icon" src={mouse} alt="mouse tool" />
        </button>
        

        {/*drawing the tool divider*/}
        <div className = 'divider'></div>

        {/*drawing the flowchart shape tool*/}
        <button
          className ={`tool ${activeTool === "flowchart-shape" ? "active" : ""}`}
          onClick={()=>chooseTool("flowchart-shape")}
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
          onClick={()=>chooseTool("tool-text")}
        >
          <div className = 'tool-text'>T</div>
        </button>      

        {/*drawing the sticky note tool, with its color popup centered above it*/}
        <div className = "sticky-wrap">
          <button
            className ={`tool ${activeTool === "sticky-icon" ? "active" : ""}`}
            onClick={()=>{
              setActiveTool("sticky-icon");
              setColorMenuOpen(true);
            }}
          >
            <img className="sticky-icon" src={sticky} alt="sticky note tool" />
          </button>

          {/*Draw the popup menu for choosing sticky note's color */}
          {colorMenuOpen && (
            <div className = "color-menu">
              {stickyColors.map((color) => (
                <button
                  key = {color.name}
                  className = {`color-swatch ${stickyColor === color.hex ? "active" : ""}`}
                  style = {{backgroundColor: color.hex}}
                  aria-label = {`${color.name} sticky note`}
                  onClick = {() => {
                    setStickyColor(color.hex);
                    setColorMenuOpen(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/*drawing the connector tool*/}
        <button
          className ={`tool ${activeTool === "connector-icon" ? "active" : ""}`}
          onClick={()=>chooseTool("connector-icon")}
        >
          <img className="connector-icon" src={connector} alt="connector tool" />
        </button>

      </div>

      {/*Draw picked color square under cursor */}
      {activeTool === "sticky-icon" && stickyColor && cursurPos && !colorMenuOpen && (
        <div
          className = "sticky-cursor"
          style = {{left: cursurPos.x+2, top: cursurPos.y+22, backgroundColor: stickyColor}}
        />
      )}
    </div>
  );
}