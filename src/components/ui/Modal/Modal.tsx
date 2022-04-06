import { FC, useRef, useEffect, useCallback } from "react";
import { createPortal } from "preact/compat";
import s from "./Modal.module.css";
import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from "body-scroll-lock";

import { Cross } from "@components/icons";
import cn from "classnames";

interface Props {
    className?: string;
    children?: any;
    open?: boolean;
    onClose: () => void;
    onEnter?: () => void | null;
}

const Modal: FC<Props> = ({
    className,
    children,
    open,
    onClose,
    onEnter = null,
}) => {
    const ref = useRef() as React.MutableRefObject<HTMLDivElement>;

    const modalClassName = cn(s.modal, className);

    const handleKey = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                return onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (ref.current) {
            if (open) {
                disableBodyScroll(ref.current);
                window.addEventListener("keydown", handleKey);
            } else {
                enableBodyScroll(ref.current);
            }
        }
        return () => {
            window.removeEventListener("keydown", handleKey);
            clearAllBodyScrollLocks();
        };
    }, [open, handleKey]);

    if (open) {
        return createPortal(
            <div className={s.root}>
                <div className={modalClassName} role="dialog" ref={ref}>
                    <button
                        onClick={() => onClose()}
                        aria-label="Close panel"
                        className="transition ease-in-out duration-150 focus:outline-none absolute bg-primary sm:border sm:-right-4 right-2 sm:-top-4 -top-9 z-10 p-1 rounded-full"
                    >
                        <Cross />
                    </button>
                    {children}
                </div>
            </div>,
            document.body
        );
    }

    return <></>;
};

export default Modal;
