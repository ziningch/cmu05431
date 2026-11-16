import "./App.css"
import sticky from "./assets/sticky.png";
import map from "./assets/map.png";
import connector from "./assets/connector.png";
import mouse from "./assets/mouse.png";

import { useActionState, useState } from "react";

export default function App() {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <div>
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

        {/*drawing the concept map tool*/}
        <button
          className ={`tool ${activeTool === "map-icon" ? "active" : ""}`}
          onClick={()=>setActiveTool("map-icon")}
        >
          <img className="map-icon" src={map} alt="concept map tool" />
        </button>


      </div>
    </div>
  );
}