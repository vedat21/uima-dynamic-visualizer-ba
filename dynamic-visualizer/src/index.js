import React from 'react';
import ReactDOM from 'react-dom/client'


// custom modules
import "./index.css";
import RoutingView from "./components/views/RoutingView";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RoutingView/>
    </React.StrictMode>
);
