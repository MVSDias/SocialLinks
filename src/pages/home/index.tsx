import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Social } from "../../components/Social";
import { db } from "../../services/firebaseConnection";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface LinkProps {
  // crio um type pra usar com lista.
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

interface SocialLinksProps {
  facebook: string;
  instagram: string;
  youtube: string;
}

export function Home() {
  const [links, setLinks] = useState<LinkProps[]>([]); // array
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps>(); // objeto

  useEffect(() => {
    // busca os itens no banco

    async function loadLinks() {
      const linksRef = collection(db, "links");
      const queryRef = query(linksRef, orderBy("created", "asc"));
      const snapshot = await getDocs(queryRef);
      const lista = [] as LinkProps[];

      if (snapshot !== undefined) {
        snapshot.forEach((doc) => {
          const data = doc.data();
          lista.push({
            id: doc.id,
            name: data.name,
            url: data.url,
            bg: data.bg,
            color: data.color,
          });
        });

        setLinks(lista);
      }
    }

    loadLinks();
  }, []);

  useEffect(() => {
    // carrega os links cadastrados no banco de dados quando a pagina recarrega.
    async function loadSocialLinks() {
      const docRef = doc(db, "social", "link");
      const snapshot = await getDoc(docRef); // busco os links de acordo com essa referencia e armazeno em snapshot

      if (snapshot.data() !== undefined) {
        // se o conteudo de snapshot for diferente de undefined
        const data = snapshot.data();

        setSocialLinks({
          facebook: data?.facebook,
          instagram: data?.instagram,
          youtube: data?.youtube,
        });
      }
    }
    loadSocialLinks();
  }, []);

  return (
    <div className="flex flex-col w-full py-4 items-center justify-center">
      <h1 className="md:text-4xl text-3xl font-bold text-white">Marcus Dias</h1>
      <span className="text-gray-50 mb-5 mt-3">Veja meus Links 👇</span>
      <main className="flex flex-col w-11/12 max-w-xl text-center">
        {links.map((link) => (
          <section
            key={link.id}
            style={{ backgroundColor: link.bg }}
            className="bg-white mb-4 w-full py-2 rounded-lg select-none transition transform hover:scale-105 cursor-pointer"
          >
            <a href={link.url} target="_blank">
              <p className="text-base md:text-lg" style={{ color: link.color }}>
                {link.name}
              </p>
            </a>
          </section>
        ))}
        {socialLinks && Object.keys(socialLinks).length > 0 && (
          //faço uma renderização condicional, onde verifico se socialLinks não é undefined, depois pego as chaves de dentro do objeto(Object.Keys) e vejo se o tamanho é  maior q zero. Se for é pq tem alguma propriedade(facebook, instagram, youtube) dentro, então (&&) renderizo o footer)
          <footer className="flex justify-center gap-3 my-4">
            <Social url={socialLinks?.facebook}>
              <FaFacebook className="transition transform hover:scale-110" size={35} color="#fff" />
            </Social>
            <Social url={socialLinks?.youtube}>
              <FaYoutube className="transition transform hover:scale-110" size={35} color="#fff" />
            </Social>
            <Social url={socialLinks?.instagram}>
              <FaInstagram className="transition transform hover:scale-110" size={35} color="#fff" />
            </Social>
          </footer>
        )}
        <Link 
          to='/login'
          className="text-white font-bold mt-10 text-center transition transform hover:scale-110">Login</Link>
      </main>
    </div>
  );
}
