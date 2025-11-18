import React, { useState, useEffect } from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    TextInput,
    Modal,
    Image,
    ActivityIndicator,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ThemedText, ThemedView } from '../../components'
import { useThemeColor } from '../../hooks'
import { useAuth } from '../../context/AuthContext'
import { StackScreenProps } from '@react-navigation/stack'
import { AppStackParamList } from '../../navigation/AppStack'
import { authService } from '../../services/authService'

type HomeScreenProps = StackScreenProps<AppStackParamList, 'Home'>

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#BCDBBC',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#a3d5a3',
    },
    headerBrand: {
        fontSize: 22,
        fontWeight: '700',
        color: '#228F2F',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    headerButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#113815',
        borderRadius: 6,
    },
    headerButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    profileCard: {
        backgroundColor: '#BCDBBC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 3,
        borderColor: '#228F2F',
        overflow: 'hidden',
    },
    profileImagePhoto: {
        width: '100%',
        height: '100%',
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#228F2F',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 13,
        color: '#555',
        marginBottom: 12,
    },
    profileButtonGroup: {
        flexDirection: 'row',
        gap: 8,
        width: '100%',
    },
    profileButton: {
        flex: 1,
        backgroundColor: '#228F2F',
        paddingVertical: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    budgetsContainer: {
        backgroundColor: '#BCDBBC',
        borderRadius: 12,
        padding: 12,
        flex: 1,
        marginBottom: 80,
    },
    budgetItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },
    budgetItemContent: {
        flex: 1,
    },
    budgetItemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#228F2F',
        marginBottom: 2,
    },
    budgetItemDate: {
        fontSize: 12,
        color: '#999',
    },
    budgetItemAction: {
        flexDirection: 'row',
        gap: 8,
    },
    budgetEmpty: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    budgetEmptyText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#BCDBBC',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#a3d5a3',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    navItem: {
        flex: 1,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 3,
        borderTopColor: 'transparent',
    },
    navItemActive: {
        borderTopColor: '#228F2F',
    },
    navText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#666',
        marginTop: 4,
    },
    navTextActive: {
        color: '#228F2F',
    },
    editModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    editModalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxHeight: '90%',
    },
    editModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#228F2F',
        marginBottom: 16,
        textAlign: 'center',
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    photoPreview: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#BCDBBC',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#228F2F',
        overflow: 'hidden',
    },
    photoPreviewImage: {
        width: '100%',
        height: '100%',
    },
    photoButtonGroup: {
        flexDirection: 'row',
        gap: 8,
        width: '100%',
    },
    photoButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    photoButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 14,
        backgroundColor: '#fff',
    },
    inputFocused: {
        borderColor: '#228F2F',
    },
    inputLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
        fontWeight: '600',
    },
    formButtons: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 16,
    },
    formButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formButtonSave: {
        backgroundColor: '#228F2F',
    },
    formButtonCancel: {
        backgroundColor: '#ddd',
    },
    formButtonDelete: {
        backgroundColor: '#c0392b',
    },
    formButtonText: {
        fontWeight: '600',
        fontSize: 14,
    },
    formButtonSaveText: {
        color: '#fff',
    },
    formButtonCancelText: {
        color: '#333',
    },
    ctaButton: {
        backgroundColor: '#228F2F',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 12,
        width: '100%',
    },
    ctaButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    deleteSection: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
})

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState<'perfil' | 'orcamentos'>('perfil')
    const [showEditModal, setShowEditModal] = useState(false)
    const [editName, setEditName] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [editPassword, setEditPassword] = useState('')
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
    const [focusedInput, setFocusedInput] = useState<string | null>(null)
    const [budgets, setBudgets] = useState<any[]>([])
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const insets = useSafeAreaInsets()
    const { user, logout, token, refreshUser } = useAuth()

    useEffect(() => {
        if (user?.id) {
            loadSavedPhoto()
        }
    }, [user?.id]);

    const openEditModal = () => {
        setEditName(user?.name || '');
        setEditEmail(user?.email || '');
        setEditPassword('');
        setShowEditModal(true);
    }

    const loadSavedPhoto = async () => {
        try {
            const photoPath = await AsyncStorage.getItem(`userPhoto_${user?.id}`)
            if (photoPath) setProfilePhoto(photoPath)
        } catch (error) { console.error('Erro ao carregar foto:', error) }
    }

    const savePhotoToStorage = async (photoUri: string) => {
        try {
            await AsyncStorage.setItem(`userPhoto_${user?.id}`, photoUri)
            setProfilePhoto(photoUri)
        } catch (error) {
            console.error('Erro ao salvar foto:', error)
            Alert.alert('Erro', 'Não foi possível salvar a foto')
        }
    }

    const handleLogout = () => {
        Alert.alert('Sair', 'Deseja realmente sair?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', onPress: async () => { await logout() }, style: 'destructive' },
        ])
    }

    const handleGenerateBudget = () => navigation.navigate('Orcamentos');

    const pickImageFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão negada', 'É necessário permissão para acessar a galeria');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
        if (!result.canceled && result.assets[0]) {
            await savePhotoToStorage(result.assets[0].uri);
        }
    }

    const takePhotoWithCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão negada', 'É necessário permissão para usar a câmera');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
        if (!result.canceled && result.assets[0]) {
            await savePhotoToStorage(result.assets[0].uri);
        }
    }

    const handleSaveProfile = async () => {
        if (!editName) {
            Alert.alert('Erro', 'O nome não pode ficar em branco.');
            return;
        }
        if (!token) {
            Alert.alert('Erro', 'Você não está autenticado.');
            return;
        }
        setIsSaving(true);
        try {
            const payload: { name?: string; email?: string; password?: string } = {};
            if (editName !== user?.name) payload.name = editName;
            if (editEmail && editEmail !== user?.email) payload.email = editEmail;
            if (editPassword) payload.password = editPassword;

            if (Object.keys(payload).length === 0) {
                setShowEditModal(false);
                return;
            }
            await authService.updateProfile(token, payload);
            await refreshUser();
            Alert.alert('Sucesso', 'Seu perfil foi atualizado.');
            setShowEditModal(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
            Alert.alert('Erro ao Salvar', errorMessage);
        } finally {
            setIsSaving(false);
        }
    }

    const handleDeletePress = () => {
        setShowEditModal(false);
        Alert.alert(
            'Excluir Conta',
            'Você tem certeza? Esta ação é irreversível e todos os seus dados, incluindo orçamentos, serão perdidos.',
            [
                { text: 'Cancelar', style: 'cancel', onPress: () => setShowEditModal(true) },
                { text: 'Sim, excluir', style: 'destructive', onPress: () => setShowDeleteModal(true) },
            ]
        );
    };

    const handleConfirmDelete = async () => {
        if (!deletePassword) {
            Alert.alert('Erro', 'Por favor, insira sua senha para confirmar.');
            return;
        }
        if (!user?.email || !token) {
            Alert.alert('Erro', 'Não foi possível verificar sua identidade.');
            return;
        }

        setIsDeleting(true);
        try {
            await authService.login(user.email, deletePassword);
            await authService.deleteAccount(token);
            Alert.alert('Conta Excluída', 'Sua conta foi excluída com sucesso.');
            setShowDeleteModal(false);
            await logout();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
            Alert.alert('Erro', `Não foi possível excluir a conta: ${errorMessage}`);
        } finally {
            setIsDeleting(false);
            setDeletePassword('');
        }
    };

    const renderPerfilTab = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.profileCard}>
                <View style={styles.profileImage}>
                    {profilePhoto ? <Image source={{ uri: profilePhoto }} style={styles.profileImagePhoto} /> : <Ionicons name="person-circle" size={90} color="#228F2F" />}
                </View>
                <ThemedText style={styles.profileName}>{user?.name || 'Usuário'}</ThemedText>
                <ThemedText style={styles.profileEmail}>{user?.email || 'email@example.com'}</ThemedText>
                <View style={styles.profileButtonGroup}>
                    <TouchableOpacity style={[styles.profileButton]} onPress={openEditModal}>
                        <Ionicons name="pencil" size={16} color="#fff" />
                        <ThemedText style={[styles.profileButtonText, { marginTop: 2 }]}>Editar</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.profileButton, { backgroundColor: '#ff6b6b' }]} onPress={handleLogout}>
                        <Ionicons name="log-out" size={16} color="#fff" />
                        <ThemedText style={[styles.profileButtonText, { marginTop: 2 }]}>Sair</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.ctaButton} onPress={handleGenerateBudget}>
                <ThemedText style={styles.ctaButtonText}>➕ Gerar Novo Orçamento</ThemedText>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderOrcamentosTab = () => (
        <View style={{ flex: 1 }}>
            <View style={styles.budgetsContainer}>
                {budgets.length === 0 ? (
                    <View style={styles.budgetEmpty}>
                        <Ionicons name="document-outline" size={48} color="#ccc" />
                        <ThemedText style={styles.budgetEmptyText}>Nenhum orçamento gerado</ThemedText>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {budgets.map((budget, index) => (
                            <View key={index} style={styles.budgetItem}>
                                <View style={styles.budgetItemContent}>
                                    <ThemedText style={styles.budgetItemTitle}>{budget.name}</ThemedText>
                                    <ThemedText style={styles.budgetItemDate}>{new Date(budget.date || Date.now()).toLocaleDateString('pt-BR')}</ThemedText>
                                </View>
                                <View style={styles.budgetItemAction}>
                                    <TouchableOpacity><Ionicons name="eye" size={20} color="#228F2F" /></TouchableOpacity>
                                    <TouchableOpacity><Ionicons name="trash" size={20} color="#ff6b6b" /></TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
            <TouchableOpacity style={[styles.ctaButton, { marginBottom: 70 }]} onPress={handleGenerateBudget}>
                <ThemedText style={styles.ctaButtonText}>➕ Gerar Novo Orçamento</ThemedText>
            </TouchableOpacity>
        </View>
    );

    return (
        <ThemedView style={[{ flex: 1 }]}>
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <ThemedText style={styles.headerBrand}>BudgetGenerator</ThemedText>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerButton} onPress={handleGenerateBudget}>
                        <ThemedText style={styles.headerButtonText}>Novo</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.content}>
                {activeTab === 'perfil' ? renderPerfilTab() : renderOrcamentosTab()}
            </View>
            <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
                <TouchableOpacity style={[styles.navItem, activeTab === 'perfil' && styles.navItemActive]} onPress={() => setActiveTab('perfil')}>
                    <Ionicons name="person" size={24} color={activeTab === 'perfil' ? '#228F2F' : '#666'} />
                    <ThemedText style={[styles.navText, activeTab === 'perfil' && styles.navTextActive]}>Perfil</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, activeTab === 'orcamentos' && styles.navItemActive]} onPress={() => setActiveTab('orcamentos')}>
                    <Ionicons name="document-text" size={24} color={activeTab === 'orcamentos' ? '#228F2F' : '#666'} />
                    <ThemedText style={[styles.navText, activeTab === 'orcamentos' && styles.navTextActive]}>Orçamentos</ThemedText>
                </TouchableOpacity>
            </View>

            {/* Edit Modal */}
            <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={() => setShowEditModal(false)}>
                <View style={styles.editModal}>
                    <View style={styles.editModalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <ThemedText style={styles.editModalTitle}>Alterar Dados da Conta</ThemedText>
                            <View style={styles.photoSection}>
                                <View style={styles.photoPreview}>
                                    {profilePhoto ? <Image source={{ uri: profilePhoto }} style={styles.photoPreviewImage} /> : <Ionicons name="image-outline" size={40} color="#999" />}
                                </View>
                                <View style={styles.photoButtonGroup}>
                                    <TouchableOpacity style={styles.photoButton} onPress={takePhotoWithCamera}><Ionicons name="camera" size={14} color="#333" /><ThemedText style={styles.photoButtonText}>Câmera</ThemedText></TouchableOpacity>
                                    <TouchableOpacity style={styles.photoButton} onPress={pickImageFromGallery}><Ionicons name="image" size={14} color="#333" /><ThemedText style={styles.photoButtonText}>Galeria</ThemedText></TouchableOpacity>
                                </View>
                            </View>
                            <ThemedText style={styles.inputLabel}>Nome</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    focusedInput === 'name' && styles.inputFocused,
                                    { backgroundColor: '#f0f0f0' } // Adicionado para indicar campo não editável
                                ]}
                                placeholder="Digite seu nome completo"
                                placeholderTextColor="#999"
                                value={editName}
                                editable={false} // Campo não editável
                                onChangeText={setEditName}
                                onFocus={() => setFocusedInput('name')}
                                onBlur={() => setFocusedInput(null)}
                            />
                            <ThemedText style={styles.inputLabel}>Novo E-mail</ThemedText>
                            <TextInput style={[styles.input, focusedInput === 'email' && styles.inputFocused]} placeholder="Digite o novo e-mail" keyboardType="email-address" value={editEmail} onChangeText={setEditEmail} onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)} />
                            <ThemedText style={styles.inputLabel}>Nova Senha (deixe em branco para não alterar)</ThemedText>
                            <TextInput style={[styles.input, focusedInput === 'password' && styles.inputFocused]} placeholder="Digite a nova senha" secureTextEntry value={editPassword} onChangeText={setEditPassword} onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)} />
                            <View style={styles.formButtons}>
                                <TouchableOpacity style={[styles.formButton, styles.formButtonSave, isSaving && { backgroundColor: '#ccc' }]} onPress={handleSaveProfile} disabled={isSaving}>
                                    {isSaving ? <ActivityIndicator color="#fff" /> : <ThemedText style={[styles.formButtonText, styles.formButtonSaveText]}>Salvar</ThemedText>}
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.formButton, styles.formButtonCancel]} onPress={() => setShowEditModal(false)} disabled={isSaving}>
                                    <ThemedText style={[styles.formButtonText, styles.formButtonCancelText]}>Cancelar</ThemedText>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.deleteSection}>
                                <TouchableOpacity style={[styles.formButton, styles.formButtonDelete]} onPress={handleDeletePress} disabled={isSaving}>
                                    <ThemedText style={[styles.formButtonText, { color: '#fff' }]}>Excluir Conta</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
                <View style={styles.editModal}>
                    <View style={styles.editModalContent}>
                        <ThemedText style={styles.editModalTitle}>Confirmar Exclusão</ThemedText>
                        <ThemedText style={{ marginBottom: 15, textAlign: 'center', color: '#333' }}>Para confirmar a exclusão permanente da sua conta, por favor, digite sua senha atual.</ThemedText>
                        <TextInput
                            style={[styles.input, focusedInput === 'deletePass' && styles.inputFocused]}
                            placeholder="Sua senha atual"
                            secureTextEntry
                            value={deletePassword}
                            onChangeText={setDeletePassword}
                            onFocus={() => setFocusedInput('deletePass')}
                            onBlur={() => setFocusedInput(null)}
                        />
                        <View style={styles.formButtons}>
                            <TouchableOpacity style={[styles.formButton, styles.formButtonDelete, isDeleting && { backgroundColor: '#ccc' }]} onPress={handleConfirmDelete} disabled={isDeleting}>
                                {isDeleting ? <ActivityIndicator color="#fff" /> : <ThemedText style={[styles.formButtonText, { color: '#fff' }]}>Confirmar e Excluir</ThemedText>}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.formButton, styles.formButtonCancel]} onPress={() => setShowDeleteModal(false)} disabled={isDeleting}>
                                <ThemedText style={[styles.formButtonText, styles.formButtonCancelText]}>Cancelar</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    )
}
