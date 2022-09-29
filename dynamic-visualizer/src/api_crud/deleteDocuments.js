import axios from "axios";

// custom modules
import {apiEndpoints} from "../helper/envConst"

/**
 * to update or add a presentation
 * @param presentation
 */
function deleteDocuments() {
  axios.get(apiEndpoints.basis + apiEndpoints.documents + apiEndpoints.delete)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

export default deleteDocuments;