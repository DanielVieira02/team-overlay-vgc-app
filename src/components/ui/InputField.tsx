import { ChangeEventHandler } from "react"

interface InputFieldProps {
    label?: string,
    onChange?: ChangeEventHandler<HTMLInputElement>,
    value: string,
}

export const InputField = ({
    label,
    onChange,
    value
}: InputFieldProps) => {
    return (
        <input 
            type="text"
            onChange={onChange}
            value={value}
        >{
            label
        }</input>
    )
}