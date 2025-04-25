# Contador Comitê - Frontend

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-F7D336?style=for-the-badge&logo=vue.js&logoColor=black)

## Visão Geral

Interface de usuário para o sistema de contagem de receita do Comitê de Formatura do CEMI do Cruzeiro para o Terceiro Ano de 2025. Este frontend oferece uma interface moderna, responsiva e intuitiva para controle de receitas, despesas e geração de relatórios financeiros.

## Funcionalidades

### Dashboard
- Visualização rápida de indicadores financeiros
- Progresso da meta financeira
- Saldo atual
- Visão geral de receitas e despesas recentes

### Calendário de Vendas
- Visualização de vendas por dia em formato de calendário
- Navegação semanal
- Adição rápida de vendas para qualquer data

### Gestão de Vendas
- Registro detalhado de vendas por produto
- Suporte a diferentes tipos de produtos (refrigerante em copo/garrafa, picolé)
- Modo especial para dias de trote (bingo, correio elegante, cadeia do amor)
- Edição e exclusão de vendas
- Adição de itens customizados

### Gestão de Despesas
- Cadastro de despesas com descrição, quantidade e valor
- Visualização de despesas agrupadas
- Edição e exclusão de despesas

### Relatórios Financeiros
- Geração de relatórios por período (diário, semanal, mensal)
- Comparativo entre receitas e despesas
- Gráficos de distribuição por categoria
- Detalhamento de itens por tipo
- Relatórios específicos para eventos de trote

### Autenticação
- Sistema de login seguro
- Perfis de usuário com diferentes permissões
- Proteção de rotas

### Recursos de UI/UX
- Design responsivo para desktop e mobile
- Navegação inferior em dispositivos móveis
- Temas visuais modernos com Tailwind CSS
- Feedback visual com notificações toast
- Formulários com validação em tempo real

## Tecnologias Utilizadas

- **Vue 3**: Framework progressivo para construção de interfaces
- **TypeScript**: Tipagem estática para melhor qualidade de código
- **Pinia**: Gerenciamento de estado da aplicação
- **Vue Router**: Navegação entre páginas
- **Tailwind CSS**: Framework de utilidades CSS para design responsivo
- **ShadcnUI**: Componentes UI reutilizáveis e acessíveis
- **Lucide Icons**: Biblioteca de ícones SVG
- **date-fns**: Utilitários para manipulação de datas
- **Recharts**: Biblioteca para visualização de dados
- **Axios**: Cliente HTTP para requisições API
- **Zod**: Validação de esquemas

## Configuração do Projeto

### Pré-requisitos

- Node.js 16+ e NPM
- Backend da aplicação executando

### Configuração de Desenvolvimento

```bash
# Instalação de dependências
npm install

# Execução em ambiente de desenvolvimento (hot-reload)
npm run dev

# Compilação e minificação para produção
npm run build

# Verificação de tipos e linting
npm run lint
```

## Estrutura do Projeto
