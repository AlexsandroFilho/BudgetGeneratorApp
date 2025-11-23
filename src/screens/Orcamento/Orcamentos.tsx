import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Modal, ActivityIndicator, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';
import { styles } from './OrcamentoStyle';
import { listStyles } from './OrcamentoListStyle';
import { useAuth } from '../../context/AuthContext';
import budgetListService, { Budget } from '../../services/budgetListService';

// --- Tipagens ---
type BudgetType = 'produto' | 'servico';

const productInitialState = {
    nomeProduto: '',
    custoProducao: '',
    materiaisUtilizados: '',
    margemLucro: '',
    horas: '',
    valorHora: '',
    custoExtra: '',
};

const serviceInitialState = {
    nomeServico: '',
    valorBase: '',
    horasEstimadas: '',
    materiaisServico: '',
    custoServico: '',
    lucroServico: '',
    descricaoServico: '',
};

// --- Componentes de Formulário (Refatorados) ---
type ProductFormProps = {
    data: typeof productInitialState;
    setData: (data: typeof productInitialState) => void;
};

type ServiceFormProps = {
    data: typeof serviceInitialState;
    setData: (data: typeof serviceInitialState) => void;
};

const ProductForm = ({ data, setData }: ProductFormProps) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Orçamento de Produto</Text>
        <TextInput style={styles.input} placeholder="Nome do Produto *" value={data.nomeProduto} onChangeText={v => setData({ ...data, nomeProduto: v })} />
        <TextInput style={styles.input} placeholder="Materiais Utilizados *" value={data.materiaisUtilizados} onChangeText={v => setData({ ...data, materiaisUtilizados: v })} />
        <View style={styles.inputRow}>
            <View style={styles.inputGroup}><TextInput style={styles.input} placeholder="Custo Produção (R$) *" value={data.custoProducao} onChangeText={v => setData({ ...data, custoProducao: v })} keyboardType="numeric" /></View>
            <View style={styles.inputGroup}><TextInput style={styles.input} placeholder="Margem Lucro (%) *" value={data.margemLucro} onChangeText={v => setData({ ...data, margemLucro: v })} keyboardType="numeric" /></View>
        </View>
        <View style={styles.inputRow}>
            <View style={styles.inputGroup}><TextInput style={styles.input} placeholder="Horas Estimadas *" value={data.horas} onChangeText={v => setData({ ...data, horas: v })} keyboardType="numeric" /></View>
            <View style={styles.inputGroup}><TextInput style={styles.input} placeholder="Valor por Hora (R$) *" value={data.valorHora} onChangeText={v => setData({ ...data, valorHora: v })} keyboardType="numeric" /></View>
        </View>
        <TextInput style={styles.input} placeholder="Custos Extras (R$)" value={data.custoExtra} onChangeText={v => setData({ ...data, custoExtra: v })} keyboardType="numeric" />
    </View>
);

const ServiceForm = ({ data, setData }: ServiceFormProps) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Orçamento de Serviço</Text>
        <TextInput style={styles.input} placeholder="Nome do Serviço *" value={data.nomeServico} onChangeText={v => setData({ ...data, nomeServico: v })} />
        <TextInput style={styles.input} placeholder="Materiais Utilizados *" value={data.materiaisServico} onChangeText={v => setData({ ...data, materiaisServico: v })} />
        <View style={styles.inputRow}>
            <View style={styles.inputGroup}><TextInput style={styles.input} placeholder="Valor Base (R$) *" value={data.valorBase} onChangeText={v => setData({ ...data, valorBase: v })} keyboardType="numeric" /></View>
            <View style={styles.inputGroup}><TextInput style={styles.input} placeholder="Horas Estimadas *" value={data.horasEstimadas} onChangeText={v => setData({ ...data, horasEstimadas: v })} keyboardType="numeric" /></View>
        </View>
        <View style={styles.inputRow}>
            <View style={styles.inputGroup}><TextInput style={styles.input} placeholder="Custo Materiais (R$) *" value={data.custoServico} onChangeText={v => setData({ ...data, custoServico: v })} keyboardType="numeric" /></View>
            <View style={styles.inputGroup}><TextInput style={styles.input} placeholder="Lucro (%) *" value={data.lucroServico} onChangeText={v => setData({ ...data, lucroServico: v })} keyboardType="numeric" /></View>
        </View>
        <TextInput style={styles.input} placeholder="Descrição do serviço" value={data.descricaoServico} onChangeText={v => setData({ ...data, descricaoServico: v })} multiline />
    </View>
);


