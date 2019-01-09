import { Component, OnInit, HostListener, Input, OnChanges, SimpleChanges, SimpleChange , ElementRef} from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {$WebSocket, WebSocketSendMode, WebSocketConfig} from 'angular2-websocket/angular2-websocket';
import { SelectTagComponent } from '../../select-tag/select-tag.component';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

const Highcharts = require('highcharts');

const CHART_DATA_URL = "ws://13.124.33.173:8080/";

export interface Message {
  data: string
}

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent implements OnInit, OnChanges {

  options: Object;
  chart : any;

  @Input() innerHeight: any;
  @Input() innerWidth: any;

  data : any;

  selectedValue: string;

  money_exchange = [
    {value: 'Korbit', viewValue: 'Korbit'},
  ];

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if(this.chart == null) return;

    if(changes.innerWidth != null) {
      this.innerWidth = changes.innerWidth.currentValue;
    }

    if(changes.innerHeight != null) {
      this.innerHeight = changes.innerHeight.currentValue;
    }

    this.chart.setSize(this.innerWidth, this.innerHeight - 40);
  }

  ngOnInit(){}

  constructor(private elementRef:ElementRef, private modalService: NgbModal) {
    console.log(elementRef.nativeElement.parentNode.parentNode);

    const webSocketConfig = { reconnectIfNotNormalClose: true } as WebSocketConfig;
    var ws = new $WebSocket(CHART_DATA_URL, null, webSocketConfig);

    ws.onMessage(
      (msg: MessageEvent)=> {
        this.data = JSON.parse(msg.data);

        if(this.chart != null){

          var data = this.data[0];

          if(this.chart.series.length == 0) {
            //console.log(data);

            this.chart.addSeries({
              type: 'line',
              animation: false,
              name: data.name,
              pointInterval: data.point_interval,
              pointStart: data.point_start_time,
              data: data.point_data,
            }, true);
          }else{

            var shiftFlag =  this.chart.series[0].data.length > data.point_data.length;

            var lastIndex =data.point_data.length - 1;

            //console.log(data.point_data[lastIndex]);

            this.chart.series[0].addPoint(data.point_data[lastIndex], false, shiftFlag);

            this.chart.xAxis[0].setExtremes( data.point_start_time, data.point_start_time + data.point_interval * lastIndex, false);
          }
          this.chart.redraw();
        }
      },
      {autoApply: false}
    );

    var cmd = "{\"request\":{\"currencies\":[\"korbit.bch_krw\"],\"action\":{\"type\":\"realtime\",\"interval\":1000,\"duration\":3600}}}";
    ws.send(cmd).subscribe(
      (msg)=> {
        console.log("next", msg.data);
      },
      (msg)=> {
        console.log("error", msg);
      },
      ()=> {
        console.log("complete");
      }
    );

    //this.innerHeight = (window.innerHeight) - 120;
    //this.innerWidth = (window.innerWidth);

    this.options = {
      chart: {
        zoomType: 'x',
        pinchType: 'x',
      },
      title : {  },
      xAxis: {
        labels: {
          enabled: true
        },
        type: 'datetime',
        events: {
          setExtremes: function(e) {
            if(typeof(e.rangeSelectorButton)!== 'undefined')
            {
              console.log('count: '+e.rangeSelectorButton.count + 'text: ' +e.rangeSelectorButton.text + ' type:' + e.rangeSelectorButton.type);
            }
          }
        },
      },
      yAxis : {
        opposite: false,
        labels: {
          formatter: function() {
            return this.value.toLocaleString();
          }
        }
      },
      rangeSelector: {
        adaptToUpdatedData : true,
        allButtonsEnabled: true,
        selected: 5
      },
      series: [],
      legend: {
        enabled: true,
        layout: 'vertical',
      },
      navigator: {
        enabled: false,
        categoryAxis: {
          labels: {
            enabled: false,
          }
        }
      },
      scrollbar: {
        enabled: false
      },
      responsive: {
        rules: [{
          condition: {
            //minHeight: 300
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal'
            },
            yAxis: {
              labels: {
                //align: 'left', //chart will not overlay the y axis
                x: 0,
                y: 0
              },
              title: {
                text: null
              }
            },
            subtitle: {
              text: null
            },
            credits: {
              enabled: false
            }
          }
        }]
      }
    };
  }

  showDialog(){
    const modalRef = this.modalService.open(SelectTagComponent);
    modalRef.componentInstance.name = 'World';

    modalRef.componentInstance.clickevent.subscribe(($e) => {
      console.log($e);
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //this.innerHeight = window.innerHeight - 120;
    //this.innerWidth = window.innerWidth;

    //console.log(this.innerWidth + ' ' + this.innerHeight);

    //this.chart.setSize(this.innerWidth, this.innerHeight);
  }

  saveInstance(chartInstance) {
    this.chart = chartInstance;

    this.chart.setSize(this.innerWidth, this.innerHeight - 40);
  }

  tabChanged(tabChangeEvent) {
    //console.log('tabChangeEvent => ', tabChangeEvent);
    //console.log('index => ', tabChangeEvent.index);
  }

  changeTheMoneyExchange(optionChangedEvent){
     //console.log(optionChangedEvent);
  }

}
