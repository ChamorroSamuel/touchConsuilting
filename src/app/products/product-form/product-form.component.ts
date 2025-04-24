import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService }                    from '../services/product.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {

  productForm!: FormGroup;
  isEdit = false;
  private id!: string;
  categories = [
    'Categoria 1',
    'Categoria 2',
    'Categoria 3',
    'Categoria 4'
  ];
  userRole: string | null;

  constructor(
    private fb: FormBuilder,
    private svc: ProductService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const u = this.auth.getUser();
    this.userRole = u ? u.role : null;
  }

  ngOnInit(): void {
    const maybeId = this.route.snapshot.paramMap.get('id');
    if (maybeId && this.userRole !== 'Administrador') {
      this.router.navigate(['/products']);
      return;
    }

    this.productForm = this.fb.group({
      name:        ['', Validators.required],
      description: [''],
      price:       [0, [Validators.required, Validators.min(0)]],
      quantity:    [0, [Validators.required, Validators.min(0)]],
      category:    ['', Validators.required]
    });

    if (maybeId) {
      this.isEdit = true;
      this.id = maybeId;
      this.svc.getById(this.id).subscribe(prod => {
        this.productForm.patchValue({
          name:        prod.name,
          description: prod.description,
          price:       prod.price,
          quantity:    prod.quantity,
          category:    prod.category
        });
      });
    }
  }

  onSubmit(): void {
    if (this.userRole !== 'Administrador') {
      alert('No tienes permisos para ' + (this.isEdit ? 'editar' : 'crear') + ' productos.');
      return;
    }

    if (this.productForm.invalid) {
      return;
    }

    const dto = this.productForm.value as Product;

    if (this.isEdit) {
      this.svc.update(this.id, dto).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err: any) => console.error(err)
      });
    } else {
      this.svc.create(dto).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err: any) => console.error(err)
      });
    }
  }


  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
