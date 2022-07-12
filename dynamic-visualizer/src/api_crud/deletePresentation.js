import axios from "axios";

// custom modules
import {apiEndpoints} from "../helper/usedConst"

/**
 * to update or add a presentation
 * @param presentation
 */
function deletePresentation(id) {
    axios.get(apiEndpoints.basis + apiEndpoints.presentations + apiEndpoints.delete + id)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

export default deletePresentation;