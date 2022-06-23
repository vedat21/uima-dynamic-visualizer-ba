import React from "react";
import Responsive, {WidthProvider} from "react-grid-layout";
import _ from "lodash";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

// custom modules
import LayerComponent from "./LayerComponent";

window.$localVisualizationLayout = [];

/**
 * Grid Layer where all visualization components are stored
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function VisualizationLayer(props) {
    //import
    const ResponsiveReactGridLayout = WidthProvider(Responsive);


    /**
     * creates and returns the components that are defined in the prop bodyData.
     * @returns {all visualization components}
     */
    function generateVisualizationLayer() {
        return _.map(_.map(props.bodyData), function (block) {
            return (
                <div
                    className={block.component === "textcomponent" ? "scrollable-text" : "chart"}
                    key={block.id}
                    id={block.id}
                >
                    <LayerComponent block={block} editable={props.editable} onDeleteComponentClicked={props.onDeleteComponentClicked}/>
                </div>
            )
        });
    }


    /**
     * when layout changes than it is saved in a globalvariable so
     * it doesnt rerender on everey remove or resize.
     * @param layout
     */
    const onLayoutChange = (layout) => {
        window.$localVisualizationLayout = layout;
    }

    return (
        <div className={props.editable ? "layout_editable" : "layout"}>
            <ResponsiveReactGridLayout
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

export default VisualizationLayer;