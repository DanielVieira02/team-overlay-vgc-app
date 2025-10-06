import { ChangeEventHandler } from "react"

interface SelectListProps{
    values: string[]
    label?: string,
    defaultValue?: string,
    multiple?: boolean,
    onChange?: ChangeEventHandler<HTMLSelectElement>,
}

export const SelectList = ({
    values,
    label,
    defaultValue,
    multiple,
    onChange
}: SelectListProps) => {
    return (
        <label>
            {label}
            <select
                defaultValue={defaultValue}
                multiple={multiple}
                onChange={onChange}
            >
                {values.map((value: string) => (
                    <option 
                        key={value}
                        value={value}
                    >
                        {value}
                    </option>
                ))}
            </select>
        </label>
    )
}