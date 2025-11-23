import { API_BASE_URL } from '@env';
import { User } from '../context/AuthContext'

// URL do servidor backend
// Altere para http://192.168.1.100:3000/api quando o servidor estiver em produção
const USE_MOCK_API = false // Mude para true para usar mock sem servidor

export interface LoginResponse {
    token: string
    user: User
}

export interface RegisterResponse {
    token: string
    user: User
}

// Mock data para testes
const mockUsers: { [key: string]: User & { password: string } } = {
    'teste@example.com': {
        id: '1',
        name: 'Usuário Teste',
        email: 'teste@example.com',
        password: 'senha123',
    },
}

// Mock de delay para simular latência de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            if (USE_MOCK_API) {
                await delay(1000)
                const user = mockUsers[email]
                if (!user || user.password !== password) {
                    throw new Error('Email ou senha inválidos')
                }
                const { password: _, ...userWithoutPassword } = user
                return {
                    token: `mock_token_${Date.now()}`,
                    user: userWithoutPassword,
                }
            }

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Erro ao fazer login')
            }

            const data = await response.json()
            console.log('✅ [authService.login] Response recebido:', data)
            console.log('✅ [authService.login] Token:', data.token?.substring(0, 20) + '...')
            return {
                token: data.token,
                user: {
                    id: data.user?.id || '1',
                    name: data.user?.name || 'Usuário',
                    email: data.user?.email || email,
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login'
            throw new Error(errorMessage)
        }
    },

    async getProfile(token: string): Promise<User> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao buscar perfil do usuário');
            }

            const userProfile = await response.json();
            return userProfile;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar perfil';
            throw new Error(errorMessage);
        }
    },

    async updateProfile(token: string, data: { name?: string; email?: string; password?: string }): Promise<User> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao atualizar perfil');
            }

            // O backend deve retornar o usuário atualizado
            const updatedUser = await response.json();
            return updatedUser;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
            throw new Error(errorMessage);
        }
    },

    async deleteAccount(token: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao excluir conta');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir conta';
            throw new Error(errorMessage);
        }
    },

    async register(name: string, email: string, password: string): Promise<RegisterResponse> {
        try {
            if (USE_MOCK_API) {
                await delay(1000)
                if (mockUsers[email]) {
                    throw new Error('Este email já está registrado')
                }
                const newUser: User = {
                    id: `user_${Date.now()}`,
                    name: name,
                    email: email,
                }
                mockUsers[email] = { ...newUser, password }
                return {
                    token: `mock_token_${Date.now()}`,
                    user: newUser,
                }
            }

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmpassword: password
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || error.mensagem || 'Erro ao registrar')
            }

            const data = await response.json()
            return {
                token: data.token,
                user: {
                    id: data.user?.id || '1',
                    name: data.user?.name || name,
                    email: data.user?.email || email,
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar'
            throw new Error(errorMessage)
        }
    },

    async logout(): Promise<void> {
        // TODO: Chamar endpoint de logout se necessário
        console.log('Logout realizado')
    },

    async verifyToken(token: string): Promise<User> {
        try {
            if (USE_MOCK_API) {
                await delay(500)
                // Mock: qualquer token que começa com 'mock_token_' é válido
                if (token.startsWith('mock_token_')) {
                    return {
                        id: '1',
                        name: 'Usuário Teste',
                        email: 'teste@example.com',
                    }
                }
                throw new Error('Token inválido')
            }

            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Token inválido')
            }

            const data = await response.json()
            return data.user
        } catch (error) {
            throw new Error('Token inválido ou expirado')
        }
    },
}
