import axios from "axios";

// custom
import {apiEndpoints} from "../helper/envConst";


/**
 * to update or add a presentation
 * @param presentation
 */
function savePresentation(presentation){
    axios.post(apiEndpoints.basis + apiEndpoints.presentations, {
        id: presentation.id,
        title: presentation.title,
        layout: presentation.layout,
        visualizations: presentation.visualizations,
        documents: presentation.documents
    })
        .then(function (response) {
           // console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });


}

export default savePresentation;