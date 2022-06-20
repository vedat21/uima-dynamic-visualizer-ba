import React from 'react';
import ReactDOM from 'react-dom/client';

// custom modules
import App from './App';
import HomeWindow from "./HomeWindow";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
