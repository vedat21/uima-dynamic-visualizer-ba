import React from 'react';
import WordCloud from 'react-d3-cloud';
import {apiEndpoints} from "../../../helper/envConst";
import useGetData from "../../../api_crud/useGetData";

export default function WordCloudComponent(props) {

  let requestUrl = props.url  +  props.selectedDocuments.join(",") + apiEndpoints.requestParamMinOccurrence + props.selectedMinOccurrence;

  if (props.lemmaEnd != 0 && props.selectedDocuments.length == 1){
    requestUrl = requestUrl + "&begin=" + props.lemmaBegin + "&end=" + props.lemmaEnd;
  }

  // make request to get data
  const {response, loading} = useGetData(requestUrl);

  const labels = (response.map(({id, count}) =>{
    return {text: id, value: count  *30}
  }));


  return (
      <WordCloud data={labels}/>
  )
}
