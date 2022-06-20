function getBasisData(){

    // make request to get data
    //   const url = "http://localhost:9999/result/pos";
    //   const response = useGetData(url);
    const data = [3, 10, 3, 2, 6, 2, 6];
    const labels= ["ASFD", "fass", "Fasd", "ASD", "gasfdf", "afsdf", "sd"];

    // attributes of chart
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
    const label = "Ein Titel wie sdfdsa man ihn will"

    const dataForVisualization = {
        labels: labels,
        datasets: [{
            label: label,
            data: data,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1
        }],

    };


    return dataForVisualization;
}

export default getBasisData;