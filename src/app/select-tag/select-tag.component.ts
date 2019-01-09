import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-tag',
  templateUrl: './select-tag.component.html',
  styleUrls: ['./select-tag.component.css']
})
export class SelectTagComponent implements OnInit {
  @Input() selectedInputTags : any;

  @Output() selectedOuputTags = new EventEmitter<any>();

  @Input() name;

  @Output() clickevent = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {

  }

  finishSelectingTags(){
    this.selectedOuputTags.emit(this.selectedInputTags);
  }

  testclick(teststring: string) {
    this.clickevent.emit(teststring);
  }

}
