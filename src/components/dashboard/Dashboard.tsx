import {FC, useCallback, useEffect, useState} from "react";
import {
    Contact, UseCase,
} from "@schema/types";
import { useUI } from "@context/ui";
import { Button, ErrorBox, Modal, Steps, Input } from "@components/ui";
import { formatDate, formatPriceRange } from "@utils/index";
import { useFakeTypes, useFirebase } from "@hooks/api";
//import { useNewUseCase } from "@hooks/state"
import { Check, Pencil } from "@components/icons";
import { useStore } from "@context/store";
import { useNewUseCase } from "@hooks/state";
const { getDatabase, dbRef, child, get } = useFirebase()

const db = dbRef(getDatabase());
let caseData: any

    get(child(db, `cases`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            caseData = snapshot.val()
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

interface Props {
    initialized?: boolean;
}

const checkUseCase = ( e:any, setUseCase:any ) => {
    const useCase = e.target.value
    let filteredCases = {}

    if(caseData) {
        filteredCases = Object.fromEntries(
            Object.entries(caseData).filter(([key, value]) => key === useCase) )
    }
    if(filteredCases // 👈 null and undefined check
        && Object.keys(filteredCases).length > 0
        && Object.getPrototypeOf(filteredCases) === Object.prototype) {
        //console.log(filteredCases)
    }
    // Get list of useCases from DB
    // Filter against supplied value
    // Return status for UI
    // @ts-ignore
    if(filteredCases[useCase]) {
        // @ts-ignore
        console.log(filteredCases[useCase].owner)
        setUseCase(useCase)
    }
}

const Step1: FC = () => {
    const { contact, setContact, setUseCase } = useStore();

    const { nextStep } = useUI();

    const firebaseContact = ( contact:Contact ) => {
        const { getDatabase, dbRef, dbSet } = useFirebase()
        const db = getDatabase()
        dbSet(dbRef(db,'cases/' + contact.caseid), {
            caseid: contact.caseid,
            owner: contact.firstname + contact.lastname
        })
        dbSet(dbRef(db,'users/' + contact.id), {
            id: contact.id,
            firstname: contact.firstname,
            lastname: contact.lastname,
            company: contact.company,
            title: contact.title,
            email: contact.email
        })
    }

    const handleClick = () => {

        const caseid = (document.getElementById("caseid") as HTMLFormElement).value
        const firstname = (document.getElementById("first-name") as HTMLFormElement).value
        const lastname = (document.getElementById("last-name") as HTMLFormElement).value
        const company = (document.getElementById("company") as HTMLFormElement).value
        const title = (document.getElementById("title") as HTMLFormElement).value
        const email = (document.getElementById("email") as HTMLFormElement).value

        const contact: Contact = {
            caseid: caseid,
            id: firstname + lastname,
            firstname: firstname,
            lastname: lastname,
            company: company,
            title: title,
            email: email
        }
        setContact(contact);
        setUseCase(caseid)
        if(contact.email) firebaseContact(contact)

        setTimeout(nextStep);
    };

    return (
        <div>
            <Input id="caseid" required={true} label="Use Case Name" value={contact ? contact.caseid : ""}/>
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

const Step2: FC<Props> = ({ initialized }) => {
    const { nextStep } = useUI();
    const { location, uploadProgress, setUploadProgress, useCase } = useStore();
    const { partModels, ref, uploadBytesResumable, getMetadata } = useFirebase();

    const firebaseUpdateCase = ( requirements: any ) => {
        const { getDatabase, dbRef, dbUpdate } = useFirebase()
        const db = getDatabase()
        dbUpdate(dbRef(db,'cases/' + requirements.caseid), {
            partdrawing: requirements.partdrawing,
            partmodel: requirements.partmodel,
            partfiles: requirements.partfiles,
            casenotes: requirements.casenotes
        })
    }

    const firebaseUpload = ( useCase:UseCase, file: any ) => {

        if(!useCase) {
            console.error("useCase required for firebaseUpload. " + useCase + " is not a recognized useCase.")
            return
        }

        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: file.type
        };

// Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(partModels, '/' + file.name);
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
                    // TODO instead of logging, write to DB under case
                    console.log(useCase)
                    console.log(metadata.fullPath)
                });

            }
        );
    }

    const handleClick = () => {
        const formData:any = {}
        // File upload elements from the input id parameter
        const uploadElements = [
            "part-drawing",
            "part-model",
            "part-files"
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
                Array.from(formData[data].files).forEach( (file:any) => {
                    firebaseUpload(useCase, file)
                });
            // Or single file upload
            } else {
                firebaseUpload(useCase, formData[data].files[0])
            }
        }

        // After files are uploaded add notes from input and caseid from state to formData
        formData["case-notes"] = (document.getElementById("case-notes") as HTMLFormElement)
        formData["caseid"] = useCase

        console.log(formData)

        // Write file URLs (or DB path??) to DB with useCase (ID)
        // Write casenotes to DB
        // firebaseUpdateCase(formData)

        setTimeout(nextStep());

    }

    return (
        <div className="space-y-4 step2">
            {uploadProgress && (
                <>{uploadProgress}</>
            )}
            <Input id="part-drawing" className={"useCaseUploadLabel"} type="file" label="Main Drawing (Recent and Accurate)" />
            <Input id="part-model" className={"useCaseUploadLabel"} type="file" label="Main Model (STEP preferred)" />
            <Input id="part-files" className={"useCaseUploadLabel"} type="file" multiple={true} label="Other Images, Documents, etc." />
            <Input id="case-notes" className={"useCaseUploadLabel"} type="textarea" label="Notes" placeholder="Please provide all specific requirements, expertise, and other information important to this use case." />
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

const STEPS = [
    {
        defaultTitle: "Use Case and Owner",
        Content: Step1,
    },
    {
        defaultTitle: "Requirements",
        Content: Step2,
    },
];

// @ts-ignore
const Dashboard: FC<Props> = ({ initialized }) => {
    const { currentStep, setStep } = useUI();

    const {
        contact,
        useCase,
        timeEntry,
        location,
        type,
        reset,
        setNewUseCase,
        setUseCase
    } = useStore();

    const { loading, error } = useFakeTypes();

    const getFormattedDate = () => {
        const { startTime, endTime, date } = timeEntry!;

        if (!date) {
            return `(${startTime}-${endTime})`;
        }

        return `${formatDate(date)} (${startTime}-${endTime})`;
    };

    const getTitle = (step: number, defaultTitle: string): string => {
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
            <Button onClick={() => setNewUseCase(true)} >Create New Use Case</Button>
            <br/>
            or
            <br/>
            <Input type="text" placeholder="Enter Use Case Name/ID" onChange={(e, setUseCase) => checkUseCase}/>
            {useCase && (
                <p>{useCase}
                </p>
            )}
        </>
    );
};

export default Dashboard;
