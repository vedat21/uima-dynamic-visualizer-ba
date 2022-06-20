import React from "react";
import Responsive, {WidthProvider} from "react-grid-layout";
import _ from "lodash";
import {v4 as uuid} from 'uuid';
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import CloseButton from 'react-bootstrap/CloseButton'

// custom modules
import AllVisualizationComponents from "./AllVisualizationComponents";


function VisualizationLayer(props) {
    //import
    const ResponsiveReactGridLayout = WidthProvider(Responsive);

    function removeComponent(key) {
        return;
    }

    /**
     * creates and returns the components that are defined in the props bodyData.
     * @returns {all visualization components}
     */
    function generateVisualizationLayer() {
        let key = -1;

        return _.map(_.map(props.bodyData), function (block) {
            key = key + 1;

            return (
                <div
                    className={block.component === "textcomponent" ? "scrollable-text" : "chart"}
                    key={key.toString()}
                >
                    {AllVisualizationComponents(block)}
                </div>
            )
        });
    }


    //erstellt ein zufälliges layout.
    function generateLayout() {
        const p = props;
        return _.map(new Array(p.items), function (item, i) {
            const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
            return {
                x: (i * 2) % 12,
                y: Math.floor(i / 6) * y,
                w: 3,
                h: 2,
                i: i.toString()
            };
        });
    }

    // speichert layout in globale variable
    const onLayoutChange = (layout) => {
        window.$localVisualizationLayout = layout;
    }

    return (
        <div className={props.editable ? "layout_editable" : "layout"}>
            <ResponsiveReactGridLayout
                breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                layout={props.layout}
                onLayoutChange={onLayoutChange}
                isDraggable={props.editable}
                isResizable={props.editable}
            >
                {generateVisualizationLayer()}
            </ResponsiveReactGridLayout>
        </div>
    );
}

//TODO bearbeiten
VisualizationLayer.defaultProps = {
    className: "layout",
    items: 20,
    rowHeight: 30,
    onLayoutChange: function () {
    },
    cols: 12
};


export default VisualizationLayer;