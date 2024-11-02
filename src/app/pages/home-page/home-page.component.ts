import { CurrencyPipe, registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import {
  Component,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
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
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    NgxChartsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [
    CurrencyPipe,
    provideNgxMask(),
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL',
    },
  ],
  styleUrls: ['./home-page.component.scss'],
})

export class HomePageComponent implements OnInit {
  investmentForm: FormGroup = {} as FormGroup;
  results: ICalcResult | null = null;
  chartData: { name: string; series: { name: string; value: number }[] }[][] = [];
  submitted: boolean = false;
  
  constructor(private fb: FormBuilder, private currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    this.investmentForm = this.fb.group({
      initialAmount: ['', [Validators.required, Validators.min(1)]],
      monthlyContribution: ['', [Validators.required, Validators.min(1)]],
      interestRate: ['', [Validators.required, Validators.min(1)]],
      duration: ['', [Validators.required, Validators.min(1)]],
    });
  }

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

  get initialAmountInput() {
    return this.investmentForm.get('initialAmount');
  }

  get monthlyContributionInput() {
    return this.investmentForm.get('monthlyContribution');
  }

  get interestRateInput() {
    return this.investmentForm.get('interestRate');
  }

  get durationInput() {
    return this.investmentForm.get('duration');
  }

  onSubmit() {
    this.submitted = true;
    if (this.investmentForm?.valid) {
      const { initialAmount, monthlyContribution, interestRate, duration } =
        this.investmentForm.value;

      this.results = this.calculateInvestment(
        initialAmount,
        monthlyContribution,
        interestRate,
        duration
      );
      let anos = 0;
      for (let i = 0; i < this.results.monthlyBalances.length; i += 12) {
        const chunk = this.results.monthlyBalances.slice(i, i + 12);
        anos++;
        this.chartData.push([
          {
            name: `Gráfico ${Math.floor(i / 12) + 1}`,
            series: chunk.map((balance, index) => ({
              name: `Mês ${index + 1}`,
              value: balance.amount ?? 0,
            })),
          },
        ]);
      }
    }
  }

  resetForm() {
    this.investmentForm?.reset();
    this.results = null;
    this.chartData = [];
    this.submitted = false;
  }

  openModal(title: string, text: HTMLParagraphElement) {
    Swal.fire({
      icon: 'info',
      title: title,
      text: text.textContent?.toString(),
    });
  }
}
