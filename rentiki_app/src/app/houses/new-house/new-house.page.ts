import { HousesService } from './../houses.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

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
    this.price.nativeElement.value = value;
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

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }
}
