import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Controla qual formulário mostrar
  showRegister = false;
  
  // Dados do formulário de login
  loginData = {
    email: '',
    password: '',
    userType: 'user'
  };
  
  // Dados do formulário de cadastro
  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user'
  };
  
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
    // Validação simples
    if (!this.loginData.email || !this.loginData.password) {
      this.showMessage('Por favor, preencha todos os campos!', false);
      return;
    }

    // Simula login bem-sucedido
    // TODO: Usar Service para autenticação
    this.showMessage(`Login realizado com sucesso! Tipo: ${this.loginData.userType}`, true);
    
    // Aqui você normalmente faria uma chamada para um serviço de autenticação
    console.log('Dados de login:', this.loginData);
  }

  // Processa o cadastro
  onRegister() {
    // Validação simples
    if (!this.registerData.name || !this.registerData.email || 
        !this.registerData.password || !this.registerData.confirmPassword) {
      this.showMessage('Por favor, preencha todos os campos!', false);
      return;
    }

    // Verifica se as senhas coincidem
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.showMessage('As senhas não coincidem!', false);
      return;
    }

    // Simula cadastro bem-sucedido
    // TODO: Usar Service para cadastro de usuário
    this.showMessage('Cadastro realizado com sucesso!', true);
    
    // Volta para a tela de login após 2 segundos
    setTimeout(() => {
      this.showRegister = false;
      this.message = '';
      this.resetForms();
    }, 2000);

    // Aqui você normalmente faria uma chamada para um serviço de cadastro
    console.log('Dados de cadastro:', this.registerData);
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
    this.loginData = { email: '', password: '', userType: 'user' };
    this.registerData = { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '', 
      userType: 'user' 
    };
  }
}

