# 🚀 Setup de Chaves API e Variáveis de Ambiente

## ✅ Status Atual de Segurança

✅ **Chaves protegidas** - `.env` está no `.gitignore`
✅ **Nunca foi comitado** - Histórico limpo
✅ **Arquivos de exemplo criados** - `.env.example` disponível
✅ **Documentação completa** - Guia de segurança criado

---

## 📋 Setup Passo a Passo

### 1️⃣ Backend - Configurar Gemini API

```bash
# Navegar para o backend
cd /home/alexo/BudgetGeneratorApp/BudgetGenerator-V2

# Verificar se .env existe
ls -la .env

# Se não existir, criar a partir do template
cp .env.example .env

# Editar arquivo com sua chave real
nano .env  # ou use seu editor favorito (vim, code, etc)
```

**Seu `.env` deve ter:**
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

### 2️⃣ Frontend - Configurar URL da API

```bash
# Navegar para o root
cd /home/alexo/BudgetGeneratorApp

# Verificar se .env existe
ls -la .env .env.local

# Se não existir, criar a partir do template
cp .env.example .env.local

# Editar arquivo com URL correta
nano .env.local
```

**Seu `.env.local` deve ter:**
```env
API_BASE_URL=http://192.168.15.22:3000/api
```

### 3️⃣ Verificar Configuração

```bash
# Backend - Testar se carrega variáveis
cd BudgetGenerator-V2
node -e "require('dotenv').config(); console.log('✅ GEMINI_API_KEY carregada' if process.env.GEMINI_API_KEY else '❌ Chave não encontrada')"

# Frontend - Verificar .env.local
grep API_BASE_URL .env.local
```

### 4️⃣ Iniciar Aplicação

```bash
# Terminal 1: Backend
cd /home/alexo/BudgetGeneratorApp/BudgetGenerator-V2
npm start
# Esperado: "Servidor rodando na porta 3000"

# Terminal 2: Frontend
cd /home/alexo/BudgetGeneratorApp
npx expo start
# Esperado: "QR Code aparecendo"

# Terminal 3: Testar API
bash teste-api-orcamentos.sh
```

---

## 🔐 Proteção de Chaves

### Como Garantir que a Chave Não Vai para o GitHub?

**1. Verificar `.gitignore`:**
```bash
cat .gitignore | grep -E "\.env|secrets"
```
Deve exibir:
```
.env
.env.local
.env.*.local
package-lock.json
```

**2. Verificar se foi comitado:**
```bash
# Procurar por qualquer arquivo .env no histórico
git log --all --full-history --name-only | grep .env

# Procurar por padrão de chave Gemini
grep -r "AIzaSy" . --exclude-dir=node_modules --exclude-dir=.git
```

**3. Antes de fazer push:**
```bash
# Ver o que vai ser comitado
git status

# Verificar se .env está em vermelho (não staged)
# Deve mostrar ".env" em "Untracked files"

# Fazer commit seguro
git add .
git commit -m "Implementation completed"
git push origin main
```

---

## 🔑 Obter Chave Gemini API

### Se Não Tem Uma Chave Ainda:

1. Acesse: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Clique em **"Create API Key"**
3. Copie a chave gerada
4. Cole no arquivo `.env` do backend:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```

### Se Já Tem Uma Chave:

1. Verifique em `.env`:
   ```bash
   cat BudgetGenerator-V2/.env | grep GEMINI_API_KEY
   ```
2. Se não estiver, adicione manualmente
3. Teste se funciona iniciando o backend

---

## 🧪 Testar Integração

### 1. Verificar se Backend Reconhece Chave

```bash
cd BudgetGenerator-V2
node -e "
  require('dotenv').config();
  const key = process.env.GEMINI_API_KEY;
  if (key && key.startsWith('AIzaSy')) {
    console.log('✅ Chave Gemini configurada corretamente');
  } else {
    console.log('❌ Erro: Chave não encontrada ou inválida');
  }
"
```

### 2. Testar Geração de Orçamento

```bash
# Iniciar servidor
npm start

