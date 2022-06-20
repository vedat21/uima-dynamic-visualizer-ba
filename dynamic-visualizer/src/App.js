import React, {useState} from 'react';

// custom modules
import "./index.css";
import TopBar from "./components/generic_components/TopBar";
import VisualizationLayer from "./components/VisualizationLayer";
import {colorHexcode} from "./helper/colorHexcode"

//j
// globale variable um bei änderungen des layouts nicht alles neu zu rerendern sondern nur einspeichern.
// wird dann gespeichert nach dem editieren vorbei ist.
window.$localVisualizationLayout = [];

function App() {

    // pseudo global state
    const [editable, setEditable] = useState(true); // bestimmt ob dokumente editierbar sind oder nicht
    const [bodyData, setBodyData] = useState([]); // definiert welche visualisierungskomponenten angezeigt werden
    const [layout, setLayout] = useState([])

    // Farbe von Hintergrund setzten
    document.body.style.background = colorHexcode.secondary;


    const saveLayout = () => {
        setLayout(window.$localVisualizationLayout);
    }

    /**
     * called when edit button is pressed.
     */
    const reverseEditable = () => {
        saveLayout();
        setEditable(!editable);
    }

    return (
        <div>
            <TopBar
                key="topbar"
                editable={editable} reverseEditable={reverseEditable}
                bodyData={bodyData} setBodyData={setBodyData}
                saveLayout={saveLayout}
            />
            <VisualizationLayer
                key="vislayer"
                editable={editable}
                bodyData={bodyData}
                layout={layout}
            />
        </div>
    )
}

export default App;