// --- Componente Principal ---
export const OrcamentosScreen = () => {
    const insets = useSafeAreaInsets();
    const { token } = useAuth();

    const [budgetType, setBudgetType] = useState<BudgetType>('produto');
    const [productData, setProductData] = useState(productInitialState);
    const [serviceData, setServiceData] = useState(serviceInitialState);

    const [isLoading, setIsLoading] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultText, setResultText] = useState('');

    // Estados para lista de orçamentos
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isLoadingBudgets, setIsLoadingBudgets] = useState(false);
    const [showBudgetDetailModal, setShowBudgetDetailModal] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');

    useEffect(() => {
        if (activeTab === 'list' && token) {
            loadBudgets();
        }
    }, [activeTab, token]);

    const loadBudgets = async () => {
        if (!token) return;
        setIsLoadingBudgets(true);
        try {
            const data = await budgetListService.fetchBudgets(token);
            setBudgets(data);
        } catch (error) {
            console.error('Erro ao carregar orçamentos:', error);
            Alert.alert('Erro', 'Não foi possível carregar seus orçamentos.');
        } finally {
            setIsLoadingBudgets(false);
        }
    };

    const handleGenerateBudget = async () => {
        const data = budgetType === 'produto' ? productData : serviceData;
        const requiredFields = budgetType === 'produto'
            ? ['nomeProduto', 'custoProducao', 'materiaisUtilizados', 'margemLucro', 'horas', 'valorHora']
            : ['nomeServico', 'valorBase', 'horasEstimadas', 'materiaisServico', 'custoServico', 'lucroServico'];

        // Type casting para validar campos
        if (requiredFields.some(field => {
            const value = (data as any)[field];
            return !value;
        })) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios (*).');
            return;
        }

        if (!token) {
            Alert.alert('Erro', 'Você precisa estar autenticado para gerar um orçamento.');
            return;
        }

        setIsLoading(true);
        try {
            console.log('🔗 URL:', `${API_BASE_URL}/orcamento`);
            console.log('📝 Enviando dados:', data);
            console.log('🔐 Token sendo enviado:', token?.substring(0, 20) + '...');
            console.log('🔐 Header Authorization:', `Bearer ${token?.substring(0, 20)}...`);

            const response = await fetch(`${API_BASE_URL}/orcamento`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            console.log('📥 Response Status:', response.status);
            console.log('📥 Response OK:', response.ok);

            const result = await response.json();
            console.log('📥 Response JSON:', result);

            if (!response.ok) {
                console.error('❌ Erro HTTP:', result);
                throw new Error(result.erro || result.error || 'Erro ao gerar orçamento');
            }

            console.log('✅ Sucesso!');
            setResultText(result.resposta);
            setShowResultModal(true);

            // Limpar formulário após sucesso
            setProductData(productInitialState);
            setServiceData(serviceInitialState);

            // Recarregar lista se estiver aberta
            if (activeTab === 'list') {
                loadBudgets();
            }

        } catch (error) {
            console.error('🚨 ERRO:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            Alert.alert('Erro ao Gerar Orçamento', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteBudget = async (id: number, tipo: 'produto' | 'servico') => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir este orçamento?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (!token) return;
                            await budgetListService.deleteBudget(token, id, tipo);
                            Alert.alert('Sucesso', 'Orçamento excluído com sucesso!');
                            loadBudgets();
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir o orçamento.');
                        }
                    },
                },
            ]
        );
    };

    const handleViewBudget = (budget: Budget) => {
        setSelectedBudget(budget);
        setShowBudgetDetailModal(true);
    };

    const renderBudgetItem = ({ item }: { item: Budget }) => (
        <View style={[
            listStyles.budgetItem,
            item.tipo === 'produto' ? listStyles.budgetItemProduct : listStyles.budgetItemService
        ]}>
            <View style={listStyles.budgetItemHeader}>
                <Text style={listStyles.budgetName} numberOfLines={2}>{item.nome}</Text>
                <View style={[
                    listStyles.budgetType,
                    item.tipo === 'produto' ? listStyles.budgetTypeProduct : listStyles.budgetTypeService
                ]}>
                    <Text style={{
                        color: item.tipo === 'produto' ? '#4CAF50' : '#2196F3',
                        fontWeight: 'bold',
                        fontSize: 11
                    }}>
                        {item.tipo === 'produto' ? 'Produto' : 'Serviço'}
                    </Text>
                </View>
            </View>
            <Text style={listStyles.budgetDate}>
                {new Date(item.data).toLocaleDateString('pt-BR')}
            </Text>
            <View style={listStyles.budgetActions}>
                <TouchableOpacity
                    style={[listStyles.actionButton, listStyles.viewButton]}
                    onPress={() => handleViewBudget(item)}
                >
                    <Ionicons name="eye-outline" size={14} color="#fff" />
                    <Text style={listStyles.actionButtonText}>Visualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[listStyles.actionButton, listStyles.deleteButton]}
                    onPress={() => handleDeleteBudget(item.id, item.tipo)}
                >
                    <Ionicons name="trash-outline" size={14} color="#fff" />
                    <Text style={listStyles.actionButtonText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyList = () => (
        <View style={listStyles.emptyContainer}>
            <Ionicons name="document-outline" size={48} color="#ccc" />
            <Text style={listStyles.emptyText}>Nenhum orçamento gerado ainda</Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Abas de Navegação */}
            <View style={styles.tabSelectorContainer}>
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'form' && styles.tabButtonActive]} 
                    onPress={() => setActiveTab('form')}
                >
                    <Ionicons name="add-circle-outline" size={16} color={activeTab === 'form' ? '#fff' : '#666'} />
                    <Text style={[styles.tabText, activeTab === 'form' && styles.tabTextActive]}>Gerar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'list' && styles.tabButtonActive]} 
                    onPress={() => setActiveTab('list')}
                >
                    <Ionicons name="list-outline" size={16} color={activeTab === 'list' ? '#fff' : '#666'} />
                    <Text style={[styles.tabText, activeTab === 'list' && styles.tabTextActive]}>Meus Orçamentos</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'form' ? (
                <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.tabSelectorContainer}>
                        <TouchableOpacity style={[styles.tabButton, budgetType === 'produto' && styles.tabButtonActive]} onPress={() => setBudgetType('produto')}>
                            <Text style={[styles.tabText, budgetType === 'produto' && styles.tabTextActive]}>Produto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tabButton, budgetType === 'servico' && styles.tabButtonActive]} onPress={() => setBudgetType('servico')}>
                            <Text style={[styles.tabText, budgetType === 'servico' && styles.tabTextActive]}>Serviço</Text>
                        </TouchableOpacity>
                    </View>

                    {budgetType === 'produto' ? <ProductForm data={productData} setData={setProductData} /> : <ServiceForm data={serviceData} setData={setServiceData} />}

                    <TouchableOpacity style={styles.button} onPress={handleGenerateBudget} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="calculator-outline" size={20} color={styles.buttonText.color} />
                                <Text style={styles.buttonText}>Gerar Orçamento</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <View style={{ flex: 1 }}>
                    {isLoadingBudgets ? (
                        <View style={listStyles.emptyContainer}>
                            <ActivityIndicator size="large" color="#2196F3" />
                            <Text style={listStyles.emptyText}>Carregando orçamentos...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={budgets}
                            renderItem={renderBudgetItem}
                            keyExtractor={(item) => `${item.tipo}-${item.id}`}
                            ListEmptyComponent={renderEmptyList}
                            contentContainerStyle={budgets.length === 0 ? { flex: 1 } : undefined}
                            scrollEnabled
                        />
                    )}
                </View>
            )}

            {/* Modal do Resultado da Geração */}
            <Modal visible={showResultModal} transparent animationType="slide">
                <View style={listStyles.modalContainer}>
                    <View style={listStyles.modalContent}>
                        <Text style={listStyles.modalTitle}>Orçamento Gerado</Text>
                        <ScrollView style={{ maxHeight: 400 }}>
                            <Text selectable style={listStyles.modalText}>{resultText}</Text>
                        </ScrollView>
                        <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => setShowResultModal(false)}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de Detalhes do Orçamento */}
            <Modal visible={showBudgetDetailModal} transparent animationType="slide">
                <View style={listStyles.modalContainer}>
                    <View style={listStyles.modalContent}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={listStyles.modalTitle}>{selectedBudget?.nome}</Text>
                            <TouchableOpacity onPress={() => setShowBudgetDetailModal(false)}>
                                <Ionicons name="close-outline" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ maxHeight: 500 }}>
                            <Text selectable style={listStyles.modalText}>{selectedBudget?.resposta}</Text>
                        </ScrollView>
                        <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => setShowBudgetDetailModal(false)}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
