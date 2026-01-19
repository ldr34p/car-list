import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  sold: boolean;
};

type Filter = 'All' | 'Available' | 'Sold';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-list.html',
  styleUrls: ['./car-list.css'],
})
export class CarListComponent {
  private readonly storageKey = 'car_list_items_v1';

  brand = '';
  model = '';
  year = new Date().getFullYear();
  color = '';

  cars: Car[] = [];
  filter: Filter = 'All';
  errorMsg = '';

  constructor() {
    this.cars = this.loadCars();
  }

  private loadCars(): Car[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Car[];
      if (!Array.isArray(parsed)) return [];
      return parsed.map((c) => ({
        id: Number(c.id),
        brand: String(c.brand ?? ''),
        model: String(c.model ?? ''),
        year: Number(c.year),
        color: String(c.color ?? ''),
        sold: Boolean(c.sold),
      }));
    } catch {
      return [];
    }
  }

  private saveCars(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cars));
  }

  get filteredCars(): Car[] {
    if (this.filter === 'Available') return this.cars.filter((c) => !c.sold);
    if (this.filter === 'Sold') return this.cars.filter((c) => c.sold);
    return this.cars;
  }

  get totalCount(): number {
    return this.cars.length;
  }
  get availableCount(): number {
    return this.cars.filter((c) => !c.sold).length;
  }
  get soldCount(): number {
    return this.cars.filter((c) => c.sold).length;
  }

  addCar(): void {
    this.errorMsg = '';

    const brand = this.brand.trim();
    const model = this.model.trim();
    const color = this.color.trim();
    const year = Number(this.year);

    if (!brand || !model || !color || !Number.isFinite(year)) {
      this.errorMsg = 'Please fill in Brand, Model, Year, and Color.';
      return;
    }

    const maxYear = new Date().getFullYear() + 1;
    if (year < 1950 || year > maxYear) {
      this.errorMsg = `Year must be between 1950 and ${maxYear}.`;
      return;
    }

    const newCar: Car = {
      id: Date.now(),
      brand,
      model,
      year,
      color,
      sold: false,
    };

    this.cars = [newCar, ...this.cars];
    this.saveCars();

    this.brand = '';
    this.model = '';
    this.year = new Date().getFullYear();
    this.color = '';
  }

  toggleSold(id: number): void {
    this.cars = this.cars.map((c) => (c.id === id ? { ...c, sold: !c.sold } : c));
    this.saveCars();
  }

  deleteCar(id: number): void {
    this.cars = this.cars.filter((c) => c.id !== id);
    this.saveCars();
  }

  clearGarage(): void {
    this.cars = [];
    localStorage.removeItem(this.storageKey);
  }

  setFilter(filter: Filter): void {
    this.filter = filter;
  }

  trackById(_: number, car: Car): number {
    return car.id;
  }
}

