import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService }                    from '../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {

  productForm!: FormGroup;
  categories = ['Cat1', 'Cat2', 'Cat3'];
  isEdit = false;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private svc: ProductService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name:        ['', Validators.required],
      description: [''],
      price:       [0, [Validators.required, Validators.min(0)]],
      quantity:    [0, [Validators.required, Validators.min(0)]],
      category:    ['', Validators.required]
    });

    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.isEdit = true;
      this.svc.getById(this.id).subscribe(p => this.productForm.patchValue(p));
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;
    const prod: Product = { id: this.id, ...this.productForm.value };
    const op = this.isEdit
      ? this.svc.update(this.id, prod)
      : this.svc.create(prod);

    op.subscribe(() => this.router.navigate(['/products']));
  }
}
