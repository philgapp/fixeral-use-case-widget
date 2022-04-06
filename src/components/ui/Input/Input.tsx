import {
    FC,
    InputHTMLAttributes,
    ReactElement,
    useEffect,
    useState,
} from "react";
import cn from "classnames";
import uniqueId from "lodash.uniqueid";
import s from "./Input.module.css";

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    className?: string;
    error?: string;
    success?: ReactElement;
    icon?: ReactElement;
    placeholder?: string;
    required?: boolean;
    onChange?: (...args: any[]) => any;
}

export function fixControlledValue<T>(value: T) {
    if (typeof value === "undefined" || value === null) {
        return "";
    }
    return value;
}

const Input: FC<Props> = (props) => {
    const {
        className,
        error = "",
        success,
        icon,
        label,
        required = false,
        children,
        onChange,
        placeholder,
        value,
        ...rest
    } = props;

    const [id] = useState(uniqueId("input-field-"));

    const [inputValue, setValue] = useState(value);

    const wrapperClassName = cn(s.wrapper, {}, className);

    const handleOnChange = (e: any) => {
        setValue(e.target.value);

        if (onChange) {
            onChange(e);
        }
        return null;
    };

    return (
        <div className={wrapperClassName}>
            {label && (
                <label htmlFor={id} className={s.label}>
                    {label}
                </label>
            )}
            <div className={s.inputWrapper}>
                <input
                    id={id}
                    value={fixControlledValue(inputValue)}
                    required={required}
                    className={s.root}
                    onChange={handleOnChange}
                    placeholder={placeholder}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    {...rest}
                />
                {icon && <span className={s.icon}>{icon}</span>}
            </div>
            {success && <div className={s.success}>{success}</div>}
            {error && (
                <div role="alert" className={s.error}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default Input;
