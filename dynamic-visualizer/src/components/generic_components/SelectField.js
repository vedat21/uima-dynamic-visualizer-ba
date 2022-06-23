import React from 'react';
import Select from 'react-select';


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
            options={props.options}
            className="select"
        >
        </Select>
    );
}

export default SelectForm;