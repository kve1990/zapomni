import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import { ModalDirective } from './modal/modal.directive';
import { AppService } from './app.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  entryComponents: [ModalComponent]
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild(ModalDirective, {static: true}) modal: ModalDirective;

  public events$: Observable<any[]>;
  public transform: number;
  public selectedIndex: number;
  private modalRef;
  private eventCount: number;
  private subscribtions = [];
  private interval;

  constructor(public service: AppService,
              public componentFactoryResolver: ComponentFactoryResolver) {
    this.selectedIndex = 0;
    this.transform = 100;
  }

  ngOnInit() {
    this.events$ = this.service.getEvents();
    this.subscribtions.push(this.events$.subscribe(events => {
      if (events) {
        this.eventCount = events.length;
      }
    }));
    this.autoSlide();
  }

  ngOnDestroy() {
    this.subscribtions.forEach(subr => subr.unsubscribe());
  }

  showModal(evt) {
    this.stopSlide();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
    const viewContainerRef = this.modal.viewContainerRef;
    viewContainerRef.clear();
    this.modalRef = viewContainerRef.createComponent(componentFactory);
    (this.modalRef.instance as ModalComponent).data = evt;
    this.modalRef.instance.hide.subscribe(() => this.hideModal());
  }

  hideModal() {
    this.modal.viewContainerRef.clear();
    this.autoSlide();
  }

  selected(x) {
    if (x >= this.eventCount) {
      x = 0;
    }
    this.transform =  100 - (x) * 50;
    this.selectedIndex = x;
  }

  autoSlide() {
    this.interval = setInterval(() => {
      this.selected(++this.selectedIndex);
    }, 5500);
  }

  stopSlide() {
    clearInterval(this.interval);
  }
}
