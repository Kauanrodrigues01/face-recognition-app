# Face Recognition - Frontend

Sistema de autenticação biométrica com reconhecimento facial desenvolvido em React + TypeScript.

## 🚀 Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Styled Components** - Estilização
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **React Webcam** - Captura de câmera
- **React Icons** - Ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env com a URL da API (se necessário)
# VITE_API_BASE_URL=http://sua-api:porta
```

## 🏃 Executar

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📱 Funcionalidades

### ✅ Autenticação
- Login tradicional (email + senha)
- Login facial (email + reconhecimento facial)
- Registro de novos usuários

### ✅ Biometria
- Cadastro de biometria facial
- Captura de foto via webcam
- Validação de qualidade da imagem
- Instruções visuais para o usuário

### ✅ Dashboard
- Informações da conta
- Status da biometria facial
- Gerenciamento de perfil

## 🎨 Design

- **Dark Mode** por padrão
- **Totalmente responsivo** (mobile-first)
- **Animações suaves** e transições
- **Componentes reutilizáveis**
- **Tema personalizado** com styled-components

## 📂 Estrutura

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── WebcamCapture.tsx
│   └── PrivateRoute.tsx
├── contexts/        # Contexts (Auth)
│   └── AuthContext.tsx
├── pages/           # Páginas
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── EnrollFace.tsx
│   └── Dashboard.tsx
├── services/        # API services
│   └── api.ts
├── styles/          # Estilos globais e tema
│   ├── theme.ts
│   └── GlobalStyles.ts
├── types/           # Tipos TypeScript
│   └── index.ts
├── App.tsx          # Componente principal
└── main.tsx         # Entry point
```

## 🔒 Segurança

- Tokens JWT armazenados no localStorage
- Rotas protegidas com PrivateRoute
- Validação de formulários
- Tratamento de erros da API
- Interceptors para refresh de token

## 🌐 API

Por padrão, a aplicação se conecta em:
```
http://localhost:8000
```

Para alterar, edite o arquivo `.env`:
```env
VITE_API_BASE_URL=http://sua-api:porta
```

## 📸 Captura de Câmera

A aplicação solicita permissão para acessar a webcam do usuário para:
- Login facial
- Cadastro de biometria

Certifique-se de permitir o acesso quando solicitado pelo navegador.

## 🎯 Fluxo de Uso

1. **Registro**
   - Criar conta com nome, email e senha
   - Redirecionado para cadastro de biometria (opcional)

2. **Cadastro de Biometria** (opcional)
   - Capturar foto via webcam
   - Sistema valida qualidade (score 0-100)
   - Pode pular e fazer depois

3. **Login**
   - **Modo Tradicional**: Email + Senha
   - **Modo Facial**: Email + Foto

4. **Dashboard**
   - Visualizar informações da conta
   - Gerenciar biometria facial
   - Logout

## 🐛 Troubleshooting

### Webcam não funciona
- Verifique permissões do navegador
- Certifique-se que está usando HTTPS (em produção)
- Teste em navegador diferente

### Erro de conexão com API
- Verifique se a API está rodando
- Confira a URL no `.env`
- Veja o console do navegador para detalhes

### Build falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📄 Licença

Projeto desenvolvido para fins educacionais e demonstração.

---

Desenvolvido com ❤️ usando React + TypeScript