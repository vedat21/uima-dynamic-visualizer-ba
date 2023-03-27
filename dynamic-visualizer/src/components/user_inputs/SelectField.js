import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {hexToWord} from "../../helper/envConst";


/**
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SelectField(props) {

    // for animation when selected option is removed
    const animated = makeAnimated();
    const defaultValue = []

    /**
     * updates the selected values.
     * @param selectedOption
     */
    function handleChange(selectedData) {
        // if multiple data is selected than save only the values in a list
        if (props.isMulti) {
            props.setSelectedOption(selectedData.map(({value}) => {
                return value
            }));
        } else {
            props.setSelectedOption(selectedData.value);
        }
    }

    // When a visualization is edited, to fill the selections
    if (props.selectedOption.length !== 0 && props.options) {
        if (props.isMulti) {
            props.selectedOption.forEach((option) => {
                if(props.placeholder === "Types"){
                    defaultValue.push({value: option, label: option.replaceAll("_", " ").toUpperCase()})
                }
                else if (props.placeholder === "Colors"){
                    defaultValue.push({value: option, label: hexToWord[option]})
                }
                else {
                    defaultValue.push({value: option, label: option})
                }
            })
        } else {
            const value = props.options.find(option => option.value === props.selectedOption)
            defaultValue.push(value);
        }

    }

    return (
        <Select
            defaultValue={defaultValue}
            className="select"
            styles={{
                control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: !state.menuIsOpen ? 'grey' : 'red',

                }),
            }}
            onChange={handleChange}
            options={props.options}
            isMulti={props.isMulti}
            components={animated}
            placeholder={props.placeholder}
        >
        </Select>
    );
}

export default SelectField;
