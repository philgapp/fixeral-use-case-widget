import { FC, useCallback, useEffect } from "react";
import {
    DeliveryType,
    DELIVERY_TYPE_STR_TO_ENUM,
    AvailableDeliveryType,
    PickupLocation,
    DoorstepDeliveryLocation, Contact,
} from "@schema/types";
import { ModalViews, useUI } from "@context/ui";
import PickupPicker from "../PickupPicker";
import TimeEntryPicker from "../TimeEntryPicker";
import HavingTroubles from "./HavingTroubles";
import { Button, ErrorBox, Modal, Steps, Input } from "@components/ui";
import { formatDate, formatPriceRange } from "@utils/index";
import { useDeliveryTypes } from "@hooks/api";
import { useFakeTypes, useFirebase } from "@hooks/api";
import { Check, Pencil } from "@components/icons";
import { ZipCodeForm, AddressForm } from "@components/form/AddressForm";
import { useStore } from "@context/store";
import { DELIVERY_TYPE_LABELS } from "@constants/index";

interface Props {
    initialized?: boolean;
}

const { Step } = Steps;

const Step1: FC = () => {
    const { contact, setContact } = useStore();

    const { nextStep } = useUI();

    const handleClick = () => {

        // @ts-ignore
        const firstname = (document.getElementById("first-name") as HTMLFormElement).value
        // @ts-ignore
        const lastname = (document.getElementById("last-name") as HTMLFormElement).value
        // @ts-ignore
        const company = (document.getElementById("company") as HTMLFormElement).value
        // @ts-ignore
        const title = (document.getElementById("title") as HTMLFormElement).value
        // @ts-ignore
        const email = (document.getElementById("email") as HTMLFormElement).value

        const contact: Contact = {
            firstname: firstname,
            lastname: lastname,
            company: company,
            title: title,
            email: email
        }
        console.log(contact)
        setContact(contact);

        setTimeout(nextStep);
    };

    return (
        <div>
            <Input id="first-name" required={true} label="First Name" value={contact ? contact.firstname : ""}/>
            <Input id="last-name" required={true} label="Last Name" value={contact ? contact.lastname : ""}/>
            <Input id="company" label="Company" value={contact ? contact.company : ""}/>
            <Input id="title" label="Title" value={contact ? contact.title : ""}/>
            <Input id="email" required={true} label="Email" value={contact ? contact.email : ""}/>
            <Button
                className="button-no-round"
                onClick={handleClick}
                primary={location !== null}
            >
                Save Contact Info
            </Button>

            {/*availableDeliveryTypes.map(
                ({ minPrice, maxPrice, ...deliveryType }) => {
                    return (
                        <Button
                            className="button-no-round float-left mr-2 mb-2"
                            active={deliveryType.type === type}
                            key={deliveryType.type}
                            onClick={handleClick.bind(this, deliveryType.type)}
                        >
                            {`${
                                DELIVERY_TYPE_LABELS[deliveryType.type]
                            } (${formatPriceRange(minPrice, maxPrice)})`}
                        </Button>
                    );
                }
            )
            */}

        </div>
    );
};

const Step2: FC<Props> = ({ initialized }) => {
    const { displayModal, closeModal, openModal, setModalView, nextStep } = useUI();
    const { type, location } = useStore();
    const { partModels, ref, listAll, uploadBytesResumable, getDownloadURL } = useFirebase();

    useEffect( () => {
        listAll(partModels)
            .then((res) => {
                res.prefixes.forEach((folderRef) => {
                    // All the prefixes under listRef.
                    // You may call listAll() recursively on them.
                });
                res.items.forEach((itemRef) => {
                    // All the items under listRef.
                    console.log(itemRef)
                });
            }).catch((error) => {
            // Uh-oh, an error occurred!
        });

    },[]);

    const firebaseUpload = (e: any) => {
        const partModel = e.target.files[0];


        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: partModel.type
        };

// Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(partModels, '/' + partModel.name);
        const uploadTask = uploadBytesResumable(storageRef, partModel, metadata);

// Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                });

                nextStep();
            }
        );
    }

    const handleModalClose = () => {
        closeModal();
    };

    const handleSelectPickUp = () => {
        setModalView(ModalViews.PICKUP_PICKER);
        openModal();
    };

    return (
        <div className="space-y-4 text-sm">
            {type === DeliveryType.Pickup ? (
                <>
                    <Button
                        className="button-no-round"
                        onClick={handleSelectPickUp}
                        primary={location !== null}
                    >
                        Select pickup
                    </Button>
                    <HavingTroubles />
                    <Modal open={displayModal} onClose={handleModalClose}>
                        <PickupPicker />
                    </Modal>
                </>
            ) : (
                <>
                    <Input id="part-model" type="file" onChange={firebaseUpload} />
                </>
            )}
        </div>
    );
};

