import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        var svg = d3.select("svg"),
            margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        var parseTime = d3.timeParse("%Y")
        var bisectDate = d3.bisector(function (d) { return d.year; }).left;

        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var line = d3.line()
            .x(function (d) { return x(d.year); })
            .y(function (d) { return y(d.value); });

        // var area = d3.area()
        //     .x(function (d) { return x(d.year) + margin.left + 1; })
        //     .y0(height + margin.top - 1)
        //     .y1(function (d) { return y(d.value) + margin.top + 2.5; });

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.json("assets/linechart.json", function (error, data) {
            if (error) throw error;

            data.forEach(function (d) {
                d.year = parseTime(d.year);
                d.value = +d.value;
            });

            x.domain(d3.extent(data, function (d) { return d.year; }));
            y.domain([d3.min(data, function (d) { return d.value; }) / 1.005, d3.max(data, function (d) { return d.value; }) * 1.005]);

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(6).tickFormat(function (d) { return parseInt(d) / 1000 + "k"; }))
                .append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .attr("fill", "#5D6971")
                .text("Population)");

            g.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);

            var focus = g.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("circle")
                .attr("r", 7.5);

            focus.append("text")
                .attr("x", 15)
                .attr("dy", ".31em")
                .attr("z", -15);

            // svg.append("path")
            //     .data([data])
            //     .attr("class", "area")
            //     .attr("d", area)

            svg.append("rect")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function () { focus.style("display", null); })
                .on("mouseout", function () { focus.style("display", "none"); })
                .on("mousemove", mousemove);

            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.year > d1.year - x0 ? d1 : d0;
                focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
                focus.select("text").text(function () { return d.value; });
            }
        });
    }

}
