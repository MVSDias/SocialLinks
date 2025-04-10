import { ReactNode, useState, useEffect } from "react";
import { auth } from "../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

interface PrivateProps { // crio um type para o children
    children: ReactNode;
}

export function Private({children}: PrivateProps) {

    const [loading, setLoading] = useState(true); // começa com valor true de carregando
    const [signed, setSigned] = useState(false) // começa com valor false de usuario não logado

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => { // observador, monitora pra ver se tem usuário logado. recebe uma conexão(auth), e passa uma função anonima que recebe o user.
            if(user){// se existir usuario logado...
                const userData = { // salvo algumas informações do user em userData
                    uid: user?.uid,
                    email: user?.email
                }

                localStorage.setItem('@devlinks', JSON.stringify(userData)) // guardo as informações de user no localstorage
                setLoading(false) // mudo o valor de loading p false - não carregando
                setSigned(true) // mudo o valor de signed p true - tem usuário logado

            } else {
                console.log('Não tem usuário logado')
                setLoading(false) // mudo o valor de loading p false - não carregando
                setSigned(false) // mudo o valor de signed p false - não tem usuário logado

            }

        })

        
        // cancela o olheiro(onAuthStateChanged)
        return () => { // função de cleanUp - se está saindo da rota private não é mais necessário ficar monitorando, pois consome processamento desnecessário.
            unsub(); //chamo o unsub, e como não terá ninguém mais conectado, sai do private.
        }
    }, [])

    
    // renderizando com base no controle:
    if(loading){ //enquanto estiver carregando...
      return <div></div>//...renderizo um componente vazio.
    }

    if(!signed){ // se o usuário não estiver logado e tentar acessar a rota privada...
      return <Navigate to='/login' /> // ...navego p pagina de login.
    }


    return children ;// se caiu aqui renderizo o que tem dentro do private
}