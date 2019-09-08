import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-donutchart',
    templateUrl: './donutchart.component.html',
    styleUrls: ['./donutchart.component.css'],
    encapsulation:ViewEncapsulation.None
})
export class DonutchartComponent implements OnInit {

    constructor() { }

    data = [10, 20, 100, 50, 70];

    svgWidth: 500;
    svgHeight: 300;

    ngOnInit() {
        var width = 700,
            height = 500,
            radius = Math.min(width, height) / 2;


            //color scale
        var color = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#d7191c", "#f19d00", "#eef200", "#3fe256", "#008e15"]);
         
            //arc dimension
        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius((radius - 10) / 2);
        
            //label dimension
        var labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius((radius - 10) / 2);
        
            //pie generator
        var pie = d3.pie()
            .sort(null)
            .value(function (d) { return d; }).padAngle(.01);
           
            //position of pie chart
        var svg = d3.select(".donut").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            
            //append g element width class arc
        var g = svg.selectAll(".arc")
            .data(pie(this.data))
            .enter().append("g")
            .attr("class", "arc");
        
            //color
        g.append("path")
            .attr("d", arc)
            .style("fill", function (d) { return color(d.data); });
          
            //title
        g.append("title")
            .text(function (d) { return "Power Consumed:" + " "+d.data; });
           
            //tetxt
            g.append("text")
            .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".35em").attr("text-anchor", "middle")
            .text(function (d) { return d.data; });

    }


}


