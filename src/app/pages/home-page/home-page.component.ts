import { CurrencyPipe, registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { Component, DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';

interface ICalcResult {
  total: number;
  monthlyBalances: { month: number; amount: number }[];
}

registerLocaleData(ptBr);

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  imports: [FormsModule, CurrencyPipe, NgxChartsModule],
  providers: [
    CurrencyPipe,
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL',
    },
  ],
  styleUrls: ['./home-page.component.scss'], // Corrigido para styleUrls
})
export class HomePageComponent {
  public projectName = environment.ProjectName;

  constructor(private decimalPipe: CurrencyPipe) {}

  errors: { [key: string]: string } = {};
  initialAmount: number = 0;
  monthlyContribution: number = 0;
  interestRate: number = 0;
  duration: number = 0;
  results: ICalcResult | null = null;
  chartData: { name: string; series: { name: string; value: number }[] }[] = [];

  calculateInvestment(
    initialAmount: number,
    monthlyContribution: number,
    interestRate: number,
    duration: number
  ): ICalcResult {
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = duration * 12;

    let totalAmount = initialAmount;
    const monthlyBalances: { month: number; amount: number }[] = [];

    for (let month = 1; month <= totalMonths; month++) {
      totalAmount = totalAmount * (1 + monthlyRate) + monthlyContribution;
      monthlyBalances.push({ month, amount: totalAmount });
    }

    return {
      total: totalAmount,
      monthlyBalances,
    };
  }

  formValidation() {
    this.errors = {};

    if (this.initialAmount === null || this.initialAmount <= 0) {
      this.errors['initialAmount'] = 'O valor inicial deve ser maior que zero.';
    }
    if (this.monthlyContribution === null || this.monthlyContribution < 0) {
      this.errors['monthlyContribution'] =
        'O aporte mensal não pode ser negativo.';
    }
    if (this.interestRate === null || this.interestRate <= 0) {
      this.errors['interestRate'] = 'A taxa de juros deve ser maior que zero.';
    }
    if (this.duration === null || this.duration <= 0) {
      this.errors['duration'] = 'A duração deve ser maior que zero.';
    }

    if (Object.keys(this.errors).length > 0) {
      return;
    }
  }

  onSubmit() {
    this.formValidation();
    this.results = this.calculateInvestment(
      this.initialAmount,
      this.monthlyContribution,
      this.interestRate,
      this.duration
    );

    this.chartData = [
      {
        name: 'Investimento',
        series:
          this.results?.monthlyBalances.map((balance) => ({
            name: `Mês ${balance.month}`,
            value: balance.amount ?? 0,
          })) || [],
      },
    ];
  }

  resetForm() {
    this.initialAmount = 0;
    this.monthlyContribution = 0;
    this.interestRate = 0;
    this.duration = 0;
    this.results = null;
    this.chartData = [];
  }

  formatCurrency(value: number): string | null {
    return this.decimalPipe.transform(value);
  }

  openModal(title:string, text:HTMLParagraphElement){
    Swal.fire({
      icon: "info",
      title: title,
      text: text.textContent?.toString()
    });
  }
}
