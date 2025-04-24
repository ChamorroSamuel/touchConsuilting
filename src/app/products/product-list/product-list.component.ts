import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from '../models/product.model';
import { ProductService }     from '../services/product.service';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  dataSource!: MatTableDataSource<Product>;
  displayedColumns = ['name','price','quantity','category','actions'];
  categories: string[] = [];
  products: Product[]  = [];
  userRole!: string | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private svc: ProductService,
    private auth: AuthService,
    private router: Router
  ) {
    const u = this.auth.getUser();
    this.userRole = u?.role ?? null;
  }

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll() {
    this.svc.getAll().subscribe(prods => {
      this.products = prods;
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.paginator = this.paginator;
      this.categories = Array.from(new Set(prods.map(p => p.category)));
    });
  }

  applyFilter(val: string) {
    this.dataSource.filter = val.trim().toLowerCase();
  }

  filterByCategory(cat: string) {
    this.dataSource.data = cat
      ? this.products.filter(p => p.category === cat)
      : this.products;
  }

  onEdit(id: string) {
    if (this.userRole !== 'Administrador') {
      alert('No tienes permisos para editar productos.');
      return;
    }
    this.router.navigate(['/products/edit', id]);
  }

  onDelete(id: string) {
    if (this.userRole !== 'Administrador') {
      alert('No tienes permisos para eliminar productos.');
      return;
    }
    // confirm dialog (opcional)
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    this.svc.delete(id).subscribe({
      next: () => this.loadAll(),
      error: err => console.error(err)
    });
  }
}
