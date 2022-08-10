import React from 'react';
import ReactDOM from 'react-dom'

// custom modules
import "./index.css";
import RoutingView from "./components/views/RoutingView";
import DropStaticElement from "./components/visualizations/other/DropStaticElement";



ReactDOM.render(
    <React.StrictMode>
        <RoutingView />
    </React.StrictMode>,
    document.getElementById('root')
);