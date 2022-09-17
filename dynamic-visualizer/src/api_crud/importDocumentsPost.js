import axios from "axios";

// custom modules
import {apiEndpoints} from "../helper/envConst"

/**
 * to update or add a presentation
 * @param presentation
 */
function importDocumentsPost(path) {

  const formData = new FormData();

  formData.append("file", require("/Users/vyildiz/soko/uima-dynamic-visualizer-ba/dynamic-visualizer/src/index.css"));

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