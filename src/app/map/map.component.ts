import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Complaint {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  status: string;
  urgency: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  // Propriedades do componente
  userName = 'João Silva';

  // Controle dos popups
  showNewComplaintPopup = false;
  showDetailsPopup = false;

  // Denúncia selecionada
  selectedComplaint: Complaint | null = null;

  // Nova denúncia sendo criada
  newComplaint = {
    type: '',
    title: '',
    description: '',
    urgency: 'media',
  };

  // Lista de denúncias existentes
  complaints: Complaint[] = [
    {
      id: '1',
      title: 'Buraco na Rua das Flores',
      type: 'infraestrutura',
      description:
        'Grande buraco na via principal causando transtornos ao trânsito.',
      date: '15/05/2024',
      status: 'Pendente',
      urgency: 'Alta',
      lat: 30,
      lng: 25,
    },
    {
      id: '2',
      title: 'Lixo Acumulado na Praça',
      type: 'limpeza',
      description: 'Acúmulo de lixo na praça central há mais de uma semana.',
      date: '14/05/2024',
      status: 'Em Andamento',
      urgency: 'Média',
      lat: 60,
      lng: 70,
    },
    {
      id: '3',
      title: 'Calçada Quebrada',
      type: 'infraestrutura',
      description:
        'Calçada com buracos e pedras soltas, oferecendo risco aos pedestres.',
      date: '13/05/2024',
      status: 'Resolvida',
      urgency: 'Baixa',
      lat: 80,
      lng: 40,
    },
  ];

  // Método para clique no mapa
  onMapClick(event: MouseEvent) {
    event.stopPropagation();

    // Previne que o clique em marcadores abra o popup de nova denúncia
    if ((event.target as HTMLElement).classList.contains('map-marker')) {
      return;
    }

    this.showNewComplaintPopup = true;
  }

  // Método para mostrar detalhes da denúncia
  showComplaintDetails(event: MouseEvent, complaint: Complaint) {
    event.stopPropagation();
    this.selectedComplaint = complaint;
    this.showDetailsPopup = true;
  }

  // Método para fechar popup de nova denúncia
  closeNewComplaintPopup() {
    this.showNewComplaintPopup = false;
    this.resetNewComplaint();
  }

  // Método para fechar popup de detalhes
  closeDetailsPopup() {
    this.showDetailsPopup = false;
    this.selectedComplaint = null;
  }

  // Método para fechar popup ao clicar fora
  closePopupIfOutside(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      if (this.showNewComplaintPopup) {
        this.closeNewComplaintPopup();
      }
      if (this.showDetailsPopup) {
        this.closeDetailsPopup();
      }
    }
  }

  // Método para submeter nova denúncia
  submitComplaint() {
    // Criar nova denúncia
    const newComplaint: Complaint = {
      id: (this.complaints.length + 1).toString(),
      title: this.newComplaint.title,
      type: this.newComplaint.type,
      description: this.newComplaint.description,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Pendente',
      urgency: this.newComplaint.urgency,
      lat: Math.random() * 80 + 10, // Posição aleatória no mapa
      lng: Math.random() * 80 + 10,
    };

    // Adicionar à lista
    this.complaints.push(newComplaint);

    // Fechar popup
    this.closeNewComplaintPopup();

    // Mostrar mensagem de sucesso
    alert('Denúncia registrada com sucesso!');
  }

  // Método para resetar formulário
  resetNewComplaint() {
    this.newComplaint = {
      type: '',
      title: '',
      description: '',
      urgency: 'media',
    };
  }

  // Método para obter label do tipo de denúncia
  getComplaintTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      infraestrutura: 'Infraestrutura',
      limpeza: 'Limpeza Urbana',
      iluminacao: 'Iluminação Pública',
      transito: 'Trânsito',
      outros: 'Outros',
    };
    return types[type] || type;
  }

  // Método para logout
  logout() {
    if (confirm('Deseja realmente sair?')) {
      // Aqui você implementaria a lógica de logout
      console.log('Logout realizado');
    }
  }
}
