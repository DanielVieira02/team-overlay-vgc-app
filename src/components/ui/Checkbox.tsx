import { ChangeEventHandler, Dispatch, SetStateAction } from "react"

interface CheckboxProps {
    label?: string,
    value: boolean,
    onChange: Dispatch<SetStateAction<boolean>>,
}

export const Checkbox = ({
    label,
    value,
    onChange
}: CheckboxProps) => {

    const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        onChange(event.target.checked);
    }

    return (
        <label>
            {label}
            <input
                checked={value}
                onChange={handleOnChange}
                type="checkbox"
            />
        </label>
    )
}