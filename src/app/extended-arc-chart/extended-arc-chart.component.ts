import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3'

@Component({
  selector: 'app-extended-arc-chart',
  templateUrl: './extended-arc-chart.component.html',
  styleUrls: ['./extended-arc-chart.component.css']
})
export class ExtendedArcChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var data = [10, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

    var width = 960,
      height = 500;

    var outerRadius = height / 2 - 20,
      innerRadius = outerRadius / 3

    let radius = Math.min(width, height) / 2;

    var pie = d3.pie()
      .padAngle(.01);

    var arc = d3.arc()
      .padRadius(outerRadius)
      .innerRadius(innerRadius);

    var color = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#d7191c", "#f19d00", "#eef200", "#3fe256", "#008e15"]);

    var labelArc = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius((radius - 10) / 2);

    var svg = d3.select(".extend").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
      

    svg.selectAll("path")
      .data(pie(data))
      .enter().append("path")
      .each(function (d) { d.outerRadius = outerRadius - 20; })
      .attr("d", arc)
      .style("fill", function (d) { return color(d.data); })
      .on("mouseover", arcTween(outerRadius, 0))
      .on("mouseout", arcTween(outerRadius - 20, 150));
    
     
    function arcTween(outerRadius, delay) {
      return function () {
        d3.select(this).transition().delay(delay).attrTween("d", function (d) {
          var i = d3.interpolate(d.outerRadius, outerRadius);
          return function (t) { d.outerRadius = i(t); return arc(d); };
        });
      };
    }

    var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");
   
  
    // text
g.append("text")
    .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .attr("dy", ".35em").attr("text-anchor", "middle")
    .text(function (d) { return d.data; });


  }

}
