import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DefaultNavBarComponent } from './layout/default-nav-bar/default-nav-bar.component';
import { DefaultFooterComponent } from './layout/default-footer/default-footer.component';
import { FormsModule } from '@angular/forms';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, DefaultNavBarComponent, DefaultFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SimuleInvest';
  public projectName = environment.ProjectName;
}
