# 📚 DOCUMENTAÇÃO - GERAÇÃO DE ORÇAMENTOS COM IA (Gemini)

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Configuração Inicial](#configuração-inicial)
4. [Como Funciona](#como-funciona)
5. [Estrutura de Dados](#estrutura-de-dados)
6. [Troubleshooting](#troubleshooting)
7. [Contribuindo](#contribuindo)

---

## 🎯 Visão Geral

O sistema de geração de orçamentos utiliza a **API Gemini 2.0 Flash** do Google para gerar propostas profissionais baseadas em dados fornecidos pelo usuário.

**Funcionalidades:**
- ✅ Gerar orçamentos de Produtos
- ✅ Gerar orçamentos de Serviços
- ✅ Salvar no banco de dados PostgreSQL
- ✅ Respostas profissionais sem Markdown
- ✅ Interface mobile (React Native) + Web

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                   MOBILE (React Native)              │
│  ┌────────────────────────────────────────────────┐ │
│  │ Orcamentos.tsx (Formulário + UI)               │ │
│  │ - Coleta dados do usuário                      │ │
│  │ - Valida campos obrigatórios                   │ │
│  │ - Envia para backend                           │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────┬──────────────────────────────────┘
                  │ HTTP POST
                  ↓
┌─────────────────────────────────────────────────────┐
│              BACKEND (Node.js/Express)              │
│  ┌────────────────────────────────────────────────┐ │
│  │ apiOrcamento.js (Routes)                       │ │
│  │ - Valida autenticação (JWT)                    │ │
│  │ - Recebe dados do formulário                   │ │
│  │ - Chama geminiService                          │ │
│  └────────────────────────────────────────────────┘ │
│                     ↓                                │
│  ┌────────────────────────────────────────────────┐ │
│  │ geminiService.js (IA)                          │ │
│  │ - Cria prompt profissional                     │ │
│  │ - Chama API Gemini                             │ │
│  │ - Retorna resposta processada                  │ │
│  └────────────────────────────────────────────────┘ │
│                     ↓                                │
│  ┌────────────────────────────────────────────────┐ │
│  │ Produto.js / Servico.js (Models)              │ │
│  │ - Salva orçamento no BD                        │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                  │ Response JSON
                  ↓
┌─────────────────────────────────────────────────────┐
│              MOBILE (React Native)                   │
│ - Exibe resultado em Modal                          │
│ - Opções: Copiar, Compartilhar, Fechar             │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuração Inicial

### Backend (BudgetGenerator-V2)

#### 1. Instalar dependências
```bash
cd BudgetGenerator-V2
npm install
```

#### 2. Configurar `.env`
```env
PORT=3000
DB_NAME=budget_generator
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=seu_secret_key_aqui
GEMINI_API_KEY=AIzaSyB4LaWMRqX5TO-NDJ7pvJjgS7WtgU3fqIY
```

**Importante:** 
- `GEMINI_API_KEY` - Obtenha em [Google AI Studio](https://aistudio.google.com)
- `JWT_SECRET` - Use uma chave segura e aleatória

#### 3. Iniciar PostgreSQL
```bash
# No Linux com systemd
sudo systemctl start postgresql

# Ou no Docker
docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:13
```

#### 4. Iniciar o servidor
```bash
npm start
```

Saída esperada:
```
Conexão com o banco de dados estabelecida com sucesso.
Modelos sincronizados com o banco de dados.
Servidor rodando na porta 3000
```

### Mobile (React Native/Expo)

#### 1. Instalar dependências
```bash
cd /
npm install
```

#### 2. Configurar `.env`
```env
API_BASE_URL=http://192.168.100.122:3000/api
```

**Nota:** Substitua `192.168.100.122` pelo IP do seu computador
```bash
# Obter IP
hostname -I | awk '{print $1}'
```

#### 3. Iniciar Expo
```bash
npx expo start
```

---

## 🔄 Como Funciona

### Fluxo Completo

#### 1️⃣ Usuário Preenche Formulário (Mobile)
```
Nome do Produto: Camiseta Premium
Materiais: Algodão 100%
Custo Produção: R$ 25.00
Margem Lucro: 35%
Horas: 2
Valor Hora: R$ 30.00
Custo Extra: R$ 5.00
```

#### 2️⃣ App Valida e Envia (Mobile)
```typescript
// Validação
if (campos_obrigatorios_vazios) {
  mostrar_alerta("Preencha todos os campos")
  return
}

// Envio
POST /api/orcamento
Headers: {
  "Authorization": "Bearer token_jwt",
  "Content-Type": "application/json"
}
Body: {
  nomeProduto: "Camiseta Premium",
  materiaisUtilizados: "Algodão 100%",
  custoProducao: "25.00",
  margemLucro: "35",
  horas: "2",
  valorHora: "30.00",
  custoExtra: "5.00"
}
```

#### 3️⃣ Backend Processa (Node.js)
```javascript
// 1. Valida Token JWT
const decoded = jwt.verify(token, JWT_SECRET)
const userId = decoded.id

// 2. Chama Gemini
const prompt = `Gere uma resposta formal...
Nome: Camiseta Premium
Custo: R$ 25.00
...`

const resposta = await geminiService.generateBudgetResponse(dados)

// 3. Salva no BD
await Produto.create({
  descricao: "Camiseta Premium",
  horas: 2,
  valor_hora: 30.00,
  custo_extra: 5.00,
  resposta: resposta,
  id_usuario: userId
})

// 4. Retorna resposta
return {
  mensagem: "Orçamento gerado com sucesso!",
  resposta: "Orçamento - Produto...",
  id: 123,
  tipo: "produto"
}
```

#### 4️⃣ App Exibe Resultado (Mobile)
Modal com:
- Título: "Orçamento Gerado"
- Conteúdo: Resposta completa
- Botões: Fechar, Copiar, Compartilhar

---

## 📊 Estrutura de Dados

### Request - Orçamento de Produto

```json
{
  "nomeProduto": "Camiseta Premium",
  "custoProducao": "25.00",
  "materiaisUtilizados": "Algodão 100%",
  "margemLucro": "35",
  "horas": "2",
  "valorHora": "30.00",
  "custoExtra": "5.00"
}
```

### Request - Orçamento de Serviço

```json
{
  "nomeServico": "Design Gráfico",
  "valorBase": "500.00",
  "horasEstimadas": "8",
  "materiaisServico": "Software Adobe",
  "custoServico": "100.00",
  "lucroServico": "50",
  "descricaoServico": "Criação de identidade visual"
}
```

### Response - Sucesso

```json
{
  "mensagem": "Orçamento gerado com sucesso!",
  "resposta": "ORÇAMENTO - PRODUTO: CAMISETA PREMIUM\n\nPrezado(a) Cliente,\n\n... [resposta completa do Gemini] ...",
  "id": 42,
  "tipo": "produto"
}
```

### Response - Erro

```json
{
  "erro": "Erro ao gerar orçamento"
}
```

ou

```json
{
  "error": "Token não fornecido"
}
```

### Banco de Dados - Tabela `produtos`

```sql
CREATE TABLE produtos (
  id_produto SERIAL PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  horas FLOAT NOT NULL,
  valor_hora FLOAT NOT NULL,
  custo_extra FLOAT DEFAULT 0,
  resposta TEXT NOT NULL,
  id_usuario UUID NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES users(id)
);
```

### Banco de Dados - Tabela `servicos`

```sql
CREATE TABLE servicos (
  id_servico SERIAL PRIMARY KEY,
  nome_servico VARCHAR(255) NOT NULL,
  materials VARCHAR(255) NOT NULL,
  custo FLOAT NOT NULL,
  lucro FLOAT NOT NULL,
  resposta TEXT NOT NULL,
  id_usuario UUID NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES users(id)
);
```

---

## 🐛 Troubleshooting

### ❌ Erro: "Erro ao Gerar Orçamento"

**Possível causa:** Backend não está rodando

**Solução:**
```bash
# Verificar se backend está rodando
curl http://localhost:3000

# Se não funcionar, inicie o backend
cd BudgetGenerator-V2
npm start
```

---

### ❌ Erro: "Token inválido"

**Possível causa:** Token JWT expirou ou usuário não logado

**Solução:**
```typescript
// Faça login novamente
const { token } = await authService.login(email, password)
```

---

### ❌ Erro: "Erro de conexão"

**Possível causa:** IP incorreto no `.env`

**Solução:**
1. Verifique seu IP:
   ```bash
   hostname -I | awk '{print $1}'
   ```

2. Atualize `.env`:
   ```env
   API_BASE_URL=http://SEU_IP:3000/api
   ```

3. Reinicie Expo:
   ```bash
   npx expo start
   ```

---

### ❌ Erro: "GEMINI_API_KEY inválida"

**Possível causa:** API Key do Gemini não configurada

**Solução:**
1. Acesse [Google AI Studio](https://aistudio.google.com)
2. Crie uma nova API Key
3. Adicione ao `.env`:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```

---

### ❌ Erro: "Banco de dados não conectado"

**Possível causa:** PostgreSQL não está rodando

**Solução:**
```bash
# Verificar status
sudo systemctl status postgresql

# Iniciar PostgreSQL
sudo systemctl start postgresql

# Ou com Docker
docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:13
```

---

## 📁 Estrutura de Arquivos Principais

```
BudgetGeneratorApp/
├── BudgetGenerator-V2/           # Backend
│   ├── src/
│   │   ├── services/
│   │   │   └── geminiService.js  # ⭐ Serviço Gemini
│   │   ├── routes/
│   │   │   └── apiOrcamento.js   # ⭐ Endpoints de orçamento
│   │   ├── models/
│   │   │   ├── produto.js
│   │   │   └── servico.js
│   │   └── index.js              # ⭐ Servidor Express
│   ├── .env                       # ⭐ Configurações
│   └── package.json
│
├── src/                           # Mobile/Frontend
│   ├── screens/
│   │   └── Orcamento/
│   │       └── Orcamentos.tsx     # ⭐ Tela de formulário
│   └── services/
│       └── authService.ts        # Serviço de autenticação
│
├── .env                           # ⭐ URL da API
├── babel.config.js               # ⭐ Config variáveis ambiente
└── app.json                       # Config Expo
```

---

## ✨ Melhorias Futuras

- [ ] Adicionar tela "Meus Orçamentos"
- [ ] Implementar edição de respostas
- [ ] Adicionar histórico de versões
- [ ] Exportar orçamento em PDF
- [ ] Compartilhar orçamento via link
- [ ] Notificações em tempo real
- [ ] Sincronização offline
- [ ] Testes automatizados
- [ ] Documentação da API (Swagger)

---

## 👥 Contribuindo

### Para adicionar novas funcionalidades:

1. **Crie uma branch:**
   ```bash
   git checkout -b feature/sua-funcionalidade
   ```

2. **Desenvolva e teste localmente:**
   ```bash
   npm start          # Backend
   npx expo start     # Mobile
   ```

3. **Commit suas mudanças:**
   ```bash
   git commit -m "feat: descrição da funcionalidade"
   ```

4. **Push e abra Pull Request:**
   ```bash
   git push origin feature/sua-funcionalidade
   ```

---

## 📞 Suporte

Para dúvidas ou problemas:

1. **Verifique este documento** primeiro
2. **Consulte os logs:**
   - Backend: Console do terminal
   - Mobile: Pressione `j` no Expo para ver console
3. **Verifique o status da API:**
   ```bash
   curl -s http://localhost:3000 && echo "✅ Backend OK"
   ```

---

## 📄 Changelog

### v1.0.0 (20 de novembro de 2025)
- ✅ Integração com Gemini 2.0 Flash
- ✅ Geração de orçamentos de produtos
- ✅ Geração de orçamentos de serviços
- ✅ Interface mobile (React Native)
- ✅ Autenticação JWT
- ✅ Persistência em PostgreSQL

---

**Última atualização:** 20 de novembro de 2025  
**Status:** ✅ Pronto para Produção  
**Maintainers:** @Lucas
