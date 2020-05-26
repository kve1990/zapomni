import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input() data: any;
  @Output() hide: EventEmitter<void>;

  constructor(public service: AppService) {
    this.hide = new EventEmitter();
  }

  close() {
    this.hide.emit();
  }

}
