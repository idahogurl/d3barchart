"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var serviceUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var React = require('react');
var ReactDOM = require('react-dom');
var Axios = require('axios');
// import * as selection_D3 from 'd3-selection';
// import * as range_D3 from 'd3_range';
// import * as scale_D3 from 'd3_scale';
var D3 = require("d3");
var react_1 = require("react");
var BarChart = (function (_super) {
    __extends(BarChart, _super);
    function BarChart() {
        var _this = _super.call(this) || this;
        _this.fetchData();
        var barData = [20, 30, 45, 15];
        barData = barData.sort(function (a, b) {
            return a - b;
        });
        var height = 400, width = 600, barWidth = 50, barOffset = 5;
        debugger;
        var yScale = D3.scaleLinear()
            .domain([0, D3.max(barData)])
            .range([0, height]);
        var xScale = D3.scaleBand()
            .domain(D3.range(barData.length).map(function (m) { return m.toString(); }))
            .range([0, width]);
        var tooltip = D3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("padding", "0 10px")
            .style("background", "white")
            .style("opacity", 0);
        var svgChart = D3.select("#chart").append("svg")
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
            .attr("height", function (d) {
            return yScale(d);
        })
            .attr("x", function (x, i) {
            return xScale(i.toString());
        })
            .attr("y", (function (y) {
            return height - yScale(y);
        }))
            .on("mouseover", function (d) {
            tooltip.transition()
                .style("opacity", .9);
            tooltip.html(d.toString())
                .style("left", D3.event.pageX.toString() + "px")
                .style("top", D3.event.pageY.toString() + "px");
            var tempColor = "#ffb6c1";
            D3.select(D3.event.currentTarget)
                .style("opacity", 1)
                .style("fill", tempColor);
        })
            .on("mouseout", function () {
            var tempColor = "#ffb6c1";
            D3.select(D3.event.currentTarget)
                .style("opacity", 1)
                .style("fill", "#FF00FF");
        });
        var xAxis = svgChart.append("g")
            .call(D3.axisBottom(xScale));
        return _this;
    }
    BarChart.prototype.fetchData = function () {
        var self = this;
        // Performing a GET request
        Axios.get(serviceUrl)
            .then(function (response) {
            debugger;
            //self.setState({data: response.data});
        });
    };
    BarChart.prototype.render = function () {
        return React.createElement("div", null);
    };
    return BarChart;
}(react_1.Component));
var barChart = new BarChart();
//ReactDOM.render(<BarChart/>, document.getElementById("chart"));
