import { ChangeEventHandler } from "react"

interface InputFieldProps {
    label?: string,
    value: string,
    onChange?: ChangeEventHandler<HTMLInputElement>,
}

export const InputField = ({
    label,
    value,
    onChange
}: InputFieldProps) => {

    return (
        <label>
            {label}
            <input
                value={value}
                onChange={onChange}
            />
        </label>
    )
}