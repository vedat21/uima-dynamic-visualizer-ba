import React, {useState} from 'react';
import {v4 as uuid} from 'uuid';

// custom modules
import TopBar from "./components/generic_components/TopBar";
import VisualizationLayer from "./components/VisualizationLayer";
import {colorHexcode} from "./helper/colorHexcode"



function DocumentWindow() {


    // enables/disables editing of layout
    const [editable, setEditable] = useState(true);
    // defines the components that are visualized in visualization layer
    const [bodyData, setBodyData] = useState([]);
    // saves the layout of visualization layer
    const [layout, setLayout] = useState([])

    // set background color of webpage
    document.body.style.background = colorHexcode.secondary;


    /**
     * Falls bei einer Komponenten der entfernen button gedrückt wird. Dann Komponente aus bodyData entfernen.
     * @param e
     */
    function onDeleteComponentClicked(e) {
        saveLayout();

        // id of clicked component
        const id = e.currentTarget.parentElement.parentElement.getAttribute("id");

        // deletes component by id from visualization layer
        setBodyData(bodyData.filter(element => element.id !== id))

    }

    /**
     * updates the visualization that are shown in visualizationLayer
     */
    function addToBodyData(selectedVisualization, selectedData) {
        const dataToAdd = {
            component: selectedVisualization,
            targetData: selectedData,
            id: uuid(),
        };

        const newBodyData = bodyData.concat([dataToAdd]); //damit änderung neu gerendert wird so umständlich
        saveLayout();
        setBodyData(newBodyData);
    }

    // saves layout global
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
                addToBodyData={addToBodyData}
            />
            <VisualizationLayer
                key="vislayer"
                editable={editable}
                bodyData={bodyData}
                layout={layout}
                onDeleteComponentClicked={onDeleteComponentClicked}
            />
        </div>
    )
}

export default DocumentWindow;