# ⚡ QUICK START - Geração de Orçamentos

## 🚀 5 Minutos para Começar

### 1️⃣ Backend (Terminal 1)
```bash
cd BudgetGenerator-V2
npm install
npm start
```

Espere aparecer:
```
Servidor rodando na porta 3000
```

### 2️⃣ Descobrir seu IP (Terminal 2)
```bash
hostname -I | awk '{print $1}'
```

Exemplo: `192.168.100.122`

### 3️⃣ Atualizar `.env` no Mobile
```env
API_BASE_URL=http://192.168.100.122:3000/api
```

### 4️⃣ Mobile (Terminal 3)
```bash
cd /  # raiz do projeto
npx expo start
```

### 5️⃣ Testar
1. Abra o app mobile
2. Faça login
3. Vá para Orçamentos
4. Preencha o formulário
5. Clique "Gerar Orçamento"

✅ **Pronto!**

---

## 🔍 Verificar Status

```bash
# Backend rodando?
curl http://localhost:3000

# PostgreSQL rodando?
psql -U postgres -d budget_generator -c "SELECT version();"

# API respondendo?
TOKEN="seu_token_aqui"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/orcamento
```

---

## 📱 Testar Sem Mobile

```bash
# 1. Criar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Pass123","confirmpassword":"Pass123"}'

# 2. Copiar o token da resposta
# 3. Gerar orçamento
TOKEN="cole_o_token_aqui"
curl -X POST http://localhost:3000/api/orcamento \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nomeProduto":"Teste","custoProducao":"10","materiaisUtilizados":"Teste","margemLucro":"30","horas":"2","valorHora":"25"}'
```

---

## 🐛 Erros Comuns

| Erro | Solução |
|------|---------|
| "Conexão recusada" | Backend não está rodando (`npm start`) |
| "Token inválido" | Faça login novamente |
| "ENOTFOUND 192.168.*" | IP incorreto no `.env` |
| "Banco de dados não conectado" | PostgreSQL não está rodando |

---

## 📚 Documentação Completa

Veja `DOCUMENTACAO_ORCAMENTOS.md` para detalhes completos.
