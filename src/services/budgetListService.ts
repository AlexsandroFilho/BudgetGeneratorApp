import { API_BASE_URL } from '@env';

export interface Budget {
  id: number;
  nome: string;
  data: string;
  resposta: string;
  tipo: 'produto' | 'servico';
}

class BudgetListService {
  async fetchBudgets(token: string): Promise<Budget[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orcamento/meus-orcamentos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const budgets: Budget[] = await response.json();
      return budgets;
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
      throw error;
    }
  }

  async deleteBudget(token: string, id: number, tipo: 'produto' | 'servico'): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/orcamento/${id}?tipo=${tipo}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error);
      throw error;
    }
  }
}

export default new BudgetListService();
