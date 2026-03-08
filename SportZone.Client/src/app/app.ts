import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Nav } from "./layouts/nav/nav";
import { Footer } from "./layouts/footer/footer";
import { AdminLayout } from "./layouts/admin-layout/admin-layout";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer, AdminLayout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected router = inject(Router);
}
