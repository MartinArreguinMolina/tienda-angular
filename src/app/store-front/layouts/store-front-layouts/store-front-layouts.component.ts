import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavBarComponent } from "../../components/front-nav-bar/front-nav-bar.component";

@Component({
  selector: 'app-store-front-layouts',
  imports: [RouterOutlet, FrontNavBarComponent],
  templateUrl: './store-front-layouts.component.html',
  styleUrl: './store-front-layouts.component.css',
})
export class StoreFrontLayoutsComponent { }
