import { ReactNode } from "react";

interface SocialProps {
  url: string;
  children: ReactNode; // tipo jsx - componente do react
}

export function Social({ url, children }: SocialProps) {
  return <a 
   href={url}
   rel="noopener noreferrer" // essa propriedade é pq é uma url externa(face, insta, youtube, etc...)
   target="_blank" // vai abrir numa nova aba em branco
   >
    {children}
    </a>;
}
