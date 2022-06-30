import React from 'react';
import ReactDOM from 'react-dom/client'
import "./index.css";


// custom modules
import DocumentWindow from './pages/DocumentWindow';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <DocumentWindow />
    </React.StrictMode>
);
