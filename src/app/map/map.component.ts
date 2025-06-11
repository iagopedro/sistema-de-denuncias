import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../shared/user.service';
import * as L from 'leaflet';

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
export class MapComponent implements AfterViewInit, OnDestroy {
  constructor(private router: Router) {
    // Verifica se o usuário está logado
    if (!localStorage.getItem('usuarioLogado')) {
      // Exibe alerta de acesso negado
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Você precisa estar logado para acessar esta página.',
        icon: 'error',
        confirmButtonText: 'Fazer Login',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redireciona para a página de login se não estiver logado
          this.router.navigate(['/login']);
        }
      });
    }
  }
  // Recupera o usuário logado do localStorage
  user: User = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

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

    // Remove marcador temporário, se existir
    if (this.newComplaintMarker) {
      this.map.removeLayer(this.newComplaintMarker);
      this.newComplaintMarker = null;
    }
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
    // Cria a nova denúncia usando as coordenadas do clique
    const newComplaint: Complaint = {
      id: (this.complaints.length + 1).toString(),
      title: this.newComplaint.title,
      type: this.newComplaint.type,
      description: this.newComplaint.description,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Pendente',
      urgency: this.newComplaint.urgency,
      lat: this.newComplaintCoords
        ? this.newComplaintCoords.lat
        : this.defaultLocation[0],
      lng: this.newComplaintCoords
        ? this.newComplaintCoords.lng
        : this.defaultLocation[1],
    };

    // Adiciona a denúncia à lista
    this.complaints.push(newComplaint);

    // Remove o marcador temporário se existir
    if (this.newComplaintMarker) {
      this.map.removeLayer(this.newComplaintMarker);
      this.newComplaintMarker = null;
    }

    // Adiciona um marcador permanente para a nova denúncia
    this.addComplaintMarker(newComplaint);

    // Fecha o popup e reseta os valores
    this.closeNewComplaintPopup();
    this.newComplaintCoords = null;

    // Mostra mensagem de sucesso
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
    Swal.fire({
      title: 'Logout',
      text: 'Você tem certeza que deseja sair?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Limpa o usuário logado do localStorage
        localStorage.removeItem('usuarioLogado');
        // Redireciona para a página de login
        this.router.navigate(['/login']);
      }
    });
  }

  // PROPRIEDADES E MÉTODOS DO LEAFLET

  // Nova propriedade para armazenar as coordenadas do clique
  newComplaintCoords: { lat: number; lng: number } | null = null;
  private newComplaintMarker: L.Marker | null = null;

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private defaultLocation: [number, number] = [-8.048464225345178, -34.8950671846564]; // Endereço da Fuctura

  ngAfterViewInit(): void {
    this.initializeMap();
    this.setupMapEvents();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    // Configurar ícones padrão do Leaflet
    this.configureDefaultIcons();

    // Criar o mapa
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.defaultLocation,
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    });

    // Adicionar camada de tiles
    this.addTileLayer();
  }

  private configureDefaultIcons(): void {
    // Corrigir problema dos ícones do Leaflet
    const iconDefault = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = iconDefault;
  }

  private addTileLayer(): void {
    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 1,
    }).addTo(this.map);
  }

  private setupMapEvents(): void {
    // Evento de clique para abrir o popup de nova denúncia
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      // Previne que o clique em marcadores inicie nova denúncia
      if (
        (e.originalEvent.target as HTMLElement).classList.contains('map-marker')
      ) {
        return;
      }

      // Armazena as coordenadas do clique e adiciona/atualiza o marcador temporário
      const { lat, lng } = e.latlng;
      this.newComplaintCoords = { lat, lng };

      if (this.newComplaintMarker) {
        this.map.removeLayer(this.newComplaintMarker);
      }
      this.newComplaintMarker = L.marker([lat, lng]).addTo(this.map);

      // Exibe o popup de nova denúncia
      this.showNewComplaintPopup = true;
    });
  }

  // Métodos públicos para controles
  zoomIn(): void {
    this.map.zoomIn();
  }

  zoomOut(): void {
    this.map.zoomOut();
  }

  centerMap(): void {
    this.map.setView(this.defaultLocation, 13);
  }

  clearMarkers(): void {
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  // Novo método para adicionar marcador permanente a partir de uma denúncia
  private addComplaintMarker(complaint: Complaint): void {
    const marker = L.marker([complaint.lat, complaint.lng]).addTo(this.map);

    // Ao clicar no marcador, exibe o popup de detalhes e garante que o popup de nova denúncia seja oculto
    marker.on('click', (e: L.LeafletMouseEvent) => {
      e.originalEvent.stopPropagation();
      this.selectedComplaint = complaint;
      this.showDetailsPopup = true;
      this.showNewComplaintPopup = false;
    });

    this.markers.push(marker);
  }
}
