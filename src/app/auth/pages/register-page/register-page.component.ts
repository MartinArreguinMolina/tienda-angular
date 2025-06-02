import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  authService = inject(AuthService);
  router = inject(Router)
  fb = inject(FormBuilder);
  hasError = signal<boolean>(false);
  registerComplete = signal<boolean>(false);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, Validators.minLength(6)]],
  })


  onSubmit(){
    if(this.registerForm.invalid){
      this.hasError.set(true),
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000)
      return;
    }

    const {email = '', password='', fullName=''} = this.registerForm.value;

    this.authService.register(email!, password!, fullName!).subscribe((isAuthenticated) => {
      if(isAuthenticated){
        this.router.navigateByUrl('/');
        return;
      }

      this.registerComplete.set(true),
      setTimeout(() => {
        this.registerComplete.set(false)
      }, 2000)

    });
  }
}
