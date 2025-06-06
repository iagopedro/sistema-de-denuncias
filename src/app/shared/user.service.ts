import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  userType: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersUrl = 'assets/data/users.json';
  private users: User[] = [];

  constructor(private http: HttpClient) { 
    this.loadUsers();
  }

  private loadUsers(): void {
    this.http.get<User[]>(this.usersUrl).subscribe({
      next: data => this.users = data,
      error: err => console.error('Erro ao carregar usuários:', err)
    });
  }

  login(email: string, password: string): Observable<User | null> {
    // Procura pelo usuário na "base de dados"
    const user = this.users.find(u => u.email === email && u.password === password);
    return of(user || null);
  }

  register(newUser: Omit<User, 'id'>): Observable<boolean> {
    const exists = this.users.some(u => u.email === newUser.email);

    if(exists) {
      return of(false);
    }

    // Estratégia para geração do ID do usuário
    const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    const user: User = { id: newId, ...newUser };

    this.users.push(user);

    return of(true);
  }
}
