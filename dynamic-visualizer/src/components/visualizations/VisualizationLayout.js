import React, {useCallback, useEffect, useState} from "react";
import Responsive, {WidthProvider} from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import _ from "lodash";

// custom modules
import LayoutComponent from "./LayoutComponent";
import getComponentConfiguration from "../../helper/getComponentConfiguration";

// global variable for layout
window.$localVisualizationLayout = [];
// global variable for layout
window.$selectedLemmas = {lemmaBegin: 0, lemmaEnd: 0};

/**
 * Grid Layer where all visualization components are stored
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function VisualizationLayout(props) {
  const ResponsiveGridLayout = WidthProvider(Responsive);

  const [lemmaBegin, setLemmaBegin] = useState(0);
  const [lemmaEnd, setLemmaEnd] = useState(0);

  /**
   * creates and returns the components that are defined in visualizations.
   * @returns {all visualization components}
   */
  function generateVisualizationLayer() {
    return _.map(_.map(props.visualizations), function (visualization) {
      return (
          <div
              className={visualization.component.includes("text")
                  ? "scrollable-text" : "chart"}
              data-grid={getComponentConfiguration(visualization.component)}
              key={visualization.id}
              id={visualization.id}
          >
            <LayoutComponent visualization={visualization} lemmaBegin={lemmaBegin} lemmaEnd={lemmaEnd} setLemmaBegin={setLemmaBegin} setLemmaEnd={setLemmaEnd} {...props}/>
          </div>
      )
    });
  }

  /**
   * when layout changes than it is saved in global variable so it doesnt rerender on everey remove or resize.
   * @param layout
   */
  const onLayoutChange = (layout) => {
    window.$localVisualizationLayout = layout;
  }


  return (
      <ResponsiveGridLayout
          className={props.editable ? "layout_editable" : "layout"}
          layout={props.layout}
          breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
          onLayoutChange={onLayoutChange}
          isDraggable={props.editable}
          isResizable={props.editable}
          margin={[15, 15]}
          preventCollision={true}
          verticalCompact={false}
          {...props}
      >
        {generateVisualizationLayer()}
      </ResponsiveGridLayout>
  );
}

export default VisualizationLayout;
