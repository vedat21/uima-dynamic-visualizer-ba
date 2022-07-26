import React from 'react';
import ReactDOM from 'react-dom'

// custom modules
import "./index.css";
import RoutingView from "./components/views/RoutingView";
import Dropzone from "./components/views/Dropzone";



ReactDOM.render(
    <React.StrictMode>
        <RoutingView />
    </React.StrictMode>,
    document.getElementById('root')
);