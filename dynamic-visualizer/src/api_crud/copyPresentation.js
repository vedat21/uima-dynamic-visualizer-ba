import axios from "axios";

// custom modules
import {apiEndpoints} from "../helper/envConst"

/**
 * to update or add a presentation
 * @param presentation
 */
function copyPresentation(id) {
  axios.get(
      apiEndpoints.basis + apiEndpoints.presentations + apiEndpoints.copy + id)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

export default copyPresentation;