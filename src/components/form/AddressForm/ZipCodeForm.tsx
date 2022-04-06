import { FC } from "react";
import { useStore } from "@context/store";
import { useUI } from "@context/ui";
import { Formik } from "formik";
import { FormStateProvider, useFormState } from "./context";
import ZipCodeField from "./ZipCodeField";
import { Button } from "@components/ui";
import { ZipCode } from "@schema/types";
import { ZIP_CODE_SCHEMA } from "@schema/index";

import FallbackModal from "../FallbackModal";

import s from "./ZipCodeForm.module.css";
import { useState } from "preact/hooks";
import classNames from "classnames";

interface ConfirmButtonProps {
    disabled?: boolean;
    className?: string;
}

export const initialValues: ZipCode = {
    zip: "",
};

export const ConfirmButton: FC<ConfirmButtonProps> = ({
    className,
    ...props
}) => {
    const rootClassNames = classNames(s.button, className);

    return (
        <Button className={rootClassNames} type="submit" primary {...props}>
            Confirm
        </Button>
    );
};

const ZipCodeForm: FC = () => {
    const [showModal, setShowModal] = useState(false);
    const { locations } = useFormState();
    const { setLocation } = useStore();
    const { nextStep } = useUI();

    const onSubmit = () => {
        if (locations) {
            setLocation({ ...locations[0] });
            nextStep();
        }
    };

    const buttonClasses = "float-left mr-2 mb-2";

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="overflow-hidden">
            <Formik
                initialValues={initialValues}
                validationSchema={ZIP_CODE_SCHEMA}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, isValid, dirty }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="pr-10 space-y-2">
                            <ZipCodeField className="max-w-xs" />
                            <ConfirmButton
                                className={buttonClasses}
                                disabled={!(isValid && dirty)}
                            />
                            {!isValid && (
                                <Button
                                    className={buttonClasses}
                                    onClick={openModal}
                                >
                                    Inform me when available
                                </Button>
                            )}
                        </div>
                    </form>
                )}
            </Formik>
            <div className="clear-both"></div>
            <FallbackModal open={showModal} onClose={closeModal} />
        </div>
    );
};

const AddressFormWithContext: FC = (props) => {
    return (
        <FormStateProvider>
            <ZipCodeForm {...props} />
        </FormStateProvider>
    );
};

export default AddressFormWithContext;
