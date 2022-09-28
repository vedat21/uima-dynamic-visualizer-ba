import React, {useCallback} from "react";
import Responsive, {WidthProvider} from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import _ from "lodash";

// custom modules
import LayoutComponent from "./LayoutComponent";
import getComponentConfiguration from "../../helper/getComponentConfiguration";

// global variable for layout
window.$localVisualizationLayout = [];

/**
 * Grid Layer where all visualization components are stored
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function VisualizationLayout(props) {
  const ResponsiveGridLayout = WidthProvider(Responsive);

  /**
   * creates and returns the components that are defined in visualizations.
   * @returns {all visualization components}
   */
  function generateVisualizationLayer() {
    return _.map(_.map(props.visualizations), function (visualization) {
      return (
          <div
              className={visualization.component === "richtexteditor"
                  ? "scrollable-text" : "chart"}
              data-grid={getComponentConfiguration(visualization.component)}
              key={visualization.id}
              id={visualization.id}
          >
            <LayoutComponent visualization={visualization} {...props}/>
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

  /**
   * currently not used
   * function to maintain aspect ratio on resize. used for chart components.
   * @type {(function(*, *, *, *): void)|*}
   * @author: Adri9wa (https://github.com/react-grid-layout/react-grid-layout/issues/267)
   */
  const handleResizeLockAspectRatio = useCallback(
      (l, oldLayoutItem, layoutItem, placeholder) => {

        return;
        // to check if component is text. if true then dont need to maintain aspect ratio
        if (layoutItem.minH === 1.5) {
          return;
        }

        const heightDiff = layoutItem.h - oldLayoutItem.h;
        const widthDiff = layoutItem.w - oldLayoutItem.w;
        const changeCoef = oldLayoutItem.w / oldLayoutItem.h;
        if (Math.abs(heightDiff) < Math.abs(widthDiff)) {
          layoutItem.h = layoutItem.w / changeCoef;
          placeholder.h = layoutItem.w / changeCoef;
        } else {
          layoutItem.w = layoutItem.h * changeCoef;
          placeholder.w = layoutItem.h * changeCoef;
        }
      }, []);

  return (
      <ResponsiveGridLayout
          className={props.editable ? "layout_editable" : "layout"}
          layout={props.layout}
          breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
          onLayoutChange={onLayoutChange}
          isDraggable={props.editable}
          isResizable={props.editable}
          onResize={handleResizeLockAspectRatio}
          margin={[10, 10]}
          // This turns off compaction so you can place items wherever.
          verticalCompact={false}
          // This turns off rearrangement so items will not be pushed arround.
          preventCollision={true}
          {...props}
      >
        {generateVisualizationLayer()}
      </ResponsiveGridLayout>
  );
}

export default VisualizationLayout;
