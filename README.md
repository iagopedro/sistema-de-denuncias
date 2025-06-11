# Sistema de Denúncias

Este projeto é uma aplicação web desenvolvida em Angular que permite aos usuários registrar denúncias por meio de um mapa interativo. Nele, os usuários podem:

- Fazer login e cadastro.
- Visualizar denúncias através de marcadores num mapa.
- Registrar novas denúncias clicando em pontos específicos do mapa.
- Exibir detalhes das denúncias ao clicar nos marcadores.

## Funcionalidades

- **Autenticação**: Login e cadastro de usuários.
- **Mapa Interativo**: Implementado com [Leaflet](https://leafletjs.com/), possibilitando a navegação e o registro de denúncias.
- **Registro de Denúncias**: Ao clicar (com o botão esquerdo) em um ponto do mapa, o usuário pode abrir um popup para registrar uma nova denúncia.
- **Detecção de Detalhes**: Clicando nos marcadores já existentes, o usuário pode visualizar informações detalhadas sobre cada denúncia.

## Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)

## Instalação e Desenvolvimento

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**

   ```bash
   ng serve
   ```

   Acesse `http://localhost:4200/` no seu navegador. O aplicativo recarrega automaticamente ao salvar alterações nos arquivos.

## Estrutura do Projeto

- **/src/app/login**: Componentes e serviços para autenticação (login/cadastro).
- **/src/app/map**: Componentes responsáveis pela visualização e interação com o mapa usando Leaflet.
- **/src/app/shared**: Serviços compartilhados, como o `UserService` para gerenciamento de usuários.

## Personalizações do Projeto

- **Interatividade com o Mapa**:  
  O mapa foi configurado para que o registro de denúncias ocorra por meio de cliques (botão esquerdo) e a navegação com o botão do meio (clique e arraste).
  
- **Marcação de Denúncias**:  
  As denúncias são representadas por marcadores permanentes. Ao clicar em um ponto do mapa, é exibido um popup de nova denúcia, que gera um marcador após o registro. Ao clicar no marcador, um popup de detalhes é exibido.

## Recursos Adicionais

- [Documentação Angular CLI](https://angular.io/cli)
- [Documentação Leaflet](https://leafletjs.com/)

OBS.: Sobre os detalhes da implementação do Leaflet, veja esse link: https://iagopedro.notion.site/Implementa-o-do-Leaflet-20ebed0303bd80bcb3edc61fd76ddea5?source=copy_link

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
