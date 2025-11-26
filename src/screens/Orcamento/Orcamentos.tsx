import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Modal, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
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
    const { token, refreshToken } = useAuth();

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
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [editedResposta, setEditedResposta] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (activeTab === 'list' && token) {
            setCurrentPage(1);
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
        let currentToken = token;

        try {
            // Tenta renovar o token ANTES de fazer a requisição
            console.log('🔄 Tentando renovar token antes de gerar orçamento...');
            try {
                currentToken = await refreshToken();
                console.log('✅ Token renovado com sucesso! Novo token:', currentToken?.substring(0, 20) + '...');
            } catch (refreshError) {
                console.warn('⚠️ Falha ao renovar token, continuando com token atual:', refreshError);
                currentToken = token;
            }

            console.log('🔗 URL:', `${API_BASE_URL}/orcamento`);
            console.log('📝 Enviando dados:', data);
            console.log('🔐 Token sendo enviado:', currentToken?.substring(0, 20) + '...');
            console.log('🔐 Header Authorization:', `Bearer ${currentToken?.substring(0, 20)}...`);

            const response = await fetch(`${API_BASE_URL}/orcamento`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`,
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

            // Se for erro de token expirado, tentar renovar
            if (errorMessage.includes('jwt expired') || errorMessage.includes('token')) {
                console.log('🔄 Token expirado, tentando renovar novamente...');
                try {
                    const newToken = await refreshToken();
                    Alert.alert('Token Renovado', 'Sua sessão foi renovada. Tente novamente.');
                } catch (refreshError) {
                    Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
                }
            } else {
                Alert.alert('Erro ao Gerar Orçamento', errorMessage);
            }
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
        setEditedResposta(budget.resposta);
        setIsEditingBudget(false);
        setShowBudgetDetailModal(true);
    };

    const handleSaveBudgetEdit = async () => {
        if (!selectedBudget || !token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/orcamento/${selectedBudget.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    resposta: editedResposta,
                    tipo: selectedBudget.tipo,
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar alterações');
            }

            Alert.alert('Sucesso', 'Orçamento atualizado com sucesso!');
            setIsEditingBudget(false);
            loadBudgets();
            setShowBudgetDetailModal(false);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar as alterações.');
            console.error('Erro ao salvar:', error);
        }
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
                    <Ionicons name="pencil-outline" size={14} color="#fff" />
                    <Text style={listStyles.actionButtonText}>Editar</Text>
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

    // Cálculo de paginação
    const totalPages = Math.ceil(budgets.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBudgets = budgets.slice(startIndex, startIndex + itemsPerPage);

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
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 80 }}>
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
                </KeyboardAvoidingView>
            ) : (
                <View style={{ flex: 1 }}>
                    {isLoadingBudgets ? (
                        <View style={listStyles.emptyContainer}>
                            <ActivityIndicator size="large" color="#2196F3" />
                            <Text style={listStyles.emptyText}>Carregando orçamentos...</Text>
                        </View>
                    ) : budgets.length === 0 ? (
                        renderEmptyList()
                    ) : (
                        <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: 15 }}>
                            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                                {paginatedBudgets.map((budget) => (
                                    <View key={`${budget.tipo}-${budget.id}`}>
                                        {renderBudgetItem({ item: budget })}
                                    </View>
                                ))}
                            </ScrollView>
                            {/* Controles de Paginação */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, marginTop: 10, borderTopWidth: 1, borderTopColor: '#ddd' }}>
                                <TouchableOpacity
                                    style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: currentPage > 1 ? '#228F2F' : '#ccc', borderRadius: 6 }}
                                    onPress={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>← Anterior</Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>
                                    Página {currentPage} de {totalPages} ({budgets.length} orçamentos)
                                </Text>
                                <TouchableOpacity
                                    style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: currentPage < totalPages ? '#228F2F' : '#ccc', borderRadius: 6 }}
                                    onPress={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>Próxima →</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={listStyles.modalContainer}>
                        <View style={[listStyles.modalContent, { height: '75%', flexDirection: 'column' }]}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={[listStyles.modalTitle, { marginBottom: 0, fontSize: 16 }]}>{selectedBudget?.nome}</Text>
                                    <TouchableOpacity onPress={() => setShowBudgetDetailModal(false)}>
                                        <Ionicons name="close-outline" size={22} color="#333" />
                                    </TouchableOpacity>
                                </View>
                                {isEditingBudget ? (
                                    <>
                                        <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 8, color: '#666' }}>Editar Orçamento:</Text>
                                        <TextInput
                                            style={[styles.input, { flex: 1, textAlignVertical: 'top', paddingTop: 10, paddingBottom: 10, marginBottom: 0, fontSize: 13 }]}
                                            multiline
                                            value={editedResposta}
                                            onChangeText={setEditedResposta}
                                            placeholder="Edite o conteúdo do orçamento..."
                                            scrollEnabled
                                        />
                                    </>
                                ) : (
                                    <ScrollView style={{ flex: 1, marginBottom: 8 }}>
                                        <Text selectable style={[listStyles.modalText, { fontSize: 13, marginBottom: 0 }]}>{selectedBudget?.resposta}</Text>
                                    </ScrollView>
                                )}
                            </View>
                            <View style={{ flexDirection: 'row', gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' }}>
                                {isEditingBudget ? (
                                    <>
                                        <TouchableOpacity
                                            style={[styles.button, { flex: 1, backgroundColor: '#4CAF50', marginTop: 0, paddingVertical: 12 }]}
                                            onPress={handleSaveBudgetEdit}
                                        >
                                            <Ionicons name="checkmark-outline" size={14} color="#fff" />
                                            <Text style={[styles.buttonText, { fontSize: 13 }]}>Salvar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.button, { flex: 1, backgroundColor: '#f44336', marginTop: 0, paddingVertical: 12 }]}
                                            onPress={() => {
                                                setIsEditingBudget(false);
                                                setEditedResposta(selectedBudget?.resposta || '');
                                            }}
                                        >
                                            <Ionicons name="close-outline" size={14} color="#fff" />
                                            <Text style={[styles.buttonText, { fontSize: 13 }]}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            style={[styles.button, { flex: 1, marginTop: 0, paddingVertical: 12 }]}
                                            onPress={() => setIsEditingBudget(true)}
                                        >
                                            <Ionicons name="pencil-outline" size={14} color="#fff" />
                                            <Text style={[styles.buttonText, { fontSize: 13 }]}>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.button, { flex: 1, backgroundColor: '#666', marginTop: 0, paddingVertical: 12 }]}
                                            onPress={() => setShowBudgetDetailModal(false)}
                                        >
                                            <Ionicons name="close-outline" size={14} color="#fff" />
                                            <Text style={[styles.buttonText, { fontSize: 13 }]}>Fechar</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};
