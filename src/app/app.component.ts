import { Component, HostListener, EventEmitter, Input, Output , OnInit, OnDestroy } from '@angular/core';
import { GridsterConfig, GridsterItem }  from 'angular-gridster2';

import { NgRedux } from '@angular-redux/store'; 
import { CounterActions } from './app.actions'; 
import {IAppState} from "./store"; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'app';
  width = window.innerWidth / 2;
  height = (window.innerHeight - 150)/2;

  options: GridsterConfig;
  dashboard: Array<GridsterItem>;

  @Output() sizeChange = new EventEmitter<number>();

  count: number; 
  subscription;

  constructor(private ngRedux: NgRedux<IAppState>, 
    private actions: CounterActions){
      this.subscription = ngRedux.select<number>('count')
      .subscribe(newCount => this.count = newCount);   
  }

  ngOnDestroy() {                    
    this.subscription.unsubscribe(); 
  } 

  increment() {
    this.ngRedux.dispatch(this.actions.increment()); 
  }

  decrement() {
    this.ngRedux.dispatch(this.actions.decrement()); 
  }

  static eventStop(item, itemComponent, event) {
    console.info('eventStop', item, itemComponent, event);
  }

  static itemChange(item, itemComponent) {
    console.info('itemChanged', item, itemComponent);
  }

  static itemResize(item, itemComponent) {
    console.info('itemResized', item, itemComponent);
    item.height = itemComponent.height;
    item.width =  itemComponent.width;
  }

  static itemInit(item, itemComponent) {
    console.info('itemInitialized', item, itemComponent);
  }

  static itemRemoved(item, itemComponent) {
    console.info('itemRemoved', item, itemComponent);
  }

  emptyCellClick(event, item) {
    console.info('empty cell click', event, item);
    this.dashboard.push(item);
  }

  ngOnInit() {
    this.options = {
      gridType: 'fit',
      compactType: 'none',
      itemChangeCallback: AppComponent.itemChange,
      itemResizeCallback: AppComponent.itemResize,
      itemInitCallback: AppComponent.itemInit,
      itemRemovedCallback: AppComponent.itemRemoved,
      margin: 5,
      outerMargin: true,
      mobileBreakpoint: 640,
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      emptyCellClickCallback: this.emptyCellClick.bind(this),
      emptyCellContextMenuCallback: this.emptyCellClick.bind(this),
      emptyCellDropCallback: this.emptyCellClick.bind(this),
      emptyCellDragCallback: this.emptyCellClick.bind(this),
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      draggable: {
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: false,
        dragHandleClass: 'drag-handler',
        stop: AppComponent.eventStop
      },
      resizable: {
        delayStart: 0,
        enabled: true,
        stop: AppComponent.eventStop,
        handles: {
          s: true,
          e: true,
          n: true,
          w: true,
          se: true,
          ne: true,
          sw: true,
          nw: true
        }
      },
      api: {
        resize: AppComponent.eventStop,
        optionsChanged: AppComponent.eventStop,
        getNextPossiblePosition: AppComponent.eventStop,
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: {north: true, east: true, south: true, west: true},
      pushResizeItems: false,
      displayGrid: 'onDrag&Resize',
      disableWindowResize: false
    };

    this.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0},
      {cols: 2, rows: 2, y: 0, x: 2, hasContent: true},
      {cols: 1, rows: 1, y: 0, x: 4},
      {cols: 1, rows: 1, y: 2, x: 5},
      {cols: undefined, rows: undefined, y: 1, x: 0},
      {cols: 1, rows: 1, y: undefined, x: undefined},
      {cols: 2, rows: 2, y: 3, x: 5, minItemRows: 2, minItemCols: 2, label: 'Min rows & cols = 2'},
      {cols: 2, rows: 2, y: 2, x: 0, maxItemRows: 2, maxItemCols: 2, label: 'Max rows & cols = 2'},
      {cols: 2, rows: 1, y: 2, x: 2, dragEnabled: true, resizeEnabled: true, label: 'Drag&Resize Enabled'},
      {cols: 1, rows: 1, y: 2, x: 4, dragEnabled: false, resizeEnabled: false, label: 'Drag&Resize Disabled'},
      {cols: 1, rows: 1, y: 2, x: 6, initCallback: AppComponent.itemInit}
    ];
  }

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    this.dashboard.push({});
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

  }
}