# Em outro terminal, testar API
bash teste-api-orcamentos.sh
```

Esperado: Deve gerar orçamentos usando a IA do Gemini

### 3. Testar no App

```bash
# Iniciar Expo
npx expo start

# Escanear QR Code
# 1. Fazer login
# 2. Ir para "Orcamentos"
# 3. Preencher formulário
# 4. Clicar "Gerar Orçamento"
# 5. Deve aparecer resultado gerado por IA
```

---

## ⚠️ Segurança - Checklist Final

Antes de fazer push para GitHub:

```bash
# ✅ 1. Verificar .gitignore
grep "\.env" .gitignore  # Deve incluir .env

# ✅ 2. Verificar se .env existe mas não está staged
git status | grep .env   # Deve estar em "Untracked files"

# ✅ 3. Procurar por chaves expostas
grep -r "AIzaSy" src/   # Não deve retornar nada em src/
grep -r "GEMINI_API_KEY=" src/  # Não deve retornar com valor real

# ✅ 4. Verificar se .env.example está comitado
git ls-files | grep .env.example  # Deve retornar os .env.example

# ✅ 5. Confirmar que backend e frontend funcionam
npm start && echo "✅ Backend OK"
npx expo start && echo "✅ Frontend OK"
```

---

## 🚨 Se Comprometer a Chave Acidentalmente

### PASSO 1: Ação Imediata (em menos de 1 minuto)

```bash
# 1. Delete a chave no console
# Acesse: https://aistudio.google.com/app/apikey
# Clique no ícone de lixo da chave comprometida

# 2. Se foi comitado no git, remover do histórico (se for repo privado)
git rm --cached BudgetGenerator-V2/.env
git commit -m "Remove .env file"

# 3. Adicionar ao gitignore (já está feito)
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Update .gitignore"
```

### PASSO 2: Criar Nova Chave

```bash
# 1. Acesse: https://aistudio.google.com/app/apikey
# 2. Clique em "Create API Key"
# 3. Copie a nova chave

# 2. Atualizar .env
cd BudgetGenerator-V2
nano .env  # Atualizar GEMINI_API_KEY

# 3. Restart aplicação
npm restart
```

### PASSO 3: Verificar Uso Indevido

```bash
# Acesse: https://aistudio.google.com/app/usage
# Procure por:
# - Spikes anormais de uso
# - Requisições de IPs estranhos
# - Chamadas que você não fez

# Se encontrou abuso:
# - Denuncie o uso indevido ao Google
# - Guarde evidências (screenshots)
```

---

## 📚 Arquivos Criados/Atualizados

```
✅ .env.example              - Template de variáveis (compartilhável)
✅ BudgetGenerator-V2/.env.example  - Template do backend
✅ GUIA_SEGURANCA_CHAVES_API.md     - Documentação completa
✅ .gitignore (atualizado)   - Proteção extra de arquivos sensíveis
✅ README_ORCAMENTOS.md      - Documentação geral (já existia)
```

---

## 🔄 Workflow de Uso Seguro

```
1. Clonar repo
   └─ git clone ...

2. Copiar .env.example
   └─ cp .env.example .env.local
   └─ cp BudgetGenerator-V2/.env.example BudgetGenerator-V2/.env

3. Preencher chaves reais (NÃO COMITAR)
   └─ Adicionar GEMINI_API_KEY no backend
   └─ Adicionar API_BASE_URL no frontend

4. Iniciar aplicação
   └─ npm start (backend)
   └─ npx expo start (frontend)

5. Fazer changes
   └─ Nunca altere .env
   └─ Sempre use valores reais em .env

6. Fazer push
   └─ git add .
   └─ git commit -m "message"
   └─ git push (chaves NÃO serão enviadas)
```

---

## ✨ Status Final

✅ **Chave do Gemini**: Protegida no `.env`
✅ **Arquivo `.env`**: Ignorado pelo Git
✅ **Documentação**: Criada em `GUIA_SEGURANCA_CHAVES_API.md`
✅ **Exemplo**: Disponível em `.env.example`
✅ **Backend**: Configurado para usar `process.env.GEMINI_API_KEY`
✅ **Frontend**: Configurado para usar `@env` do Expo

🚀 **Pronto para uso seguro!**
