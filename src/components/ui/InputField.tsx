import { ChangeEventHandler, Dispatch, SetStateAction } from "react"

interface InputFieldProps {
    label?: string,
    type?: string,
    disabled?: boolean,
    value: string,
    onChange: Dispatch<SetStateAction<string>>,
}

export const InputField = ({
    label,
    type,
    value,
    onChange,
    disabled
}: InputFieldProps) => {

    const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        onChange(event.target.value);
    }

    return (
        <label>
            {label}
            <input
                value={value}
                onChange={handleOnChange}
                type={type}
                disabled={disabled}
            />
        </label>
    )
}