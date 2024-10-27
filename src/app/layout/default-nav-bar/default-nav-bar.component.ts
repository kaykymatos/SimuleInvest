import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-default-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './default-nav-bar.component.html',
  styleUrl: './default-nav-bar.component.scss'
})
export class DefaultNavBarComponent {

  public projectName = environment.ProjectName;
}
