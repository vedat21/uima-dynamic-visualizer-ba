import TestChart from './TestChart'

function TestApp() {
  const data = [
    {
      country: "China",
      population: 1394015977
    },{
      country: "India",
      population: 1326093247
    },
    {
      country: "United States",
      population: 329877505
    },
    {
      country: "Indonesia",
      population: 267026366
    },
    {
      country: "Pakistan",
      population: 233500636
    }
  ]
  return (
      <div>
        <h3>D3 EXAMPLE</h3>
        <TestChart data={data}/>
      </div>
  );
}

export default TestApp;