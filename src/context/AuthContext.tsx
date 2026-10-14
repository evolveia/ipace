import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { StorageService, INITIAL_USER } from '../services/storage';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  failedAttempts: number;
  isLockedOut: boolean;
  toggleTheme: () => void;
  login: (identifier: string, password: string, acceptedTerms: boolean) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  register: (profileData: Partial<UserProfile>, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  resetLockout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);

  // Initialize theme and session from localStorage
  useEffect(() => {
    const savedTheme = (localStorage.getItem('ipace_theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const checkSession = async () => {
      try {
        // As requested: start the application on the login screen
        setUser(null);
        localStorage.removeItem('ipace_session_active');
      } catch (err) {
        console.error('Failed to load session', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('ipace_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const login = async (
    identifier: string,
    password: string,
    acceptedTerms: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    if (isLockedOut) {
      return {
        success: false,
        error: 'Conta temporariamente bloqueada por 5 tentativas incorretas. Tente novamente mais tarde.',
      };
    }

    if (!acceptedTerms) {
      return {
        success: false,
        error: 'Você deve aceitar os Termos de Uso e Política de Privacidade do IPACE.',
      };
    }

    // Validation
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId || !password) {
      return { success: false, error: 'Preencha todos os campos obrigatórios.' };
    }

    // Check failed attempts mock (simulate valid demo password: 'admin' or '123456' or any password >= 6 chars)
    if (password.length < 6) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setIsLockedOut(true);
        return {
          success: false,
          error: 'Limite de 5 tentativas atingido. Acesso bloqueado por segurança.',
        };
      }
      return {
        success: false,
        error: `Senha incorreta. Tentativa ${nextAttempts} de 5 antes do bloqueio.`,
      };
    }

    // Success
    setFailedAttempts(0);
    setIsLockedOut(false);
    const profile = await StorageService.getProfile();
    // If logging in with a specific name/email
    if (cleanId.includes('@')) {
      profile.email = cleanId;
    } else {
      profile.username = cleanId.replace('@', '');
    }
    await StorageService.updateProfile(profile);
    setUser(profile);
    localStorage.setItem('ipace_session_active', 'true');
    return { success: true };
  };

  const loginWithGoogle = async () => {
    const profile = await StorageService.getProfile();
    setUser(profile);
    localStorage.setItem('ipace_session_active', 'true');
    setFailedAttempts(0);
    setIsLockedOut(false);
  };

  const register = async (profileData: Partial<UserProfile>, _password: string) => {
    const defaultData = INITIAL_USER;
    const newProfile: UserProfile = {
      ...defaultData,
      id: `usr_${Date.now()}`,
      name: profileData.name || 'Novo Corredor',
      username: profileData.username || 'corredor.ipace',
      email: profileData.email || 'atleta@ipace.app',
      targetDistance: profileData.targetDistance || '10k',
      level: profileData.level || 'iniciante',
      weightKg: profileData.weightKg || 70,
      heightCm: profileData.heightCm || 175,
      totalKm: 0,
      totalRuns: 0,
      totalMinutes: 0,
      totalElevationM: 0,
    };
    await StorageService.updateProfile(newProfile);
    setUser(newProfile);
    localStorage.setItem('ipace_session_active', 'true');
    setFailedAttempts(0);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ipace_session_active');
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    const updated = await StorageService.updateProfile(updates);
    setUser(updated);
  };

  const resetLockout = () => {
    setFailedAttempts(0);
    setIsLockedOut(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        theme,
        failedAttempts,
        isLockedOut,
        toggleTheme,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
        resetLockout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
