import axios from "axios";

import NavigationView from "../views/NavigationView";
// custom modules
import {apiEndpoints} from "../helper/envConst"


/**
 * uploads files to server
 * @param presentation
 */
async function importDocuments(files) {


  Object.values(files).forEach((file) => {
    console.log('was');
    const formData = new FormData();
    formData.append('file', file);
    formData.append("fileName", file.name);

    axios.post(apiEndpoints.basis + apiEndpoints.upload, formData, {headers: {
        "Content-Type": "multipart/form-data",
      }})
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });


  })



}

export default importDocuments;