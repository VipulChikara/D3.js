import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class PieChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var dataset = [
      {label: "Assamese", count: 13,enabled:false},
      {label: "Bengali", count: 83,enabled:false},
      {label: "Bodo", count: 1.4,enabled:false},
      {label: "Dogri", count: 2.3,enabled:false},
      {label: "Gujarati", count: 46,enabled:false},
      {label: "Hindi", count: 300,enabled:false},
      {label: "Kannada", count: 38,enabled:false},
      {label: "Kashmiri", count: 5.5,enabled:false},
      {label: "Konkani", count: 5,enabled:false},
      {label: "Maithili", count: 20,enabled:false},
      {label: "Malayalam", count: 33,enabled:false},
      {label: "Manipuri", count: 1.5,enabled:false},
      {label: "Marathi", count: 72,enabled:false},
      {label: "Nepali", count: 2.9,enabled:false},
      {label: "Oriya", count: 33,enabled:false},
      {label: "Punjabi", count: 29,enabled:false},
      {label: "Sanskrit", count: 0.01,enabled:false},
      {label: "Santhali", count: 6.5,enabled:false},
      {label: "Sindhi", count: 2.5,enabled:false},
      {label: "Tamil", count: 61,enabled:false},
      {label: "Telugu", count: 74,enabled:false},
      {label: "Urdu", count: 52,enabled:false}
    ];
  
  var width = 1200;
  var height = 800;
  
  var radius = Math.min(width, height) / 2;

  var legendRectSize = 25; 
  var legendSpacing = 6; 
  
 var color = d3.scaleOrdinal(d3.schemeCategory20c);
 
  var svg = d3.select('#chart') 
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g') 
  .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')
  
  
  var arc = d3.arc()
    .innerRadius(0) 
    .outerRadius(radius);
  
  var pie = d3.pie() 
    .value(function(d) { return d.count; })
    .sort(null); 
  
  var tooltip = d3.select('#chart')
    .append('div')                                   
    .attr('class', 'tooltip'); 
  
  tooltip.append('div')                          
    .attr('class', 'label');                        
  
  tooltip.append('div')                    
    .attr('class', 'count');                   
  
  tooltip.append('div') 
    .attr('class', 'percent');
  
  dataset.forEach(function(d) {
    d.count = +d.count; 
    d.enabled = true;
  });
  
  var path = svg.selectAll('path') 
    .data(pie(dataset)) 
    .enter() 
    .append('path') 
    .attr('d', arc)
    .attr('fill', function(d) { return color(d.data.label); }) 
    .each(function(d) { this._current - d; }); 
  
  
  path.on('mouseover', function(d) {  
   var total = d3.sum(dataset.map(function(d) { 
    return (d.enabled) ? d.count : 0;
    }));                                                      
   var percent = Math.round(1000 * d.data.count / total) / 10; 
   tooltip.select('.label').html(d.data.label);       
   tooltip.select('.count').html('$' + d.data.count);           
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

 
  
  var legend = svg.selectAll('.legend') 
    .data(color.domain()) 
    .enter() 
    .append('g') 
    .attr('class', 'legend') 
    .attr('transform', function(d, i) {                   
      var height = legendRectSize + legendSpacing; 
      var offset =  height * color.domain().length / 2; 
      var horz = 18 * legendRectSize; 
      var vert = i * height - offset;           
        return 'translate(' + horz + ',' + vert + ')';
     });
  
   legend.append('rect')                             
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)                     
    .style('fill', color) 
    .style('stroke', color) 
    .on('click', function(label) {
      var rect = d3.select(this); 
      var enabled = true; 
      var totalEnabled = d3.sum(dataset.map(function(d) { 
        return (d.enabled) ? 1 : 0; 
      }));
      if (rect.attr('class') === 'disabled') { 
        rect.attr('class', ''); 
      } else { 
        if (totalEnabled < 2) return; 
        rect.attr('class', 'disabled'); 
        enabled = false; 
      }
  
      pie.value(function(d) { 
        if (d.label === label) d.enabled = enabled; 
          return (d.enabled) ? d.count : 0; 
      });
  
      path = path.data(pie(dataset)); 
      path
      .transition() 
        .duration(2000) 
        .attrTween('d', function(d) { 
          var interpolate = d3.interpolate(this._current, d); 
          this._current = interpolate(0); 
          return function(t) {
            return arc(interpolate(t));
          };
        });
    });

  legend.append('text')                                    
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; }); 
  }

}
