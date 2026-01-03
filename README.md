# Face Recognition App - Sistema de Autenticação Biométrica

<p align="center">
  <img src="https://raw.githubusercontent.com/Kauanrodrigues01/Kauanrodrigues01/refs/heads/main/images/projetos/face-recognition-app/face-recognition-app.png" alt="Dashboard" width="700"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Kauanrodrigues01/Kauanrodrigues01/refs/heads/main/images/projetos/face-recognition-app/face-recognition-app-login.png" alt="Login" width="700"/>
</p>

## 📋 Sobre o Projeto

Sistema de autenticação biométrica desenvolvido com React e TypeScript que permite autenticação de usuários através de reconhecimento facial e métodos tradicionais (email e senha). A aplicação oferece uma interface moderna e intuitiva para cadastro de faces, login biométrico e gerenciamento de usuários.

## 🚀 Tecnologias Utilizadas

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled_Components-6.1.19-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.12.2-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.9.3-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

## ✨ Funcionalidades

### Autenticação
- ✅ Login tradicional (email + senha)
- ✅ Login por reconhecimento facial
- ✅ Cadastro de usuários com perfil admin opcional
- ✅ Gerenciamento de sessão com JWT tokens
- ✅ Logout automático em caso de token expirado

### Reconhecimento Facial
- 📷 Cadastro de dados faciais via webcam
- 🎯 Captura em tempo real com preview
- 📊 Sistema de pontuação de qualidade da imagem (0-100)
- ✔️ Validação de cadastro facial
- 🔐 Autenticação biométrica
- 🧪 Ferramenta de teste de reconhecimento facial

### Gerenciamento
- 👤 Visualização de informações da conta
- 👥 Interface de gerenciamento de usuários (Admin)
- 🗑️ Funcionalidade de exclusão de usuários
- 📊 Acompanhamento de status de usuários
- 🔑 Sistema de papéis de usuário (superuser/admin)

### Interface
- 🌙 Tema dark mode por padrão
- 📱 Totalmente responsivo (mobile-first)
- ✨ Animações e transições suaves
- 💬 Feedback visual para estados de formulário
- 📝 Instruções para captura facial
- ⏳ Estados de carregamento
- ✅ Telas de confirmação de sucesso

## 📁 Estrutura do Projeto

```
face-recognition-app/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Button.tsx       # Botão estilizado com variantes
│   │   ├── Card.tsx         # Container de card
│   │   ├── Input.tsx        # Campo de formulário
│   │   ├── WebcamCapture.tsx # Interface de captura webcam
│   │   └── PrivateRoute.tsx  # Wrapper de rota protegida
│   │
│   ├── pages/               # Páginas da aplicação
│   │   ├── Login.tsx        # Página de login
│   │   ├── Register.tsx     # Página de cadastro
│   │   ├── EnrollFace.tsx   # Cadastro de face
│   │   ├── Dashboard.tsx    # Dashboard principal
│   │   ├── Users.tsx        # Gerenciamento de usuários
│   │   └── FaceTest.tsx     # Teste de reconhecimento
│   │
│   ├── contexts/            # Contextos React
│   │   └── AuthContext.tsx  # Estado e lógica de autenticação
│   │
│   ├── services/            # Comunicação com API
│   │   └── api.ts           # Instância Axios e endpoints
│   │
│   ├── styles/              # Estilos globais
│   │   ├── theme.ts         # Sistema de design e tema
│   │   ├── GlobalStyles.ts  # CSS global
│   │   └── styled.d.ts      # Declaração TypeScript do tema
│   │
│   ├── types/               # Interfaces TypeScript
│   │   └── index.ts         # Definições de tipos
│   │
│   ├── App.tsx              # Componente principal e rotas
│   └── main.tsx             # Ponto de entrada React
│
├── public/                  # Assets estáticos
├── index.html               # HTML de entrada
├── vite.config.ts           # Configuração Vite
├── tsconfig.json            # Configuração TypeScript
└── package.json             # Dependências e scripts
```

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Webcam (para funcionalidades de reconhecimento facial)

### Passos para instalação

1. Clone o repositório
```bash
git clone https://github.com/Kauanrodrigues01/face-recognition-app.git
cd face-recognition-app
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. Execute o projeto em modo de desenvolvimento
```bash
npm run dev
```

5. Acesse a aplicação
```
http://localhost:5173
```

### Scripts disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Visualiza build de produção
npm run lint     # Executa ESLint
```

## 🔒 Segurança

- Tokens JWT armazenados em localStorage
- Rotas protegidas com componente PrivateRoute
- Validação de formulários
- Interceptores de erro da API
- Logout automático em respostas 401 (não autorizado)
- Codificação Base64 para transmissão de dados de imagem
- Multipart form data para uploads de arquivos

## 📱 Design Responsivo

A aplicação implementa design mobile-first com breakpoints:

- **xs**: 320px
- **sm**: 640px (smartphones)
- **md**: 768px (tablets)
- **lg**: 1024px (desktops)
- **xl**: 1280px (telas grandes)
- **2xl**: 1536px (ultra-wide)

## 🎨 Sistema de Temas

- Tokens de design centralizados (cores, espaçamento, tipografia)
- Dark mode como padrão
- Breakpoints responsivos
- Utilitários de sombra e transição
- Combinações de cores gradientes para hierarquia visual

## 🔗 API Endpoints

Base URL: `http://localhost:8000/api/v1`

- `/auth/login` - Login tradicional
- `/auth/face/login` - Login facial
- `/auth/face/enroll` - Cadastro de face
- `/auth/face/test` - Teste de reconhecimento
- `/users/` - Operações CRUD de usuários
- `/auth/me` - Informações do usuário atual

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Kauan Rodrigues Lima**

- GitHub: [@Kauanrodrigues01](https://github.com/Kauanrodrigues01)
- LinkedIn: [Kauan Rodrigues](https://www.linkedin.com/in/kauan-rodrigues-778621290/)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
