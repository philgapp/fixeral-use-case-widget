import { Button, ErrorBox, Modal } from "@components/ui";
import { useSubscribeCustomer } from "@hooks/subscribe-api";
import { Field, Formik } from "formik";
import { FC } from "react";
import InputField from "../InputField";
import { SubscribeForm } from "@schema/types";
import { SUBSCRIBE_FORM_SCHEMA } from "@schema/index";

interface Props {
    open: boolean;
    onClose: () => void;
}

const initialValues: SubscribeForm = {
    email: "",
};

const FallbackModal: FC<Props> = ({ open, onClose }) => {
    const [
        subscribeCustomer,
        { data, error, loading },
    ] = useSubscribeCustomer();

    const onSubmit = (values: SubscribeForm) => {
        subscribeCustomer(values);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            className="w-full max-w-xl h-auto p-10 space-y-4 text-center"
        >
            {data ? (
                <div>
                    <h1 className="font-medium text-lg">
                        LEVERER GRIM TIL DIT OMRÅDE?
                    </h1>
                    <div className="py-5">
                        <p>
                            Tak! 👍 Du er på ventelisten. Vi sender dig en mail
                            så snart vi leverer til dit område.
                        </p>
                    </div>
                    <Button onClick={onClose} className="px-8 py-3" primary>
                        FORTSÆT
                    </Button>
                </div>
            ) : (
                <Formik<SubscribeForm>
                    initialValues={initialValues}
                    validationSchema={SUBSCRIBE_FORM_SCHEMA}
                    onSubmit={onSubmit}
                >
                    {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <h1 className="font-medium text-lg">
                                LEVERER GRIM TIL DIT OMRÅDE?
                            </h1>
                            <div className="py-5">
                                {error && <ErrorBox>{error}</ErrorBox>}
                                <p>
                                    Vi leverer ikke til dit område endnu MEN du
                                    kan vælge selv at hente din kasse, ved at af
                                    vores afhentningssteder i København eller
                                    Aarhus.
                                </p>
                                <br />
                                <p>
                                    👉 Du vælger bare Afhentning som din
                                    leveringsmetode.
                                </p>
                                <br />
                                <p>
                                    Ellers, kan du skrive dig på vores
                                    venteliste og få direkte besked når vi
                                    leverer til dit område.
                                </p>
                                <br />
                                <div className="text-left flex space-x-2 w-full">
                                    <Field
                                        className="flex-1"
                                        type="text"
                                        name="zip"
                                        label="Postal code"
                                        placeholder="4200"
                                        component={InputField}
                                    />
                                    <Field
                                        className="flex-1"
                                        type="email"
                                        name="email"
                                        label="Email"
                                        placeholder="grimlink@eatgrim.com"
                                        component={InputField}
                                    />
                                </div>
                            </div>
                            <Button className="px-8 py-3" primary type="submit">
                                {loading
                                    ? "Loading..."
                                    : "Tilmeld dig ventelisten"}
                            </Button>
                        </form>
                    )}
                </Formik>
            )}
        </Modal>
    );
};

export default FallbackModal;
