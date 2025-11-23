#!/bin/bash

# Script de Teste - API de Orçamentos
# Certifique-se de que o servidor está rodando em http://localhost:3000

BASE_URL="http://localhost:3000/api"

# ============================================
# 1. REGISTRAR USUÁRIO DE TESTE
# ============================================
echo "📝 1. Registrando usuário de teste..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Usuário Teste",
    "email": "teste@example.com",
    "senha": "senha123456"
  }')

echo "Resposta: $REGISTER_RESPONSE"
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "User ID: $USER_ID"

# ============================================
# 2. FAZER LOGIN
# ============================================
echo ""
echo "🔑 2. Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "senha": "senha123456"
  }')

echo "Resposta: $LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"

# ============================================
# 3. GERAR ORÇAMENTO DE PRODUTO
# ============================================
echo ""
echo "🛍️  3. Gerando orçamento de produto..."
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/orcamento" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nomeProduto": "Cadeira Gamer",
    "custoProducao": "500",
    "materiaisUtilizados": "Metal, Espuma, Plástico",
    "margemLucro": "35",
    "horas": "5",
    "valorHora": "50",
    "custoExtra": "100"
  }')

echo "Resposta: $PRODUCT_RESPONSE"

# ============================================
# 4. GERAR ORÇAMENTO DE SERVIÇO
# ============================================
echo ""
echo "🔧 4. Gerando orçamento de serviço..."
SERVICE_RESPONSE=$(curl -s -X POST "$BASE_URL/orcamento" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nomeServico": "Desenvolvimento Web",
    "valorBase": "1000",
    "horasEstimadas": "40",
    "materiaisServico": "Servidor, SSL",
    "custoServico": "300",
    "lucroServico": "40",
    "descricaoServico": "Site responsivo com backend"
  }')

echo "Resposta: $SERVICE_RESPONSE"

# ============================================
# 5. BUSCAR TODOS OS ORÇAMENTOS DO USUÁRIO
# ============================================
echo ""
echo "📋 5. Buscando todos os orçamentos..."
LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/orcamento/meus-orcamentos" \
  -H "Authorization: Bearer $TOKEN")

echo "Resposta: $LIST_RESPONSE"

# ============================================
# 6. BUSCAR RESUMO DE CONTAGEM
# ============================================
echo ""
echo "📊 6. Buscando resumo de contagem..."
SUMMARY_RESPONSE=$(curl -s -X GET "$BASE_URL/orcamento/resumo-contagem" \
  -H "Authorization: Bearer $TOKEN")

echo "Resposta: $SUMMARY_RESPONSE"

# ============================================
# 7. BUSCAR CUSTO MÉDIO
# ============================================
echo ""
echo "💰 7. Buscando custo médio..."
AVERAGE_RESPONSE=$(curl -s -X GET "$BASE_URL/orcamento/custo-medio" \
  -H "Authorization: Bearer $TOKEN")

echo "Resposta: $AVERAGE_RESPONSE"

# ============================================
# 8. BUSCAR TOTAIS ACUMULADOS
# ============================================
echo ""
echo "💵 8. Buscando totais acumulados..."
TOTALS_RESPONSE=$(curl -s -X GET "$BASE_URL/orcamento/totais-acumulados" \
  -H "Authorization: Bearer $TOKEN")

echo "Resposta: $TOTALS_RESPONSE"

echo ""
echo "✅ Testes concluídos!"
