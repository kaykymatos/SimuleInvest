import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-default-footer',
  standalone: true,
  imports: [],
  templateUrl: './default-footer.component.html',
  styleUrl: './default-footer.component.scss',
})
export class DefaultFooterComponent {
  public projectName = environment.ProjectName;
}
