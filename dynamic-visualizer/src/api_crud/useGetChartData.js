import useGetData from "./useGetData";
import {apiEndpoints} from "../helper/envConst"


export const options = {
    indexAxis: 'y',
    elements: {
        bar: {
            borderWidth: 2,
        },
    },
    responsive: true,
    plugins: {
        legend: {
            position: 'right',
        },
        title: {
            display: true,
            text: 'Chart.js Horizontal Bar Chart',
        },
    },
};

/**
 *
 * @param label is prop
 * @param url is prop
 * @returns {{datasets: [{backgroundColor: string[], borderColor: string[], data: [number], borderWidth: number, label: *}], labels: [string]}}
 */
const useGetChartData = (label, url, limit, documents, lemmaBegin, lemmaEnd) => {

    let reqeustUrl = url  +   documents.join(",") + apiEndpoints.requestParamLimit + limit;

    if (lemmaEnd != 0 && documents.length == 1){
        reqeustUrl = reqeustUrl + "&begin=" + lemmaBegin + "&end=" + lemmaEnd;
    }

    // make request to get data
    const {response, loading} = useGetData(reqeustUrl);

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