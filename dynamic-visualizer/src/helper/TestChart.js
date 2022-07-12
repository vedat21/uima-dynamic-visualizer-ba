import { BarChart } from 'reaviz';

const data = [
    { key: 'IDS', data: 14 },
    { key: 'Malware', data: 5 },
    { key: 'DLP', data: 18 }
];

function TestChart(){
  return(
      <BarChart width={350} height={250} data={data} />
  )
}

export default TestChart;