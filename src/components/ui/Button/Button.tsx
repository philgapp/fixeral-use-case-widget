import cn from "classnames";
import React, {
    forwardRef,
    ButtonHTMLAttributes,
    JSXElementConstructor,
    useRef,
} from "react";
import mergeRefs from "react-merge-refs";
import s from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    className?: string;
    rounded?: boolean;
    primary?: boolean;
    active?: boolean;
    type?: "submit" | "button";
    Component?: string | JSXElementConstructor<any>;
    width?: string | number;
    loading?: boolean;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = forwardRef((props, buttonRef) => {
    const {
        className,
        primary = false,
        children,
        width,
        type = "button",
        loading = false,
        active = false,
        disabled = false,
        rounded = false,
        style = {},
        Component = "button",
        ...rest
    } = props;
    const ref = useRef<typeof Component>(null);

    const rootClassName = cn(
        s.root,
        {
            [s.primary]: primary,
            [s.active]: active,
            [s.loading]: loading,
            [s.disabled]: disabled,
            [s.rounded]: rounded,
        },
        className
    );

    return (
        <Component
            ref={mergeRefs([ref, buttonRef])}
            type={type}
            className={rootClassName}
            disabled={disabled}
            style={{
                width,
                ...style,
            }}
            {...rest}
        >
            {children}
        </Component>
    );
});

export default Button;