const Step3: FC = () => {
    const { location } = useStore();

    if (location && "slots" in location) {
        return <TimeEntryPicker slots={location.slots} />;
    }
    return <></>;
};

const STEPS = [
    {
        defaultTitle: "Use Case Owner",
        Content: Step1,
    },
    {
        defaultTitle: "Use Case Requirements",
        Content: Step2,
    },
    {
        defaultTitle: "Submit",
        Content: Step3,
    },
];

const Form: FC<Props> = ({ initialized }) => {
    const { currentStep, setStep } = useUI();

    const {
        timeEntry,
        location,
        type,
        reset,
        setAvailableDeliveryTypes,
    } = useStore();

    const { deliveryTypes, loading, error } = useFakeTypes();

    const getFormattedDate = () => {
        const { startTime, endTime, date } = timeEntry!;

        if (!date) {
            return `(${startTime}-${endTime})`;
        }

        return `${formatDate(date)} (${startTime}-${endTime})`;
    };

    const getDefaultTitle = () => {
        if (type === DeliveryType.Pickup) {
            const {
                name,
                address: { address1, city, country },
            } = location as PickupLocation;

            return (
                <>
                    <strong>{`Pickup - ${name} - ${address1}, ${city}, ${country}`}</strong>
                    <p className="text-sm">{getFormattedDate()}</p>
                </>
            );
        }
        const { zipCode } = location as DoorstepDeliveryLocation;

        return (
            <>
                <strong>{`Postal code - ${zipCode}`}</strong>
                <p className="text-sm">{getFormattedDate()}</p>
            </>
        );
    };

    const getTitle = (step: number, defaultTitle: string): string => {
        const isPickup = type === DeliveryType.Pickup;
        const stepsFinished = disabledFrom();

        switch (step) {
            case 0:
                if (stepsFinished > 0 && type) {
                    return DELIVERY_TYPE_LABELS[type];
                }
                break;
            case 2:
                if (stepsFinished > 2) {
                    return getFormattedDate();
                }
        }
        return defaultTitle;
    };

    const handleEdit = () => {
        if (initialized) {
            reset();
            setStep(0);
        } else {
            setStep(2);
        }
    };

    const disabledFrom = useCallback(() => {
        if (timeEntry) {
            return 3;
        }
        if (location) {
            return 2;
        }
        if (type !== null) {
            return 1;
        }
        return 0;
    }, [timeEntry, location, type]);

    if (error) {
        return <ErrorBox />;
    }

    if (type !== null && location && timeEntry && currentStep > 2) {
        return (
            <div className="relative my-5 flex items-center">
                <div className="mr-5 flex-shrink-0 w-8 h-8 border border-black items-center flex justify-center rounded-full">
                    <Check />
                </div>
                <div>
                    {getDefaultTitle()}
                    <Button
                        className="absolute bg-primary right-2 top-0 rounded-full p-2"
                        onClick={handleEdit}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            {loading ? (
                <div className="w-full h-full py-5 space-y-4 opacity-40">
                    <div className="animate-pulse flex space-x-6">
                        <div className="rounded-full bg-decent h-8 w-8"></div>
                        <div className="flex-1 space-y-4 py-2">
                            <div className="h-4 bg-decent rounded w-40"></div>
                            <div className="h-8 bg-decent rounded w-60"></div>
                        </div>
                    </div>
                    <div className="animate-pulse flex space-x-6">
                        <div className="rounded-full bg-decent h-8 w-8"></div>
                        <div className="flex-1 space-y-4 py-2">
                            <div className="h-4 bg-decent rounded w-40"></div>
                        </div>
                    </div>
                    <div className="animate-pulse flex space-x-6">
                        <div className="rounded-full bg-decent h-8 w-8"></div>
                        <div className="flex-1 space-y-4 py-2">
                            <div className="h-4 bg-decent rounded w-40"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <Steps
                    className="my-5"
                    current={currentStep}
                    direction="vertical"
                    onChange={(index) => {
                        if (disabledFrom() < index) {
                            return;
                        }
                        setStep(index);
                    }}
                >
                    {STEPS.map(({ defaultTitle, Content }, index) => {
                        const disabled = disabledFrom() < index;

                        return (
                            <Step
                                key={`step-${index}`}
                                title={getTitle(index, defaultTitle)}
                                disabled={disabled}
                                description={
                                    currentStep === index && (
                                        <Content initialized={initialized} />
                                    )
                                }
                            ></Step>
                        );
                    })}
                </Steps>
            )}
        </>
    );
};

export default Form;
