import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // Controla qual formulário mostrar
  showRegister = false;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      userType: ['user'],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      userType: ['user'],
    });
  }

  // Mensagem de feedback
  message = '';
  isSuccess = false;

  // Alterna entre login e cadastro
  toggleForm() {
    this.showRegister = !this.showRegister;
    this.message = ''; // Limpa mensagens
  }

  // Processa o login
  onLogin() {
    if (this.loginForm.invalid) {
      this.showMessage(`Por favor, preencha os dados corretamente!`, false);
      this.loginForm.markAllAsTouched();
      return;
    }
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.userService.login(email, password).subscribe((user) => {
      if (user) {
        this.showMessage(
          `Login realizado com sucesso! Tipo: ${user.userType}`,
          true
        );
        this.router.navigate(['/map']);
        localStorage.setItem("usuarioLogado", JSON.stringify(user));
      } else {
        this.showMessage('Email ou senha inválidos!', false);
      }
    });
  }

  // Processa o cadastro
  onRegister() {
    // TODO: verificar se o Form está inválido
    if (this.registerForm.invalid) {
      this.showMessage(`Por favor, preencha os dados corretamente!`, false);
      this.loginForm.markAllAsTouched();
      return;
    }
    // Verifica se as senhas coincidem
    if (
      this.registerForm.get('password')?.value !==
      this.registerForm.get('confirmPassword')?.value
    ) {
      this.showMessage('As senhas não coincidem!', false);
      return;
    }

    const newUser = {
      name: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      userType: this.registerForm.get('userType')?.value,
    };

    this.userService.register(newUser).subscribe(isUserCreated => {
      if (isUserCreated) {
        console.log(isUserCreated);
        this.showMessage('Cadastro realizado com sucesso!', true);

        // Volta para a tela de login após 2 segundos
        setTimeout(() => {
          this.showRegister = false;
          this.message = '';
          this.resetForms();
        }, 2000);
      } else {
        this.showMessage('Email já está em uso!', false);        
      }
    });
  }

  // Exibe mensagem de feedback
  private showMessage(text: string, success: boolean) {
    this.message = text;
    this.isSuccess = success;

    // Remove a mensagem após 5 segundos
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  // Limpa os formulários
  private resetForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      userType: ['user'],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      userType: ['user'],
    });
  }
}
