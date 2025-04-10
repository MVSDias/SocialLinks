import { InputHTMLAttributes } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {} // crio uma interface extendendo as propriedades de InputHtmlAttribute que é do type HTMLInputElement

export function Input(props: InputProps){ //aqui recebo as props do input que é do type InputProps
    return (
        <input 
          className="border-0 h-9 w-full max-w-xl rounded-md outline-none px-2 mb-3 bg-white"
          {...props}      
        />
    )
}