import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';
import { styles } from './OrcamentoStyle';
import { useAuth } from '../../context/AuthContext';

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
            console.log('� Enviando dados:', data);

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

        } catch (error) {
            console.error('🚨 ERRO:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            Alert.alert('Erro ao Gerar Orçamento', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
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

            <Modal visible={showResultModal} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%' }}>
                        <Text style={styles.sectionTitle}>Orçamento Gerado</Text>
                        <ScrollView style={{ maxHeight: 400 }}>
                            <Text selectable>{resultText}</Text>
                        </ScrollView>
                        <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => setShowResultModal(false)}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
