import {useEffect, useRef} from "react";
import * as d3 from "d3-selection";

const TestChart = () => {
  const ref = useRef()
  useEffect(() => {
    const svgElement = d3.select(ref.current)
    svgElement.append("circle")
    .attr("cx", 150)
    .attr("cy", 70)
    .attr("r",  50)
  }, [])
  return (
      <svg
          viewBox="0 0 300 600"
          ref={ref}
      />
  )
}

export default TestChart;