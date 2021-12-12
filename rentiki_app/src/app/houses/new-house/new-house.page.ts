import { HousesService } from './../houses.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-house',
  templateUrl: './new-house.page.html',
  styleUrls: ['./new-house.page.scss'],
})
export class NewHousePage implements OnInit {
  @ViewChild('tel', { read: ElementRef, static: false }) tel: ElementRef;
  @ViewChild('price', { read: ElementRef, static: false }) price: ElementRef;
  form: FormGroup;
  radioGroupValue: string = 'sell';
  whatsappNum: number;

  constructor(private housesService: HousesService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      contract: new FormControl({
        value: this.radioGroupValue,
        disabled: false,
      }),
      contact: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      price: new FormControl(null, {
        updateOn: 'submit',
        validators: [Validators.required],
      }),
      whatsapp: new FormControl(null, {
        updateOn: 'blur',
      }),
    });
  }

  radioGroupChange(e: any) {
    this.radioGroupValue = e.detail.value;
  }

  maskNumber(phone: any) {
    let number = phone;
    number = number.replace(/\D/gi, ''); //Retirando caracteres que não são números
    this.whatsappNum = number;
    number = number.replace(/^(\d{2})(\d)/g, '($1) $2'); //Separando DDD do resto do número com parênteses
    number = number.replace(/(\d)(\d{4})$/, '$1-$2'); //Colocando hífen entre os 4 ou 5 primeiros números
    this.tel.nativeElement.value = number;
  }

  maskPrice(price: any) {
    let value = price;
    value = value.replace(/\D/gi, '');
    this.price.nativeElement.value = `R$ ${value}`;
  }

  onCreateOffer() {
    if (this.form.status !== 'VALID') {
      return;
    }

    return this.housesService
      .addHouses(
        this.form.value.contract,
        this.form.value.title,
        this.form.value.description,
        this.form.value.price,
        this.form.value.contact,
        this.form.value.whatsapp,
        this.form.value.location
      )
      .subscribe(() => {
        this.form.reset();
        this.router.navigateByUrl('/houses');
      });
  }
}
