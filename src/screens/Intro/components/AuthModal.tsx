import React, { useState } from 'react'
import {
    Modal,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from '../../../components'
import { useThemeColor } from '../../../hooks'
import { useAuth } from '../../../context/AuthContext'

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxWidth: 600,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    closeButton: {
        padding: 8,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#228F2F',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#228F2F',
    },
    formContainer: {
        padding: 24,
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
    submitButton: {
        backgroundColor: '#113815',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 8,
    },
    toggleText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 14,
    },
    toggleLink: {
        color: '#228F2F',
        fontWeight: '600',
    },
})

interface AuthModalProps {
    visible: boolean
    onClose: () => void
    onLoginSuccess: () => void
    isLoading?: boolean
}

type TabType = 'login' | 'register'

export const AuthModal: React.FC<AuthModalProps> = ({
    visible,
    onClose,
    onLoginSuccess,
    isLoading = false,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('login')
    const [focusedInput, setFocusedInput] = useState<string | null>(null)

    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    const [regName, setRegName] = useState('')
    const [regEmail, setRegEmail] = useState('')
    const [regPassword, setRegPassword] = useState('')
    const [regConfirmPassword, setRegConfirmPassword] = useState('')

    const primaryColor = useThemeColor({}, 'primary')
    const { login, register } = useAuth()

    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) {
            Alert.alert('Erro', 'Preencha email e senha')
            return
        }
        try {
            await login(loginEmail, loginPassword)
            onLoginSuccess()
        } catch (error) {
            Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao fazer login')
        }
    }

    const handleRegister = async () => {
        if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
            Alert.alert('Erro', 'Preencha todos os campos')
            return
        }
        if (regPassword !== regConfirmPassword) {
            Alert.alert('Erro', 'Senhas não conferem')
            return
        }
        try {
            await register(regName, regEmail, regPassword)
            onLoginSuccess()
        } catch (error) {
            Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao registrar')
        }
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>
                            {activeTab === 'login' ? 'Login' : 'Criar Conta'}
                        </ThemedText>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'login' && styles.tabActive]}
                            onPress={() => setActiveTab('login')}
                            disabled={isLoading}
                        >
                            <ThemedText
                                style={[
                                    styles.tabText,
                                    activeTab === 'login' && styles.tabTextActive,
                                ]}
                            >
                                Login
                            </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'register' && styles.tabActive]}
                            onPress={() => setActiveTab('register')}
                            disabled={isLoading}
                        >
                            <ThemedText
                                style={[
                                    styles.tabText,
                                    activeTab === 'register' && styles.tabTextActive,
                                ]}
                            >
                                Registrar
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView style={styles.formContainer}>
                        {activeTab === 'login' ? (
                            <>
                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'loginEmail' && styles.inputFocused,
                                    ]}
                                    placeholder="Email"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    value={loginEmail}
                                    onChangeText={setLoginEmail}
                                    onFocus={() => setFocusedInput('loginEmail')}
                                    onBlur={() => setFocusedInput(null)}
                                    editable={!isLoading}
                                />

                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'loginPassword' && styles.inputFocused,
                                    ]}
                                    placeholder="Senha"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    value={loginPassword}
                                    onChangeText={setLoginPassword}
                                    onFocus={() => setFocusedInput('loginPassword')}
                                    onBlur={() => setFocusedInput(null)}
                                    editable={!isLoading}
                                />

                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
                                    onPress={() => setRememberMe(!rememberMe)}
                                    disabled={isLoading}
                                >
                                    <Ionicons
                                        name={rememberMe ? 'checkbox' : 'checkbox-outline'}
                                        size={20}
                                        color={primaryColor}
                                        style={{ marginRight: 8 }}
                                    />
                                    <ThemedText style={{ fontSize: 14 }}>Lembrar de mim</ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons name="log-in" size={18} color="#fff" />
                                            <ThemedText style={styles.submitButtonText}>
                                                Entrar
                                            </ThemedText>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <ThemedText style={styles.toggleText}>
                                    Não tem conta?{' '}
                                    <ThemedText
                                        style={styles.toggleLink}
                                        onPress={() => setActiveTab('register')}
                                    >
                                        Registre-se
                                    </ThemedText>
                                </ThemedText>
                            </>
                        ) : (
                            <>
                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'regName' && styles.inputFocused,
                                    ]}
                                    placeholder="Nome Completo"
                                    placeholderTextColor="#999"
                                    value={regName}
                                    onChangeText={setRegName}
                                    onFocus={() => setFocusedInput('regName')}
                                    onBlur={() => setFocusedInput(null)}
                                    editable={!isLoading}
                                />

                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'regEmail' && styles.inputFocused,
                                    ]}
                                    placeholder="Email"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    value={regEmail}
                                    onChangeText={setRegEmail}
                                    onFocus={() => setFocusedInput('regEmail')}
                                    onBlur={() => setFocusedInput(null)}
                                    editable={!isLoading}
                                />

                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'regPassword' && styles.inputFocused,
                                    ]}
                                    placeholder="Senha"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    value={regPassword}
                                    onChangeText={setRegPassword}
                                    onFocus={() => setFocusedInput('regPassword')}
                                    onBlur={() => setFocusedInput(null)}
                                    editable={!isLoading}
                                />

                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'regConfirm' && styles.inputFocused,
                                    ]}
                                    placeholder="Confirmar Senha"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    value={regConfirmPassword}
                                    onChangeText={setRegConfirmPassword}
                                    onFocus={() => setFocusedInput('regConfirm')}
                                    onBlur={() => setFocusedInput(null)}
                                    editable={!isLoading}
                                />

                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleRegister}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons name="person-add" size={18} color="#fff" />
                                            <ThemedText style={styles.submitButtonText}>
                                                Cadastrar
                                            </ThemedText>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <ThemedText style={styles.toggleText}>
                                    Já tem conta?{' '}
                                    <ThemedText
                                        style={styles.toggleLink}
                                        onPress={() => setActiveTab('login')}
                                    >
                                        Faça Login
                                    </ThemedText>
                                </ThemedText>
                            </>
                        )}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}
