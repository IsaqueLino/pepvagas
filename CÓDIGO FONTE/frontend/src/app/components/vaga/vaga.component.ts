import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vaga',
  templateUrl: './vaga.component.html',
  styleUrls: ['./vaga.component.scss'],
})
export class VagaComponent  implements OnInit {

  @Input() titulo: string = ''
  @Input() cidade: string = ''
  @Input() regime: string = ''
  @Input() pcd: string = ''
  @Input() salario: string = ''
  @Input() tipo: string = ''
  @Input() data: string = ''
  @Input() logo: any
  @Input() empresa: string = ''
  @Input() ocultarNome: string = 'N';
  public tempoRestante = ''

  constructor() {
      
   }

  ngOnInit() {
    if(this.pcd == '1'){
      this.pcd = 'PCD'
    }else{
      this.pcd = ''
    }

    const hoje = new Date()
    const dataLimite = new Date(this.data)
    
    const diff = this.calculateDiff(hoje, dataLimite)

    if(diff == 1){
      this.data = "Expira em 1 dia"
    } else if(diff == 0){
      this.data = "Expira hoje"
    }else if (diff < 0){
      this.data = "Expirou"
    }else{
      this.data = "Expira em " + diff + " dias"
    }

    if(this.logo == 'vaga-logopadrao.svg'){
      this.logo = '/assets/confidencial.png'
    }else{
      this.logo =  environment.API+'/images/'+this.logo
    }



    this.salario = Intl.NumberFormat('pt-BR',{
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(this.salario))

  }

  private calculateDiff(hoje: Date, limite: Date){

    const diffInMs   = hoje.getTime() > limite.getTime() ? (limite.getTime() - hoje.getTime()) : (limite.getTime() - hoje.getTime())
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays
  }

  private getDaysInMonth(month: any, year: any){
    return new Date(year, month, 0).getDate();
  }

}
