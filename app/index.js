"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serviceUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var D3 = require("d3");
require('./sass/styles.scss');
var Margin = (function () {
    function Margin(top, right, bottom, left) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
    return Margin;
}());
var BarChart = (function () {
    function BarChart() {
        this.createChart = this.createChart.bind(this);
        this.margin = new Margin(30, 30, 40, 70);
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.width = 1000 - this.margin.left - this.margin.right;
        this.barData = [];
        this.fetchData();
    }
    BarChart.prototype.createChart = function () {
        var height = this.height;
        var width = this.width;
        var margin = this.margin;
        var barData = this.barData;
        var barWidth = Math.ceil(width / barData.length);
        var yScale = D3.scaleLinear()
            .domain([0, D3.max(barData, function (d) {
                return d[1];
            })])
            .range([0, height]);
        debugger;
        var years = this.barData.map(function (m) { return m[0]; });
        var xScale = D3.scaleTime()
            .domain([years[0], years[years.length - 1]])
            .range([0, width]);
        this.xScale = xScale;
        var tooltip = D3.select("#tooltip")
            .append("div")
            .style("pointer-events", "none")
            .style("position", "absolute")
            .style("padding", "0 10px")
            .style("background", "white")
            .style("opacity", 0);
        // text label for the y axis
        var moneyFormatter = D3.format("$,.2f");
        var self = this;
        var svgChart = D3.select("#chart").append("svg")
            .style("background", "#FFF")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .selectAll("rect")
            .data(barData)
            .enter()
            .append("rect")
            .style("fill", "steelblue")
            .attr("width", barWidth)
            .attr("height", function (d) {
            return yScale(d[1]);
        })
            .attr("x", function (x) {
            return xScale(x[0]);
        })
            .attr("y", (function (y) {
            return height - yScale(y[1]);
        }))
            .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(moneyFormatter(d[1]) + " Billion<br>" + d[0].getFullYear().toString() + " - "
                + self.getMonthName(d[0].getMonth()))
                .style("left", D3.event.pageX.toString() + "px")
                .style("top", D3.event.pageY.toString() + "px");
            D3.select(D3.event.currentTarget)
                .style("opacity", 1)
                .style("fill", "LightSteelBlue");
        })
            .on("mouseout", function () {
            tooltip
                .transition()
                .duration(500)
                .style("opacity", 0);
            var tempColor = "#ffb6c1";
            D3.select(D3.event.currentTarget)
                .style("opacity", 1)
                .style("fill", "steelblue");
        });
        svgChart.append("g").append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Gross Domestic Product, USA");
        this.addVerticalAxis();
        this.addHorizontalAxis();
    };
    BarChart.prototype.getMonthName = function (month) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
            "October", "November", "December"];
        return months[month];
    };
    BarChart.prototype.fetchData = function () {
        var _this = this;
        var self = this;
        D3.json(serviceUrl, function (d) {
            d.data.forEach(function (i) {
                i[0] = new Date(Date.parse(i[0]));
                _this.barData.push(i);
                //debugger;
            });
            self.createChart();
        });
    };
    BarChart.prototype.addHorizontalAxis = function () {
        var height = this.height;
        var margin = this.margin;
        var xScale = this.xScale;
        var barData = this.barData;
        var hAxis = D3.axisBottom(xScale);
        var hGuide = D3.select("svg").append("g").style("font-size", "20px").call(hAxis);
        hGuide.attr("transform", "translate (" + margin.left + ", " + (margin.top + height) + ")")
            .selectAll("path")
            .style("fill", "none")
            .style("stroke", "#000")
            .selectAll("line")
            .style("stroke", "#000");
    };
    BarChart.prototype.addVerticalAxis = function () {
        var height = this.height;
        var margin = this.margin;
        var vGuideScale = D3.scaleLinear()
            .domain([0, D3.max(this.barData, function (d) {
                return d[1];
            })])
            .range([height, 0]);
        var vAxis = D3.axisLeft(vGuideScale)
            .ticks(10);
        var vGuide = D3.select("svg").append("g").style("font-size", "20px").call(vAxis);
        vGuide.attr("transform", "translate (" + margin.left + ", " + margin.top + ")")
            .selectAll("path")
            .style("fill", "none")
            .style("stroke", "#000")
            .selectAll("line")
            .style("stroke", "#000");
    };
    return BarChart;
}());
var barChart = new BarChart();
