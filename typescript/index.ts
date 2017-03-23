const serviceUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

import * as D3 from 'd3';
require('./sass/styles.scss');

class Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;

    constructor(top:number, right:number, bottom:number, left:number)
    {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left= left;
    }    
}
class BarChart {
    barData:number[];
    height:number;
    width:number;
    xScale: D3.ScaleTime<number,number>;
    margin:Margin;

    constructor()
    {   
        this.createChart = this.createChart.bind(this);
        this.margin = new Margin(30, 30, 40, 70);
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.width = 1000 - this.margin.left - this.margin.right;

        this.barData = [];
        this.fetchData();
    }
    createChart()
    {   
        let height = this.height;
        let width = this.width;
        let margin = this.margin;
        let barData = this.barData;
        let barWidth = Math.ceil(width / barData.length);

        let yScale = D3.scaleLinear()
            .domain([0, D3.max(barData, d => {
                return d[1];
            })])
            .range([0, height]);
        debugger;
        
        let years:Date[] = this.barData.map(m => { return m[0]; });
        
        let xScale = D3.scaleTime()
            .domain([years[0], years[years.length - 1]])
            .range([0, width]);
        this.xScale = xScale;

        let tooltip = D3.select("#tooltip")
            .append("div")
            .style("pointer-events", "none")
            .style("position", "absolute")
            .style("padding", "0 10px")
            .style("background", "white")
            .style("opacity", 0);

        // text label for the y axis
        let moneyFormatter = D3.format("$,.2f");

        let self = this;
        let svgChart = D3.select("#chart").append("svg")
            .style("background", "#FFF")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top +")")
            .selectAll("rect")
            .data(barData)
            .enter()
            .append("rect")
            .style("fill", "steelblue")        
            .attr("width", barWidth)
            .attr("height", 
            d=> 
            { 
                return yScale(d[1]);
            })
            .attr("x", 
            x => 
            {
                return xScale(x[0]);
            })
            .attr("y", (
                y => 
            {
                return height - yScale(y[1]);
            }))
            .on("mouseover", (d) => 
            {   
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
            .on("mouseout", () => 
            {   
                tooltip
                .transition()
                .duration(500)
                .style("opacity", 0);

                let tempColor = "#ffb6c1";
                D3.select(D3.event.currentTarget)
                    .style("opacity", 1)
                    .style("fill", "steelblue");
            });
            svgChart.append("g").append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Gross Domestic Product, USA");     
    
            this.addVerticalAxis();
            this.addHorizontalAxis();
    }
    getMonthName(month:number)
    {
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
         "October", "November", "December"];
         return months[month];
    }
    fetchData()
    {
        var self = this;
        D3.json(serviceUrl, d => {
            
            d.data.forEach(i => {
                i[0] = new Date(Date.parse(i[0]));
                this.barData.push(i);
                //debugger;
            });
            
            self.createChart();
        });
    }
    addHorizontalAxis()
    {
        let height = this.height;
        let margin = this.margin;
        let xScale = this.xScale;
        let barData = this.barData;
        
        let hAxis = D3.axisBottom(xScale);
   
        let hGuide = D3.select("svg").append("g").style("font-size", "20px").call(hAxis);

        hGuide.attr("transform", "translate (" + margin.left + ", " + (margin.top + height) + ")")
            .selectAll("path")
                .style("fill", "none")
                .style("stroke", "#000")
            .selectAll("line")
                .style("stroke", "#000");
    }
    addVerticalAxis()
    {
        let height = this.height;
        let margin = this.margin;

        let vGuideScale = D3.scaleLinear()
            .domain([0, D3.max(this.barData, d => {
              return d[1];
            })])
            .range([height, 0]);

        let vAxis = D3.axisLeft(vGuideScale)
            .ticks(10);
   
        let vGuide = D3.select("svg").append("g").style("font-size", "20px").call(vAxis);

        vGuide.attr("transform", "translate (" + margin.left + ", " + margin.top + ")")
            .selectAll("path")
                .style("fill", "none")
                .style("stroke", "#000")
            .selectAll("line")
                .style("stroke", "#000");
    }
}
let barChart = new BarChart();
