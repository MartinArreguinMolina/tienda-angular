import { Component, computed, input, linkedSignal } from '@angular/core';
import { FrontNavBarComponent } from '../../../store-front/components/front-nav-bar/front-nav-bar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  currentPage = input<number>(1);
  pgaes = input(0);
  activatedPage = linkedSignal(this.currentPage);


  getPagesList = computed(() => {
    return Array.from({length: this.pgaes()}, (_, i) => i + 1);
  })
}
