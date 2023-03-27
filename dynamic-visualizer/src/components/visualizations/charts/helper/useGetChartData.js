import useGetData from "../../../../api_crud/useGetData";
import {apiEndpoints} from "../../../../helper/envConst"

/**
 *
 * @param label
 * @param url
 * @param limit
 * @param selectedDocuments
 * @param lemmaBegin
 * @param lemmaEnd
 * @param fill
 * @returns {{datasets: [{backgroundColor: string[], borderColor: string[], data: *, borderWidth: number, label, fill}], labels: *}}
 */
const useGetChartData = (label, url, limit, selectedDocuments, lemmaBegin, lemmaEnd, fill) => {

    let requestUrl = url  +   selectedDocuments.join(",") + apiEndpoints.requestParamMinOccurrence + limit;

    console.log(requestUrl)

    if (lemmaEnd != 0 && selectedDocuments.length == 1){
        requestUrl = requestUrl + "&begin=" + lemmaBegin + "&end=" + lemmaEnd;
    }

    // make request to get data
    const {response, loading} = useGetData(requestUrl);

    const labels = (response.map(({id}) =>{
        return id
    }));
    const values = (response.map(({count}) =>{
        return count
    }));


    // chart farben
    const backgroundColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ]
    const borderColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ]

    const dataForVisualization = {
        labels:  labels,
        datasets: [{
            fill: fill,
            label: label,
            data: values,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1
        }],

    };

    return dataForVisualization;
}

export default useGetChartData;
