const serviceUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const React = require('react');
const ReactDOM = require('react-dom');
const Axios = require('axios');

// import * as selection_D3 from 'd3-selection';
// import * as range_D3 from 'd3_range';
// import * as scale_D3 from 'd3_scale';
import * as D3 from 'd3';
import {Component} from 'react';

class BarChart extends Component<any,any> {
    constructor()
    {
        super();
        
        this.fetchData();

        let barData = [20, 30, 45, 15];
        
        barData = barData.sort((a, b) => 
        {
            return a - b;
        });
            
        let height = 400,
            width = 600,
            barWidth = 50,
            barOffset = 5;
            debugger;

        let yScale = D3.scaleLinear()
            .domain([0, D3.max(barData)])
            .range([0, height]);
        
        let xScale = D3.scaleBand()
            .domain(D3.range(barData.length).map(m => { return m.toString()}))
            .range([0, width]);
        
        let tooltip = D3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("padding", "0 10px")
            .style("background", "white")
            .style("opacity", 0);

        let svgChart = D3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "#00FF00")
        .append("g")
        .selectAll("rect")
        .data(barData)
        .enter()
        .append("rect")
        .style("fill", "#FF00FF")        
        .attr("width", xScale.bandwidth())
        .attr("height", 
        d=> 
        {
            return yScale(d);
        })
        .attr("x", 
        (x,i) => 
        {
            return xScale(i.toString());
        })
        .attr("y", (
            y => 
        {
            return height - yScale(y);
        }))
        .on("mouseover", (d) => 
        {   
            tooltip.transition()
                .style("opacity", .9);
            
            tooltip.html(d.toString())
                .style("left", D3.event.pageX.toString() + "px")
                .style("top", D3.event.pageY.toString() + "px");
            
            let tempColor = "#ffb6c1";
            D3.select(D3.event.currentTarget)
                .style("opacity", 1)
                .style("fill", tempColor);
        })
        .on("mouseout", () => 
        {   
            let tempColor = "#ffb6c1";
            D3.select(D3.event.currentTarget)
                .style("opacity", 1)
                .style("fill", "#FF00FF");
        })
        ;

        let xAxis = svgChart.append("g")
            .call(D3.axisBottom(xScale));
    }
    fetchData()
    {
        var self = this;
        // Performing a GET request
        Axios.get(serviceUrl)
        .then(function(response){
            debugger;
            //self.setState({data: response.data});
        });
    }    
    render() {
        return <div></div>
    }
}
let barChart = new BarChart();
    //ReactDOM.render(<BarChart/>, document.getElementById("chart"));
