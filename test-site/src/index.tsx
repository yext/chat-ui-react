import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);

// //For testing purposes -- React 16/17
// import { render } from 'react-dom';
// import App from "./App";
// import "./index.css";

// const container = document.getElementById('root');
// render(<App />, container);
