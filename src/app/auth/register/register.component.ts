import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  loading = false;
  errorMsg = '';
  roles = ['Administrador','Empleado'
  //  ,'Supervisor'
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.loading = true;
    const { username, password, role } = this.registerForm.value;
    this.auth.register(username, password, role)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          console.log('Registro OK');
          this.router.navigate(['/login']);
        },
        error: () => {
          console.error('Error al registrar');
          this.errorMsg = 'No se pudo registrar. Intenta nuevamente.';
        }
      });
  }


}
