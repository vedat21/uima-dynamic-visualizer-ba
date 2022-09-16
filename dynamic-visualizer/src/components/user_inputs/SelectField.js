import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';



/**
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SelectForm(props) {

    // for animation when selected option is removed
    const animated = makeAnimated();

    /**
     * updates the selected values.
     * @param selectedOption
     */
    function handleChange(selectedData) {

        // if multiple data is selected than save only the values in a list
        if (props.isMulti){
            props.setSelectedOption(selectedData.map(({value}) => {
                return value
            }));
        }
        else{
            props.setSelectedOption(selectedData.value);
        }
    }


    return (
        <Select
            defaultValue={props.options[0]} // default is first option
            onChange={handleChange}
            options={props.options}
            className="select"
            isMulti={props.isMulti}
            components={animated}
        >
        </Select>
    );
}

export default SelectForm;