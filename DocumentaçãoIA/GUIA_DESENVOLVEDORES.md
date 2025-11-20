# 🛠️ GUIA PARA DESENVOLVEDORES - Estendendo Funcionalidades

## 📝 Sumário

1. [Adicionar novo campo ao formulário](#adicionar-novo-campo)
2. [Modificar o prompt do Gemini](#modificar-o-prompt)
3. [Criar nova rota de API](#criar-nova-rota)
4. [Adicionar validações customizadas](#adicionar-validações)
5. [Otimizar performance](#otimizar-performance)

---

## 🆕 Adicionar Novo Campo ao Formulário

### Passo 1: Adicionar ao estado inicial (Mobile)

`src/screens/Orcamento/Orcamentos.tsx`

```typescript
const productInitialState = {
    nomeProduto: '',
    custoProducao: '',
    materiaisUtilizados: '',
    margemLucro: '',
    horas: '',
    valorHora: '',
    custoExtra: '',
    novosCampo: '', // ✅ NOVO
};
```

### Passo 2: Adicionar ao formulário

```typescript
const ProductForm = ({ data, setData }: ProductFormProps) => (
    <View style={styles.section}>
        {/* ... campos existentes ... */}
        
        {/* ✅ NOVO CAMPO */}
        <TextInput 
            style={styles.input} 
            placeholder="Novo Campo *" 
            value={data.novosCampo} 
            onChangeText={v => setData({ ...data, novosCampo: v })} 
        />
    </View>
);
```

### Passo 3: Adicionar à validação

```typescript
const requiredFields = budgetType === 'produto'
    ? ['nomeProduto', 'custoProducao', 'materiaisUtilizados', 
       'margemLucro', 'horas', 'valorHora', 'novosCampo'] // ✅ ADICIONAR
    : ['nomeServico', 'valorBase', /* ... */];
```

### Passo 4: O campo será automaticamente enviado

Backend receberá:
```json
{
  "nomeProduto": "...",
  "novosCampo": "..."
}
```

---

## 🤖 Modificar o Prompt do Gemini

### Localizar prompt atual

`BudgetGenerator-V2/src/services/geminiService.js`

### Exemplo: Adicionar análise de mercado

```javascript
async generateBudgetResponse(data) {
    let prompt = "";
    
    if (data.nomeProduto) {
        prompt = `Gere uma resposta formal e profissional para um orçamento de produto.
Retorne apenas texto puro (plain text).

Use os dados abaixo para preencher o orçamento:
Nome do Produto: ${data.nomeProduto}
Custo do Produto: R$ ${data.custoProducao}
...

✅ NOVO: Inclua também:
- Análise de Mercado: Comparação com produtos similares
- Recomendações: Sugestões de preço competitivo
- Tendências: O que está em alta no mercado
`;
    }
    // ... resto do código
}
```

### Testar o novo prompt

```bash
TOKEN="seu_token"
curl -X POST http://localhost:3000/api/orcamento \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nomeProduto":"Teste","custoProducao":"10",...}'
```

---

## 🔌 Criar Nova Rota de API

### Exemplo: Endpoint para listar orçamentos do usuário

`BudgetGenerator-V2/src/routes/apiOrcamento.js`

```javascript
// ✅ NOVA ROTA
router.get('/usuario/resumo', protect, async (req, res) => {
    try {
        const userId = req.userId;
        
        // Buscar orçamentos
        const produtos = await Produto.count({ 
            where: { id_usuario: userId } 
        });
        
        const servicos = await Servico.count({ 
            where: { id_usuario: userId } 
        });
        
        res.json({
            totalProdutos: produtos,
            totalServicos: servicos,
            total: produtos + servicos
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar resumo' });
    }
});
```

### Consumir no Mobile

```typescript
// src/services/budgetService.ts
export const budgetService = {
    async getBudgetSummary(token: string) {
        const response = await fetch(`${API_BASE_URL}/orcamento/usuario/resumo`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return await response.json();
    }
};

// Usar no componente
const { data } = await budgetService.getBudgetSummary(token);
console.log(`Total: ${data.total} orçamentos`);
```

---

## ✅ Adicionar Validações Customizadas

### Validação no Backend

`BudgetGenerator-V2/src/routes/apiOrcamento.js`

```javascript
router.post('/', protect, async (req, res) => {
    try {
        const dados = req.body;
        
        // ✅ VALIDAÇÃO CUSTOMIZADA
        if (dados.custoProducao <= 0) {
            return res.status(400).json({ 
                erro: 'Custo de produção deve ser maior que 0' 
            });
        }
        
        if (dados.margemLucro < 10) {
            return res.status(400).json({ 
                erro: 'Margem de lucro mínima é 10%' 
            });
        }
        
        // ... resto do código
    }
});
```

### Validação no Mobile

`src/screens/Orcamento/Orcamentos.tsx`

```typescript
const handleGenerateBudget = async () => {
    // ... validações existentes ...
    
    // ✅ NOVA VALIDAÇÃO
    if (parseFloat(productData.custoProducao) <= 0) {
        Alert.alert('Erro', 'Custo deve ser maior que 0');
        return;
    }
    
    if (parseFloat(productData.margemLucro) < 10) {
        Alert.alert('Erro', 'Margem de lucro mínima é 10%');
        return;
    }
    
    // ... continua
};
```

---

## ⚡ Otimizar Performance

### 1. Cache de Resultados

```javascript
// Backend
const cache = new Map();

router.get('/cache/:id', protect, (req, res) => {
    const cacheKey = `orcamento_${req.params.id}`;
    
    if (cache.has(cacheKey)) {
        return res.json(cache.get(cacheKey));
    }
    
    // Se não está em cache, buscar e guardar
    const resultado = buscarDoBD();
    cache.set(cacheKey, resultado);
    res.json(resultado);
});
```

### 2. Paginação

```javascript
// Listar orçamentos com paginação
router.get('/lista', protect, async (req, res) => {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const orcamentos = await Produto.findAll({
        where: { id_usuario: req.userId },
        limit,
        offset,
        order: [['data_criacao', 'DESC']]
    });
    
    res.json(orcamentos);
});
```

### 3. Compressão de Resposta

```javascript
// app.js
const compression = require('compression');
app.use(compression());
```

### 4. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // Máximo 100 requisições
});

app.use('/api/', limiter);
```

---

## 🧪 Testes

### Testar novo endpoint

```bash
# Criar teste de integração
cd BudgetGenerator-V2
npm install --save-dev jest supertest

# Criar arquivo test
touch tests/api.test.js
```

```javascript
// tests/api.test.js
const request = require('supertest');
const app = require('../src/index');

describe('API Orçamentos', () => {
    it('deve gerar orçamento com dados válidos', async () => {
        const response = await request(app)
            .post('/api/orcamento')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nomeProduto: 'Teste',
                custoProducao: '10',
                // ... dados completos
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('resposta');
    });
});
```

---

## 📊 Monitorar Performance

```javascript
// Adicionar logging
const startTime = Date.now();

const resposta = await geminiService.generateBudgetResponse(dados);

const duration = Date.now() - startTime;
console.log(`⏱️ Gemini demorou ${duration}ms`);
```

---

## 🔐 Segurança

### Validar entrada de usuário

```javascript
const { body, validationResult } = require('express-validator');

router.post('/', protect, 
    body('nomeProduto').trim().isLength({ min: 1, max: 255 }),
    body('custoProducao').isFloat({ min: 0.01 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    async (req, res) => {
        // Processar...
    }
);
```

---

## 📚 Recursos Úteis

- [Documentação Gemini](https://ai.google.dev)
- [Express.js](https://expressjs.com)
- [React Native](https://reactnative.dev)
- [Sequelize ORM](https://sequelize.org)
- [PostgreSQL](https://www.postgresql.org)

---

**Última atualização:** 20 de novembro de 2025
