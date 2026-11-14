import "./App.css"
import sticky from "./assets/sticky.png";

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
        {/*drawing the sticky note tool*/}
        <img className="tool-icon" src={sticky} alt="Image tool" />
        {/*drawing the text tool*/}
        <div className = 'tool-text'>T</div>
      </div>
    </div>
  );
}