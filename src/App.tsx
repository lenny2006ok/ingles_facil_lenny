import React from 'react';
import { AuthProvider } from './features/AuthContext';
import { AppRouter } from './router';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};
export default App;
