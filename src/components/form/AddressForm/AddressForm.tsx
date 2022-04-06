import { FC } from "react";
import { useStore } from "@context/store";
import { useUI } from "@context/ui";
import { Field, Formik } from "formik";
import { FormStateProvider, useFormState } from "./context";
import InputField from "../InputField";
import ZipCodeField from "./ZipCodeField";
import { ConfirmButton, initialValues as ZipInitial } from "./ZipCodeForm";
import { Address } from "@schema/types";
import { ADDRESS_SCHEMA } from "@schema/index";

const initialValues: Address = {
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    city: "",
    company: "",
    phone: "",
    province: "",
    ...ZipInitial,
};

const AddressForm: FC = () => {
    const { locations } = useFormState();
    const { setAddress, setLocation, address } = useStore();
    const { nextStep } = useUI();

    const onSubmit = (values: Address) => {
        if (locations) {
            setLocation({ ...locations[0] });
            setAddress(values);
            nextStep();
        }
    };

    const values = {
        ...initialValues,
        ...address,
    };

    return (
        <Formik
            initialValues={values}
            validationSchema={ADDRESS_SCHEMA}
            onSubmit={onSubmit}
        >
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="max-w-sm">
                        <div className="flex space-x-2 w-full">
                            <Field
                                className="flex-1"
                                type="text"
                                name="first_name"
                                placeholder="First name"
                                component={InputField}
                            />
                            <Field
                                className="flex-1"
                                type="text"
                                name="last_name"
                                placeholder="Last name"
                                component={InputField}
                            />
                        </div>
                        <Field
                            type="text"
                            name="address1"
                            placeholder="Address 1"
                            component={InputField}
                        />
                        <Field
                            type="text"
                            name="address2"
                            placeholder="Address 2"
                            component={InputField}
                        />
                        <Field
                            type="text"
                            name="company"
                            placeholder="Company"
                            component={InputField}
                        />
                        <div className="flex space-x-2 w-full">
                            <ZipCodeField className="flex-1" />
                            <Field
                                className="flex-1"
                                type="text"
                                name="city"
                                placeholder="City"
                                component={InputField}
                            />
                        </div>
                        <div className="flex space-x-2 w-full">
                            <Field
                                className="flex-1"
                                type="text"
                                name="country"
                                placeholder="Country"
                                component={InputField}
                            />
                            <Field
                                className="flex-1"
                                type="text"
                                name="province"
                                placeholder="Province"
                                component={InputField}
                            />
                        </div>
                        <Field
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            component={InputField}
                        />
                        <ConfirmButton />
                    </div>
                </form>
            )}
        </Formik>
    );
};

const AddressFormWithContext: FC = (props) => {
    return (
        <FormStateProvider>
            <AddressForm {...props} />
        </FormStateProvider>
    );
};

export default AddressFormWithContext;
