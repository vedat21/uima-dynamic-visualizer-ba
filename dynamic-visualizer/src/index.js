import React from 'react';
import ReactDOM from 'react-dom'

// custom modules
import "./index.css";
import RoutingView from "./views/RoutingView";
import TextHighlighted from "./components/visualizations/text/TextHighlighted";

ReactDOM.render(
    <React.StrictMode>
      <RoutingView/>
    </React.StrictMode>,
    document.getElementById('root')
);
