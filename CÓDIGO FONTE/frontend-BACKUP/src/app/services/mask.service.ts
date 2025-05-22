import { Injectable } from '@angular/core';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';

@Injectable({
  providedIn: 'root',
})
export class MaskService {

  readonly emailMask : MaskitoOptions = {
    mask: [ '.+@.+' ]

  };
  readonly cpfMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  };

  readonly cepMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
  };

readonly salaryMask: MaskitoOptions = {
  //apenas limitar o numero de digitos a 9
  mask: ['R$', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/,/\d/,/\d/, ',',/\d/, /\d/],
};

readonly numberMask: MaskitoOptions = {
  //limitar numero da residencia a 8 digitos
  mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
};
  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly cnpjMask: MaskitoOptions = {
    mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  };

  readonly predicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();
}
