/* eslint-disable @typescript-eslint/no-unused-vars */

import { FormEvent, useEffect, useState } from "react";
import { Header } from "../../components/header";
import { Input } from "../../components/Input";
import { FiTrash } from "react-icons/fi";
import { db } from "../../services/firebaseConnection";
import {
  addDoc, // gera um id único e automático
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";

interface LinkProps {
  // crio um type pra usar com lista.
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

export function Admin() {
  const [nameInput, setNameInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [textColorInput, setTextColorInput] = useState("#ffffff");
  const [backgroundColorInput, setBackgroundColorInput] = useState("#121212");
  const [links, setLinks] = useState<LinkProps[]>([]); // crio um estado pra armazenar a lista. com esse estado posso renderizar minha lista da maneira q eu quiser.

  useEffect(() => {
    // quando montar o componente vai chamar o q tiver aqui dentro
    const linksRef = collection(db, "links"); //crio uma referência pra acessar a collection do banco (db, 'links')
    const queryRef = query(linksRef, orderBy("created", "asc")); // para fazer uma busca personalizada ou ordenação baseada na referência criada acima(linksref, e a ordenação(orderBy) ) passando o campo e a order(nesse caso created e ascendente(crescente))

    const unsub = onSnapshot(queryRef, (snapshot) => {
      // onSnapshot é um observador em tempo real, então consome processamento, tem q tomar cuidado, pois vai ficar sempre monitorando p ver se o banco mudou
      const lista = [] as LinkProps[]; // crio um array vazio para armazenar nossa collection

      snapshot.forEach((doc) => {
        // faço um forEach na lista, e percorro doc por doc, dentro das listas e...
        lista.push({
          // pego essas propriedades do doc e coloco dentro de lista
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color,
        });
        setLinks(lista);
      });

      return () => {
        // desmonta o onSnapshot
        unsub(); // remove o listener quando chamado
      };
    }); // vai fazer a busca ordernada, pela propriedade 'created' (queryRef), e recebe um callback(retorno) em forma de função anonima, que recebe a propriedade snapshot(foto do momento do banco)
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (nameInput === "" || urlInput === "") {
      // se não digitar um nome ou uma url no input...
      alert("digite um nome ou a url");
      return; // para o codigo pq não vou cadastrar um link ou url vazia
    }

    try {
      await addDoc(collection(db, "links"), {
        // cadastrando no banco, criando a collection(table) e os documentos(rows)
        name: nameInput,
        url: urlInput,
        bg: backgroundColorInput,
        color: textColorInput,
        created: new Date(), // para saber quando foi criado
      }); // chamo a collection, passo a conexão com o banco(db), crio um nome pra collection(nesse caso links), abro chaves e coloco o documento ali dentro( o que quero dentro dessa addcollection -quero adicionar no banco)

      setNameInput(""); // se cadastrou , limpo o nameInput
      setUrlInput(""); // se cadastrou , limpo o urlInput
      
    } catch (err) {
      console.error("erro ao cadastar no banco", err);
    }
  }

  async function handleDeleteLink(id: string){ // crio uma funçaõ que vai ao banco deletar um documento

    const docRef = doc(db, 'links', id) // crio a referência(refDoc), passo qual o banco (db), qual a colection(links) e o id do documento q quero deletar(id)

    await deleteDoc(docRef) // chamo o método deleteDoc q importei do firebase, passo a referencia do documento q quero deletar e aguardo.
  }


  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2">
      <Header />

      <form
        className="flex flex-col mt-3 mb-3 w-full max-w-xl"
        onSubmit={handleSubmit}
      >
        <label className="text-white font-medium mt-2 mb-2">Nome do Link</label>
        <Input
          placeholder="digite o nome do link..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <label className="text-white font-medium mt-2 mb-2">Url do Link</label>
        <Input
          type="url"
          placeholder="digite o nome do link..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <section className="flex my-4 gap-5">
          <div className="flex gap-2 items-center">
            <label className="text-white font-medium mt-2 mb-2">
              Fundo do Link
            </label>
            <input
              className="mb-2"
              type="color"
              value={backgroundColorInput}
              onChange={(e) => setBackgroundColorInput(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-white font-medium mt-2 mb-2">
              Cor do Link
            </label>
            <input
              className="mb-2"
              type="color"
              value={textColorInput}
              onChange={(e) => setTextColorInput(e.target.value)}
            />
          </div>
        </section>

        {nameInput !== "" && ( //renderização condicionada: se o nameInput não estiver vazio então vai renderizar(mostar) isso
          <div className="flex items-center justify-start flex-col mb-5 border-gray-100/25 border rounded-md">
            <label className="text-white font-medium ">
              Veja como vai ficar
            </label>
            <article
              className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px1 py-1"
              style={{
                marginBottom: 8,
                marginTop: 8,
                backgroundColor: backgroundColorInput,
              }}
            >
              <p style={{ color: textColorInput }}>{nameInput}</p>
            </article>
          </div>
        )}

        <button
          type="submit"
          className="mb-7 bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center"
          onClick={handleSubmit}
        >
          Cadastrar
        </button>
      </form>

      <h2 className="font-bold text-white mb-4 text-2xl">Meus Links</h2>

      {links.map((link) => ( //faço um map na lista armazenada em links, pego item(link) por item(link)) e renderizo esse código na tela.
        <article
          key={link.id} // primeiro item dentro do map precisa de uma key unica p identificar cada link
          className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 mb-3 px-2 select-none"
          style={{ backgroundColor: link.bg, color: link.color }} // passo as cores q vem no link do map
        >
          <p>{link.name}</p>
          <div>
            <button 
              className="border border-dashed p-1 rounded bg-neutral-700"
              onClick={() => handleDeleteLink(link.id)}
            
            >
              <FiTrash size={18} color="#fff" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
