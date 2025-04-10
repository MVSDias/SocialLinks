/* eslint-disable @typescript-eslint/no-unused-vars */

import { FormEvent, useEffect, useState } from "react";
import { Header } from "../../components/header";
import { Input } from "../../components/Input";

import { db } from "../../services/firebaseConnection";
import {
  setDoc, //cria um novo na primeira vez, passando um id que escolho, no banco. Mas se eu tentar criar outro  ele vai substituir e não apenas adicionar, pq cria no mesmo lugar(documento).
  getDoc, // pega apenas um documento do banco.
  doc,
} from "firebase/firestore";

import { Snackbar, Alert } from "@mui/material";

export function Networks() {
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  
  //snackbar state
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  useEffect(() => { // carrega os links cadastrados no banco de dados quando a pagina recarrega.
    async function loadLinks(){
      const docRef = doc(db, 'social', 'link')
      const snapshot = await getDoc(docRef) // busco os links de acordo com essa referencia e armazeno em snapshot

      if(snapshot.data() !== undefined){ // se o conteudo de snapshot for diferente de undefined
        const data = snapshot.data()
        setFacebook(data?.facebook)
        setInstagram(data?.instagram)
        setYoutube(data?.youtube)
      }
      
    }
    loadLinks()

  },[])

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    try {
      await setDoc(doc(db, "social", "link"), {
        facebook: facebook,
        instagram: instagram,
        youtube: youtube,
      }); //crio um documento, passo a conexão com o banco, nomeio a collection(social), o id do documento(link), depois entre chaves, o que quero colocar dentro desse documento(propriedades)

      setMessage("Cadastro com sucesso");
      setSeverity("success");
      setOpen(true);

    } catch (err) {
      setMessage("Erro ao salvar");
      setSeverity("error");
      setOpen(true);
      console.error("erro ao salvar" + err);
    }
  }

  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2">
      <Header />
      <h1 className="text-white text-2xl font-medium mt-8 mb-4">
        Minhas Redes Sociais
      </h1>

      <form className="flex flex-col max-w-xl w-full" onSubmit={handleRegister}>
        <label className="text-white font-medium mt-2 mb-2">
          Link do Facebook
        </label>
        <Input
          type="url"
          placeholder="digite a url do facebook..."
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
        />

        <label className="text-white font-medium mt-2 mb-2">
          Link do Instagram
        </label>
        <Input
          type="url"
          placeholder="digite a url do instagram..."
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
        <label className="text-white font-medium mt-2 mb-2">
          Link do Youtube
        </label>
        <Input
          type="url"
          placeholder="digite a url do youtube..."
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
        />

        <button
          className="text-white bg-blue-600 h-9 rounded-md items-center justify-center flex mb-7 mt-2"
          type="submit"
          onClick={handleRegister}
        >
          Salvar Links
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
            width: '100%',
            backgroundColor: severity === 'success' ? '#098efc' : '#f44336',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '8px',
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
