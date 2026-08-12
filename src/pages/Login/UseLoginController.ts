import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../api/services/auth.service";

export function UseLoginController() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function signIn() {
    if (!email || !password) {
      setError("Preencha email e senha");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await AuthService.signIn(email, password);
      navigate("/orders");
    } catch (err: any) {
      if (
        ["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(err.code)
      ) {
        setError("Email ou senha inválidos");
      } else if (err.code === "auth/too-many-requests") {
        setError("Muitas tentativas. Tente novamente mais tarde");
      } else {
        setError("Erro ao fazer login. Tente novamente");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    signIn,
    loading,
    error,
  };
}