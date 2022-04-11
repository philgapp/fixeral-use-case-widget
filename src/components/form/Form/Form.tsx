import {FC, useCallback, useEffect, useState} from "react";
import {
    DeliveryType,
    PickupLocation,
    DoorstepDeliveryLocation,
    Contact,
    UseCase,
} from "@schema/types";
import { DELIVERY_TYPE_LABELS } from "@constants/index";
import { useUI } from "@context/ui";
import { useStore } from "@context/store";
import TimeEntryPicker from "../TimeEntryPicker";
import HavingTroubles from "./HavingTroubles";
import { Button, ErrorBox, Modal, Steps, Input } from "@components/ui";
import { formatDate, formatPriceRange } from "@utils/index";
import { useFakeTypes, useFirebase, saveNewUseCase, updateUseCase } from "@hooks/api";
import { Check, Pencil } from "@components/icons";

interface Props {
    initialized?: boolean;
    allCases: object;
    loading: boolean;
    error: any;
}

const { Step } = Steps;

const Step1: FC<Props> = ({allCases, loading, error}) => {
    const { contact, setContact, useCase, setUseCase } = useStore();
    const { nextStep } = useUI();

    const handleClick = () => {

        const caseName = (document.getElementById("caseName") as HTMLFormElement).value
        const firstName = (document.getElementById("firstName") as HTMLFormElement).value
        const lastName = (document.getElementById("lastName") as HTMLFormElement).value
        const company = (document.getElementById("company") as HTMLFormElement).value
        const title = (document.getElementById("title") as HTMLFormElement).value
        const email = (document.getElementById("email") as HTMLFormElement).value

        // First check unique Case Name/ID
        if(allCases) {
            for (const caseObject in allCases) {
                if(caseObject === caseName) {
                    console.error("Use Case name already in use, please use a unique name.")
                    return
                }
            }
        }

        const newContact: Contact = {
            firstName: firstName,
            lastName: lastName,
            company: company,
            title: title,
            email: email
        }

        if(useCase) {
            if(useCase.id) {
                if(contact) {
                    newContact.id = contact.id
                    useCase.caseName = caseName
                    updateUseCase(newContact, useCase, setContact, setUseCase)
                    return
                }
            }
        }

        setContact(newContact);
        setUseCase({
            caseName: caseName
        })

        if(!newContact.email) {
            console.error("Email is required.")
            return
        }

        console.log("handleClick right before saveNewUseCase")
        saveNewUseCase(newContact, {
            caseName: caseName
        }, setContact, setUseCase)
        setTimeout(nextStep);
    };

    return (
        <div>
            <Input id="caseName" required={true} label="Use Case Name" value={useCase ? useCase.caseName : ""}/>
            <Input id="firstName" required={true} label="First Name" value={contact ? contact.firstName : ""}/>
            <Input id="lastName" required={true} label="Last Name" value={contact ? contact.lastName : ""}/>
            <Input id="company" label="Company" value={contact ? contact.company : ""}/>
            <Input id="title" label="Title" value={contact ? contact.title : ""}/>
            <Input id="email" required={true} label="Email" value={contact ? contact.email : ""}/>
            <Button
                className="button-no-round"
                onClick={handleClick}
                primary={location !== null}
            >
                Save Use Case and Contact
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

const Step2: FC<Props> = ({ initialized, allCases, loading, error }) => {
    const { nextStep } = useUI();
    const { location, uploadProgress, setUploadProgress, useCase, contact } = useStore();
    const { useCaseFiles, ref, uploadBytesResumable, getMetadata, getDatabase, dbRef, dbUpdate, push, child } = useFirebase();

    const updateUseCase = ( file:any, tag:any, partFilesIndex?:any ) => {
        const db = getDatabase()

        if(!useCase) {
            console.error("useCase required to updateUseCase")
            return null
        }

        const dbPath = (tag !== "partFiles"
            ? 'cases/' + useCase.id + '/files/' + tag
            : 'cases/' + useCase.id + '/files/' + tag + '-' + partFilesIndex)

        const newKey = push(child(dbRef(db), dbPath)).key;

        dbUpdate(dbRef(db, dbPath), {
            "id": newKey,
            "path": file,
        })
            .then(() => {
            // Data saved successfully!
            console.log(file + " uploaded and saved to case " + useCase.id)
        })
            .catch((error) => {
                // The write failed...
                console.error("updateUseCase failed with " + error)
            });
    }

    const firebaseUpload = ( useCase:UseCase, useCaseKey: any, file: any, partFilesIndex?: any ) => {

        if(!useCase.caseName) {
            console.error("useCase required for firebaseUpload. " + useCase.caseName + " is not a recognized useCase.")
            return
        }

        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: file.type
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(useCaseFiles, '/' + useCase.id + '/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                setUploadProgress( ('Upload progress is ' + Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100 )) + '%');
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
                getMetadata(uploadTask.snapshot.ref).then((metadata) => {
                    setUploadProgress(null)
                    updateUseCase(metadata.fullPath,useCaseKey,partFilesIndex)
                });

            }
        );
    }

    const handleClick = () => {
        const formData:any = {}

        // Must have useCase.id in order to upload files to a use case
        if(!useCase) {
            console.error("useCase required for uploading files")
            return null
        }
        if(useCase) {
            if(!useCase.id) {
                console.error("useCase.id required for uploading files")
                return null
            }
        }

        // File upload elements from the input id parameter
        const uploadElements = [
            "partDrawing",
            "partModel",
            "partFiles"
        ]

        // If any uploadElement exists and is not empty, add the input element to formData object
        uploadElements.forEach( uploadElement => {
            if(document.getElementById( uploadElement )) {
                if( (document.getElementById( uploadElement ) as HTMLFormElement).files.length > 0) {
                    formData[uploadElement] = (document.getElementById( uploadElement ) as HTMLFormElement)
                }
            }
        })

        // Upload images depending on input files 'array' length
        for (const data in formData) {
            // Multiple file upload from single input:
            if(formData[data].files.length > 1) {
                Array.from(formData[data].files).forEach( ( file:any, i ) => {
                    firebaseUpload(useCase, data, file, i)
                });
            // Or single file upload
            } else {
                firebaseUpload(useCase, data, formData[data].files[0])
            }
        }

        // After files are uploaded add notes from input and useCase.id from state to formData
        if((document.getElementById("caseNotes") as HTMLFormElement).value) {
            formData["caseNotes"] = (document.getElementById("caseNotes") as HTMLFormElement).value
        }
        formData["id"] = useCase.id

        console.log(formData)

        // Write file URLs (or DB path??) to DB with useCase (ID)
        // Write casenotes to DB
        // updateUseCase(formData)

        setTimeout(nextStep());

    }

    return (
        <div className="space-y-4 step2">
            {uploadProgress && (
                <>{uploadProgress}</>
            )}
            <Input id="partDrawing" className={"useCaseUploadLabel"} type="file" label="Main Drawing (Recent and Accurate)" />
            <Input id="partModel" className={"useCaseUploadLabel"} type="file" label="Main Model (STEP preferred)" />
            <Input id="partFiles" className={"useCaseUploadLabel"} type="file" multiple={true} label="Other Images, Documents, etc." />
            <Input id="caseNotes" className={"useCaseUploadLabel"} type="textarea" label="Notes" placeholder="Please provide all specific requirements, expertise, and other information important to this use case." />
            <Button
                className="button-no-round"
                onClick={handleClick}
                primary={location !== null}
            >
                Save Requirements
            </Button>
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
        defaultTitle: "Use Case and Owner",
        Content: Step1,
    },
    {
        defaultTitle: "Requirements",
        Content: Step2,
    },
    {
        defaultTitle: "All Done!",
        Content: Step3,
    },
];

const Form: FC<Props> = ({ initialized , allCases, loading, error}) => {
    const { currentStep, setStep } = useUI();
    const {
        contact,
        timeEntry,
        location,
        type,
        reset,
        setNewUseCase
    } = useStore();

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
        if (contact !== null) {
            return 1;
        }
        return 0;
    }, [contact]);

    if (error) {
        return <ErrorBox />;
    }

    if (currentStep > 2) {
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
            <Button onClick={() => setNewUseCase(false)} >Back</Button>
            { loading ? (
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
                                description={
                                    currentStep === index && (
                                        <Content initialized={initialized} allCases={allCases} loading={loading} error={error} />
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
