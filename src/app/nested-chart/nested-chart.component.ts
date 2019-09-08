import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3'
@Component({
  selector: 'app-nested-chart',
  templateUrl: './nested-chart.component.html',
  styleUrls: ['./nested-chart.component.css'],
  encapsulation: ViewEncapsulation.None //without encapsulation of none nested-chart.component.css not working not only in this but for all that use d3 thats what i think 
})
export class NestedChartComponent {

  constructor() { }
  
  ngOnInit(){
    //dimensions for canvas
  let  width = 960
   let height = 700
   let radius = (Math.min(width, height) / 2) - 10;
  
    //convert string into integer => "(",d")"
   let formatNumber = d3.format(",d");
  
    //to map data within the range for horizontally
   let x = d3.scaleLinear()
      .range([0, 2 * Math.PI]);
  
    //to map data within the range for vertically
   let y = d3.scaleSqrt()
      .range([0, radius]);
    
    //to map the color in the arc
   let color = d3.scaleOrdinal(
      //color scale 
      d3.schemeCategory20);
    
    //creates a new partition layout
   let partition = d3.partition();
    
    //arc generator
   let arc = d3.arc()
      .startAngle((d) => { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
      .endAngle((d) => { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
      .innerRadius((d) => { return Math.max(0, y(d.y0)); })
      .outerRadius((d) => { return Math.max(0, y(d.y1)); });

      var tooltip = d3.select('#chart')
      .append('div')
      .attr('class', 'tooltip');

    tooltip.append('div')
      .attr('class', 'label');

    tooltip.append('div')
      .attr('class', 'count');

    tooltip.append('div')
      .attr('class', 'percent');  
  
    //append svg in body 
   let svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")"); 
  
  
    //import json data from data.json file
   let dataimport = d3.json("assets/data.json", (data) => {
  
      //creates a new hierarchy layout
      data = d3.hierarchy(data);
      
      //sum up all size 
      data.sum((d) => { return d.size; });
      
      //append path in svg tag
    var path=  svg.selectAll("path")
  
      //returns the array of descendant nodes "this.partition(data).descendants()"
        .data(partition(data).descendants()).enter()
        .append("path")
        .attr("d", arc)
        .style("fill", (d) => { return color((d.children ? d : d.parent).data.name); })
        .append("title")
        .text((d) => { return d.data.name + "\n" + formatNumber(d.value); });

        path.on('mouseover', function(d) {  
          // var total = d3.sum(data.map(function(d) { 
          //  return (d.enabled) ? d.count : 0;
          //  }));                                                      
          var percent = Math.round(1000 * d.data.size ) / 10; 
          tooltip.select('.label').html(d.data.name);       
          tooltip.select('.count').html('$' + d.data.name);           
          tooltip.select('.percent').html(percent + '%');
          tooltip.style('display', 'block');              
         });                                                           
         
         path.on('mouseout', function() {                         
           tooltip.style('display', 'none'); 
          });
         
         path.on('mousemove', function(d) {                 
           tooltip.style('top', (d3.event.layerY + 10) + 'px')
             .style('left', (d3.event.layerX + 10) + 'px');
           });        
    });

  }

  



}


