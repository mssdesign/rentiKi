import { offersModel } from '../offers.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import SwiperCore, { Swiper, Virtual, SwiperOptions, Pagination, Navigation } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Pagination, Navigation, Virtual]);

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent implements OnInit {
  @Input() houses: offersModel;
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  constructor() { }

  ngOnInit() {}

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 5,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    navigation: true
  };

  slideNext() {
    this.swiper.swiperRef.slideNext(500);
  }

  slidePrev() {
    this.swiper.swiperRef.slidePrev(500);
  }

}
