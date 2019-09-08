import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3'

@Component({
  selector: 'app-bargraph',
  templateUrl: './bargraph.component.html',
  styleUrls: ['./bargraph.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BargraphComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    // set the ranges
    var x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    var y = d3.scaleLinear()
      .range([height, 0]);

    var svg = d3.select(".graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    d3.csv("assets/bar.csv", function (data) {

      // format the data
      data.forEach(function (d) {
        d.sales = +d.sales;
      });

      // Scale the range of the data in the domains
      x.domain(data.map(function (d) { return d.salesperson; }));
      y.domain([0, d3.max(data, function (d) { return d.sales; })]);

      // append the rectangles for the bar chart
      var bar=   svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.salesperson); })
        .attr("y", function (d) { return y(d.sales); })
        .attr("width", x.bandwidth())
        bar.transition().duration(3000).delay(500)
        .attr("height", function (d) { return height - y(d.sales); })
        bar.on("mouseover", function (d) {
          tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html((d.sales) + "<br>" + (d.salesperson));
        })
        .on("mouseout", function (d) { tooltip.style("display", "none"); });



      // add the x Axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // add the y Axis
      svg.append("g")
        .call(d3.axisLeft(y));
    });
  }

}
