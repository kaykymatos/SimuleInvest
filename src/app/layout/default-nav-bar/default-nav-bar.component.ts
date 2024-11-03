import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-default-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './default-nav-bar.component.html',
  styleUrl: './default-nav-bar.component.scss'
})
export class DefaultNavBarComponent {

  public projectName = environment.ProjectName;
}
