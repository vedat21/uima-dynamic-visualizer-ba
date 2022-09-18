import axios from "axios";

import NavigationView from "../views/NavigationView";
// custom modules
import {apiEndpoints} from "../helper/envConst"

/**
 * to update or add a presentation
 * @param presentation
 */
async function importDocumentsPost(path) {

  const formData = new FormData();

  const file = new File(NavigationView, "testname");

  formData.append("file", file  ,  "iwas");

  console.log("ja");
  axios.post("http://localhost:8080/upload", formData, {headers: {
    "Content-Type": "multipart/form-data",
  }})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

export default importDocumentsPost;