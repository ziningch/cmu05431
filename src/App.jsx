import "./App.css"
import sticky from "./assets/sticky.png";
import map from "./assets/map.png";
import connector from "./assets/connector.png";

export default function App() {
  return (
    <div>
      <div className = 'toolbar'>

        {/*drawing the flowchart shape tool*/}
        <svg width = "44" height = "24" viewBox="0 0 44 24">
          <polygon
            points="22,1 43,12 22,23 1,12"
            fill="white"
            stroke="#333333"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>

        {/*drawing the text tool*/}
        <div className = 'tool-text'>T</div>

        {/*drawing the sticky note tool*/}
        <img className="sticky-icon" src={sticky} alt="Image tool" />

        {/*drawing the connector tool*/}
        <img className="connector-icon" src={connector} alt="Image tool" />

        {/*drawing the concept map tool*/}
        <img className="map-icon" src={map} alt="Image tool" />


      </div>
    </div>
  );
}