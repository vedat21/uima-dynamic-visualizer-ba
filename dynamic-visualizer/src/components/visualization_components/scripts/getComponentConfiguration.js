/**
 * um startgröße und mindestgräße von verschiedenen komponenten zu bestimmen
 * @param component
 * @returns {{minH: number, minW: number, w: number, x: number, h: number, y: number}}
 */
function getComponentConfiguration(component){

    // min size of chart and text components.
    const minSizeChart = {width: 3.5, height: 1.4};
    const minSizeSquareChart = {width: 1.7, height: 1.4};
    const minSizeText = {width: 1.5, height: 1.5}; //minheight 1.5 soll nur textchart haben




    // für charts die quadratisches sind
    if (component === "piechart" || component === "doughnutchart" || component === "radarchart" || component === "polarareachart"){
        const dataGrid = {
            x: 0,
            y: 0,
            w: minSizeSquareChart.width,
            h: minSizeSquareChart.height,
            minW: minSizeSquareChart.width,
            minH: minSizeSquareChart.height
        };
        return dataGrid;
    }
    // für textcomponenten
    else if (component.startsWith("text")){
        const dataGrid = {
            x: 0,
            y: 0,
            w: minSizeText.width,
            h: minSizeText.height,
            minW: minSizeText.width,
            minH: minSizeText.height
        };
        return dataGrid;
    }
    // für charts die rechteckig sind
    else {
        const dataGrid = {
            x: 0,
            y: 0,
            w: minSizeChart.width,
            h: minSizeChart.height,
            minW: minSizeChart.width,
            minH: minSizeChart.height
        };
        return dataGrid;
    }

}

export default getComponentConfiguration;