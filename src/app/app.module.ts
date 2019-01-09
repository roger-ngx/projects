import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { LineChartComponent } from './chart/line-chart/line-chart.component';
import { SelectTagComponent } from './select-tag/select-tag.component'
import { ChartMenuComponent } from './chart-menu/chart-menu.component'

import { DynamicModule } from 'ng-dynamic-component';

//https://github.com/gevgeny/angular2-highcharts
import { ChartModule } from 'angular2-highcharts';

//https://ng-bootstrap.github.io/#/home
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//angular material components
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { rootReducer, IAppState, INITIAL_STATE } from './store';
import { CounterActions } from './app.actions'; 

import {
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatTabsModule,
  MatSelectModule,
  MatFormFieldModule,
  MatCheckboxModule, MatSidenavModule,
  MatMenuModule
} from '@angular/material';

import { FormsModule } from '@angular/forms';

import { WebSocketService } from '../service/websocket.service';
import { ChartService } from '../service/chart.service'

import { GridsterModule } from 'angular-gridster2';

//const Highcharts = require('highcharts');
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    SelectTagComponent,
    ChartMenuComponent
  ],
  imports: [
    BrowserModule,

    //angular material
    BrowserAnimationsModule,

    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule, MatSidenavModule,
    MatMenuModule,

    FormsModule,

    NgReduxModule,

    //angular highcharts
    //https://stackoverflow.com/questions/31173738/typescript-getting-error-ts2304-cannot-find-name-require
    ChartModule.forRoot(
      //require('highcharts'),
      require('highcharts/highstock')
      //Highcharts
    ),
    GridsterModule,

    //DynamicModule.withComponents([LineChartComponent]),
    NgbModule.forRoot(),
  ],
  entryComponents: [SelectTagComponent],
  providers: [
    WebSocketService,
    ChartService,
    CounterActions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor(ngRedux: NgRedux<IAppState>){
      ngRedux.configureStore(rootReducer, INITIAL_STATE);
    }
 }
