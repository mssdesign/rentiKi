import { offersModel } from '../offers.model';
import { Component, Input, OnInit } from '@angular/core';
import SwiperCore, { SwiperOptions, Pagination, Navigation } from 'swiper';

SwiperCore.use([Pagination, Navigation]);

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
    pagination: true,
    scrollbar: true,
    navigation: true, 
    loop: true,
  };

}

//Para fazer funcionar o pagination e o navigation foi preciso importar stilos pro global.scss
