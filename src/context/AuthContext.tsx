import React, { createContext, useState, useCallback, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authService } from '../services/authService'

export interface User {
    id: string
    name: string
    email: string
    avatar?: string
}

export interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    clearError: () => void
    checkAuth: () => Promise<void>
    refreshUser: () => Promise<void>
    refreshToken: () => Promise<string>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: React.ReactNode
}

const STORAGE_KEY = '@budget_app_token'
const USER_STORAGE_KEY = '@budget_app_user'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Verificar se há token armazenado na inicialização
    const checkAuth = useCallback(async () => {
        try {
            setIsLoading(true)
            const storedToken = await AsyncStorage.getItem(STORAGE_KEY)
            const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY)

            if (storedToken && storedUser) {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            }
        } catch (err) {
            console.error('Erro ao verificar autenticação:', err)
            setError('Erro ao carregar sessão')
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Executar checkAuth na inicialização
    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    const login = useCallback(async (email: string, password: string) => {
        try {
            setIsLoading(true)
            setError(null)

            // Fazer o login para obter o token e os dados do usuário
            const loginResponse = await authService.login(email, password)
            const { token, user } = loginResponse;

            console.log('✅ [AuthContext.login] Token recebido:', token?.substring(0, 20) + '...')
            console.log('✅ [AuthContext.login] User:', user)

            // Salvar o token e o usuário no AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEY, token)
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))

            console.log('✅ [AuthContext.login] Dados salvos no AsyncStorage')

            // Atualizar o estado do contexto
            setToken(token)
            setUser(user)

            console.log('✅ [AuthContext.login] Estado atualizado. Token no state:', token?.substring(0, 20) + '...')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
            setError(errorMessage)
            // Limpar dados antigos em caso de erro de login
            await AsyncStorage.removeItem(STORAGE_KEY);
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
            setToken(null);
            setUser(null);
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    const register = useCallback(async (name: string, email: string, password: string) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await authService.register(name, email, password)

            await AsyncStorage.setItem(STORAGE_KEY, response.token)
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user))

            setToken(response.token)
            setUser(response.user)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar'
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            setIsLoading(true)
            // TODO: Chamar API de logout se necessário

            await AsyncStorage.removeItem(STORAGE_KEY)
            await AsyncStorage.removeItem(USER_STORAGE_KEY)

            setToken(null)
            setUser(null)
            setError(null)
        } catch (err) {
            console.error('Erro ao fazer logout:', err)
            setError('Erro ao fazer logout')
        } finally {
            setIsLoading(false)
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    const refreshUser = useCallback(async () => {
        if (!token) return;
        try {
            const updatedUser = await authService.getProfile(token);
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (err) {
            console.error("Erro ao atualizar dados do usuário:", err);
            // Opcional: Tratar erro, talvez fazer logout se o token for inválido
        }
    }, [token]);

    const refreshTokenHandler = useCallback(async (): Promise<string> => {
        if (!token) {
            throw new Error('Nenhum token para renovar');
        }
        try {
            console.log('🔄 [AuthContext.refreshTokenHandler] Tentando renovar token...');
            const newToken = await authService.refreshToken(token);

            console.log('✅ [AuthContext.refreshTokenHandler] Token renovado com sucesso');
            console.log('✅ [AuthContext.refreshTokenHandler] Novo token:', newToken?.substring(0, 20) + '...');

            // Salvar o novo token no AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEY, newToken);

            // Atualizar o estado
            setToken(newToken);
            setError(null);

            return newToken;
        } catch (err) {
            console.error('❌ [AuthContext.refreshTokenHandler] Erro ao renovar token:', err);
            // Se não conseguir renovar, fazer logout
            await logout();
            setError('Sessão expirada. Por favor, faça login novamente.');
            throw err;
        }
    }, [token]);

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        checkAuth,
        refreshUser,
        refreshToken: refreshTokenHandler,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
