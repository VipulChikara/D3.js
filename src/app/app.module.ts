import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NestedChartComponent } from './nested-chart/nested-chart.component';
import { DonutchartComponent } from './donutchart/donutchart.component';
import { TransitionChartComponent } from './transition-chart/transition-chart.component';
import { ExtendedArcChartComponent } from './extended-arc-chart/extended-arc-chart.component';
import { BargraphComponent } from './bargraph/bargraph.component';
import { MultilevelChartComponent } from './multilevel-chart/multilevel-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    NestedChartComponent,
    DonutchartComponent,
    TransitionChartComponent,
    ExtendedArcChartComponent,
    BargraphComponent,
    MultilevelChartComponent,
    LineChartComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
