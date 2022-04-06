import { DEBOUNCE_TIMEOUT_IN_MS } from "@constants/index";

import { useAsyncDeliveryDoorstep } from "@hooks/api";
import { Field } from "formik";
import debounce from "lodash.debounce";
import { FC, useCallback } from "react";
import { useFormState } from "./context";
import InputField from "../InputField";

const ZipCodeField: FC<{ className?: string }> = (props) => {
    const { setLocations } = useFormState();
    const asyncDeliveryDoorstep = useAsyncDeliveryDoorstep();

    const validation = async (payload: any, resolve: any) => {
        try {
            const response = await asyncDeliveryDoorstep({ zipCode: payload });

            if (response && response.length > 0) {
                setLocations(response);
                resolve("");
                return;
            }
            resolve("Sorry. We do not deliver to your area.");
        } catch (e) {
            resolve("Oops. Something unexpected happened.");
            return;
        }
    };

    const validationDebounced = useCallback(
        debounce(validation, DEBOUNCE_TIMEOUT_IN_MS),
        [validation]
    );

    const validate = (value: string) =>
        new Promise((resolve) => validationDebounced(value, resolve));

    return (
        <Field
            {...props}
            type="text"
            name="zip"
            placeholder="2400"
            validate={validate}
            component={InputField}
        />
    );
};

export default ZipCodeField;
