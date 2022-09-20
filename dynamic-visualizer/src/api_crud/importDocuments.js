import axios from "axios";
// custom modules
import {apiEndpoints} from "../helper/envConst"

/**
 * uploads files to server
 * @param presentation
 */
async function importDocuments(files, group) {

  Object.values(files).forEach((file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append("group", group)

    axios.post(apiEndpoints.basis + apiEndpoints.upload,
        formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        })
    .catch(function (error) {
      console.log(error);
    });
  })

}

export default importDocuments;