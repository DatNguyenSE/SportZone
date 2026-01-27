import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Nav } from "./features/nav/nav";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected router = inject(Router);
}
