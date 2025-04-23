import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from '../models/product.model';
import { ProductService }     from '../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit,AfterViewInit {

  displayedColumns = ['name','description','price','quantity','category','actions'];
  dataSource       = new MatTableDataSource<Product>([]);
  categories: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private svc: ProductService) {}

  ngOnInit() {
    this.load();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  load() {
    this.svc.getAll().subscribe(prods => {
      this.dataSource.data = prods;
      this.categories = Array.from(new Set(prods.map(p => p.category)));
    });
  }

  applyFilter(val: string) { this.dataSource.filter = val.trim().toLowerCase(); }
  filterByCategory(cat: string) { this.dataSource.filter = cat.trim().toLowerCase(); }

  delete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }

}
