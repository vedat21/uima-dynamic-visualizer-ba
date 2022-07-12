import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


// custom
import PresentationView from "./PresentationView";
import NavigationView from "./NavigationView";


/**
 * Root component for routing. On default renders navigation view.
 * @returns {JSX.Element}
 * @constructor
 */
function RoutingView() {
    return (
        <Router>
            <Routes>
                {/* default render navigation view */}
                <Route exact path="/" element={<NavigationView/>} />

                {/* render presentation view if clicked */}
                <Route exact path="/presentation/:id" element={<PresentationView/>} />
            </Routes>
        </Router>
    );
}

export default RoutingView;


