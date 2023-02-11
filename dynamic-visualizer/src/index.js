import React from 'react';
import ReactDOM from 'react-dom'

// custom modules
import "./index.css";
import RoutingView from "./views/RoutingView";

ReactDOM.render(
    <React.StrictMode>
      <RoutingView/>
    </React.StrictMode>,
    document.getElementById('root')
);
