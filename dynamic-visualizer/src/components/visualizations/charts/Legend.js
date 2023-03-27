import * as d3 from "d3";

function Legend() {
    return (
        <div>
            <svg width="600" height="200" id="svg">
                <Colors data={d3.range(20)} width={400}/>
            </svg>
        </div>
    )
}
