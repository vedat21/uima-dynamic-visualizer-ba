import React, {useEffect, useState} from "react";
import {Box, Button, Tooltip} from "@mui/material";
import SelectField from "./SelectField";

import useGetData from "../../api_crud/useGetData";
import {apiEndpoints} from "../../helper/envConst";

// Alle möglichen Visualisierungskomponenten
const optionsVisualization = [
  {value: 'barchart', label: 'Bar Chart'},
  {value: 'bubblechart', label: 'Bubble Chart'},
  {value: 'doughnutchart', label: 'Doughnut Chart'},
  {value: 'linechart', label: 'Line Chart'},
  {value: 'piechart', label: 'Pie Chart'},
  {value: 'polarareachart', label: 'Polar Area Chart'},
  {value: 'scatterchart', label: 'Scatter Chart'},
  {value: 'radarchart', label: 'Radar Chart'},
  {value: 'textcomponent', label: 'Text'},
  {value: 'richtexteditor', label: 'Rich Text Editor'}
];

/**
 * container for number of input select.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SelectContainer(props) {

  const {response, loading} = useGetData(
      apiEndpoints.basis + apiEndpoints.general);

  // darin wird userauswahl gespeichert
  const [selectedVisualization, setSelectedVisualization] = useState(
      optionsVisualization[0].value);
  const [selectedData, setSelectedData] = useState("");

  // lade optionen für daten die vom server bereitgestellt werden
  let optionsData = [];
  useEffect(async () => {
    if (!loading && optionsData.length == 0) {
      response["types"].forEach((type) => {

        let label = type.split("_type_")[1]
        if (label.startsWith("pos_")){
          label = label.substring(4);
        }
        optionsData.push(
            {value: type, label: label})
      })
    }
  }, [response, optionsData, loading])

  function addVisualization() {
    if (selectedData.length !== 0 || !selectedVisualization.includes("chart")) {
      props.addVisualization(selectedVisualization, selectedData)
    }
  }

  return (
      <Box display="flex" sx={{m: 2}}>
        <SelectField
            options={optionsVisualization}
            selectedOption={selectedVisualization}
            setSelectedOption={setSelectedVisualization}
            isMulti={false}
        />
        <SelectField
            options={selectedVisualization.includes("text")? [] : optionsData}
            selectedOption={selectedData}
            setSelectedOption={setSelectedData}
            isMulti={true}
        />
        <Tooltip title={'Create new Visualization'}>
          <Button color="inherit" onClick={addVisualization}>+CREATE</Button>
        </Tooltip>
      </Box>
  )
}

export default SelectContainer;