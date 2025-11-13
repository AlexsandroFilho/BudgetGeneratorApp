import { User } from '../context/AuthContext'

const API_BASE_URL = 'http://192.168.1.100:5000/api'

export interface LoginResponse {
    token: string
    user: User
}

export interface RegisterResponse {
    token: string
    user: User
}

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        try {
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
            return data
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login'
            throw new Error(errorMessage)
        }
    },

    async register(name: string, email: string, password: string): Promise<RegisterResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Erro ao registrar')
            }

            const data = await response.json()
            return data
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
