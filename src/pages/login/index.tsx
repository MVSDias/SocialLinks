import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { FormEvent, useState } from "react";
import { auth } from "../../services/firebaseConnection"; // importo p se comunicar com o sistema de autenticação.
import { signInWithEmailAndPassword } from "firebase/auth"; // importo o método de login

import { Snackbar, Alert } from "@mui/material";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (email === "" || password === "") {
      // se o email ou a senha forem vazias...
      alert("Preencha todos os campos");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // se logou com sucesso...(o then() é como o await)
      setMessage("Cadastro com sucesso");
      setSeverity("success");
      setOpen(true);

      setInterval(() => {
        navigate("/admin", { replace: true }); // navego para admin e substituo o histórico de navegação
      }, 2000);

    } catch (error) {
      // se não logou com sucesso...
      setMessage("Erro ao logar");
      setSeverity("error");
      setOpen(true);
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <Link to="/">
        <h1 className="mt-11 text-white mb-7 font-bold text-5xl">
          Dev
          <span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">
            Link
          </span>
        </h1>
      </Link>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex flex-col px-2"
      >
        <Input
          type="email"
          placeholder="digite o email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="digite a sua senha..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="h-9 bg-blue-600 rounded border-0 text-lg font-medium text-white"
        >
          Acessar
        </button>
      </form>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          sx={{
            width: "100%",
            backgroundColor: severity === "success" ? "#098efc" : "#f44336",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
