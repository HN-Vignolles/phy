// Function to parse and evaluate a user-defined function
function evaluateFunction(expr, x) {
    try {
        const scope = { x: x };
        return math.evaluate(expr, scope);
    } catch (error) {
        console.error("Error evaluating function:", error);
        return NaN;
    }
}

// Initialize Math.js and D3.js
//const math = Math;//require('mathjs');
const svg = d3.select("#graph-container")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

// Initial point on the graph
let point = { x: 2, y: 4 };

// Draw the initial function graph
const xScale = d3.scaleLinear().domain([-5, 5]).range([0, 500]);
const yScale = d3.scaleLinear().domain([0, 25]).range([500, 0]);

const lineFunction = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

const xValues = d3.range(-5, 5.1, 0.1);
const functionData = xValues.map(x => ({ x: x, y: evaluateFunction(document.getElementById('functionInput').value, x) }));

svg.append("path")
    .datum(functionData)
    .attr("class", "line")
    .attr("d", lineFunction)
    .style("stroke", "blue");

// Draw the initial tangent line
let tangentLine = svg.append("line")
    .style("stroke", "red")
    .style("stroke-dasharray", "5,5");

// Draw the draggable point
let draggablePoint = svg.append("circle")
    .attr("cx", xScale(point.x))
    .attr("cy", yScale(point.y))
    .attr("r", 8)
    .style("fill", "green")
    .call(d3.drag().on("drag", dragged));

// Function to update the tangent line
function updateTangentLine(x, y) {
    const h = 0.01; // small increment for calculating the derivative

    // Calculate the derivative using central difference
    const slope = (evaluateFunction(document.getElementById('functionInput').value, x + h) - evaluateFunction(document.getElementById('functionInput').value, x - h)) / (2 * h);

    // Calculate the y-intercept of the tangent line
    const yIntercept = y - slope * x;

    // Update the tangent line
    tangentLine.attr("x1", xScale(-5))
        .attr("y1", yScale(slope * -5 + yIntercept))
        .attr("x2", xScale(5))
        .attr("y2", yScale(slope * 5 + yIntercept));
}

// Function to handle drag events
function dragged(event, d) {
    // Ensure the point stays within the function graph
    const x = xScale.invert(event.x);
    const y = evaluateFunction(document.getElementById('functionInput').value, x);

    if (!isNaN(y)) {
        //d.x = x;
        //d.y = y;
        console.log("dragged");
        d3.select(this).attr("cx", xScale(x)).attr("cy", yScale(y));
        updateTangentLine(x, y);
    }
}
