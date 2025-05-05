import { useState, useEffect } from "react";
import { UserSession } from "../lib/auth";

interface AuthState {
  user: UserSession | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Verificar a sessão no servidor
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const user = await response.json();
          setState({ user, loading: false, error: null });
        } else {
          setState({ user: null, loading: false, error: null });
        }
      } catch (error) {
        setState({
          user: null,
          loading: false,
          error: "Erro ao verificar sessão",
        });
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, senha: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setState({ user: data.usuario, loading: false, error: null });
        return { success: true };
      } else {
        setState((prev) => ({ ...prev, loading: false, error: data.erro }));
        return { success: false, error: data.erro };
      }
    } catch (error) {
      const errorMessage = "Erro ao fazer login";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setState({ user: null, loading: false, error: null });
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
  };
}
