import { offersModel } from '../offers.model';
import { Component, Input, OnInit } from '@angular/core';
import SwiperCore, { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent implements OnInit {
  @Input() houses: offersModel;

  constructor() { }

  ngOnInit() {}

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 5,
    navigation: false,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };
  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }

}
