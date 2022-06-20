import React from 'react';
import Select from 'react-select';

// Todo sollte dynmisch sein von api abfragen
const options = [
    {value: 'barchart', label: 'Bar Chart'},
    {value: 'bubblechart', label: 'Bubble Chart'},
    {value: 'doughnutchart', label: 'Doughnut Chart'},
    {value: 'linechart', label: 'Line Chart'},
    {value: 'piechart', label: 'Pie Chart'},
    {value: 'polarareachart', label: 'Polar Area Chart'},
    {value: 'scatterchart', label: 'Scatter Chart'},
    {value: 'radarchart', label: 'Radar Chart'},
    {value: "textarea", label: "Text Area"},
    {value: 'textcomponent', label: 'Text'},


];

/**
 * Todo: options soll von api  bezogen werden. Welche Datan sind zugänglich?
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SelectForm(props) {

    /**
     * updates the selected value
     * @param selectedOption
     */
    function handleChange(selectedOption) {
        props.setSelectedOption(selectedOption.value);
    }

    return (
        <Select
            defaultValue={props.selected}
            onChange={(selectedOption) => handleChange(selectedOption)}
            options={options}
            className="select"
        >
        </Select>
    );
}

export default SelectForm;