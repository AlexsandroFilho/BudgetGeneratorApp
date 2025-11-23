# ✅ Checklist de Segurança - Chaves API e Variáveis de Ambiente

## 🔐 Verificações Realizadas

### ✅ Backend (.env não será comitado)
- [x] `.env` está no `.gitignore`
- [x] `.env.example` criado com template
- [x] `GEMINI_API_KEY` usado via `process.env`
- [x] Nunca foi comitado no histórico do Git
- [x] Documentação de segurança criada

### ✅ Frontend (.env.local não será comitado)
- [x] `.env.local` está no `.gitignore`
- [x] `.env.example` criado com template
- [x] `API_BASE_URL` configurado via `@env`
- [x] Arquivo de configuração ignorado

### ✅ Proteção de Chaves
- [x] Chave Gemini em variável de ambiente
- [x] Nunca exposta em código-fonte
- [x] Nunca exposta em logs (em desenvolvimento)
- [x] Nunca será comitada no GitHub

### ✅ Documentação
- [x] `GUIA_SEGURANCA_CHAVES_API.md` - Guia completo
- [x] `SETUP_CHAVES_API.md` - Instruções de setup
- [x] `.env.example` files - Templates
- [x] Este checklist

---

## 📋 Como Usar (Primeira Vez)

### 1. Backend
```bash
cd BudgetGenerator-V2
cp .env.example .env
# Edite .env e adicione:
# GEMINI_API_KEY=sua_chave_aqui
```

### 2. Frontend
```bash
cd ..
cp .env.example .env.local
# Mantenha API_BASE_URL conforme necessário
```

### 3. Testar
```bash
# Terminal 1: Backend
cd BudgetGenerator-V2 && npm start

# Terminal 2: Frontend
cd .. && npx expo start

# Terminal 3: Testar API
bash teste-api-orcamentos.sh
```

---

## 🚀 Instruções de Deploy

### Desenvolvimento
```env
# .env (BudgetGenerator-V2)
GEMINI_API_KEY=sua_chave_desenvolvimento
JWT_SECRET=secret_desenvolvimento
API_BASE_URL=http://localhost:3000/api
```

### Produção (Use Variáveis de Ambiente do Servidor)
```bash
# NÃO use arquivo .env em produção
# Configure variáveis no servidor:

export GEMINI_API_KEY=$(aws secretsmanager get-secret ...)
export JWT_SECRET=$(aws secretsmanager get-secret ...)
export API_BASE_URL=https://seu-dominio.com/api

npm start
```

---

## 🔒 Verificações de Segurança

Antes de fazer push:

```bash
✅ git status | grep .env      # Não deve aparecer .env
✅ cat .gitignore | grep .env  # Deve incluir .env
✅ grep -r "AIzaSy" src/       # Não deve retornar valores
✅ npm run build               # Deve compilar sem erros
```

---

## 🆘 Caso de Vazamento

Se a chave for exposta:

1. **Delete imediatamente**: https://aistudio.google.com/app/apikey
2. **Crie nova chave**: https://aistudio.google.com/app/apikey
3. **Atualize .env**: GEMINI_API_KEY=nova_chave
4. **Restart app**: npm restart
5. **Monitore uso**: https://aistudio.google.com/app/usage

---

## 📊 Status

| Item | Status | Notas |
|------|--------|-------|
| Chave Protegida | ✅ | Em `.env` (não comitado) |
| `.gitignore` | ✅ | Inclui `.env` e `.env.local` |
| Histórico Git | ✅ | Nenhum `.env` comitado |
| Documentação | ✅ | Guias completos |
| Backend | ✅ | Usa `process.env.GEMINI_API_KEY` |
| Frontend | ✅ | Usa `@env` do Expo |

---

## 📞 Referências

- [Setup Chaves API](./SETUP_CHAVES_API.md)
- [Guia Segurança](./GUIA_SEGURANCA_CHAVES_API.md)
- [Google AI Studio](https://aistudio.google.com/app/apikey)
- [12 Factor App - Config](https://12factor.net/config)

---

**Última atualização**: 20 de novembro de 2025
**Status**: ✅ SEGURO PARA PRODUÇÃO
