import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, email: string) => Promise<boolean>;
  register: (username: string, email: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ingles_facil_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ingles_facil_user');
      }
    }
  }, []);

  const login = async (username: string, email: string): Promise<boolean> => {
    // Simula uma autenticação local simples
    const userObj = { username, email };
    setUser(userObj);
    localStorage.setItem('ingles_facil_user', JSON.stringify(userObj));
    return true;
  };

  const register = async (username: string, email: string): Promise<boolean> => {
    // Cadastro local simples
    const userObj = { username, email };
    setUser(userObj);
    localStorage.setItem('ingles_facil_user', JSON.stringify(userObj));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ingles_facil_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
