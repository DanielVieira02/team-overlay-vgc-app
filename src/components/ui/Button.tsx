import { MouseEventHandler } from "react"

interface ButtonProps {
    label?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export const Button = ({
    label,
    onClick
}: ButtonProps) => {
    return (
        <button 
            onClick={onClick}
        >{
            label
        }</button>
    )
}