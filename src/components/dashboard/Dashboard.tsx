import { FC } from "react";
import {
    Contact,
    UseCase,
} from "@schema/types";
import { useUI } from "@context/ui";
import { Button, ErrorBox, Input } from "@components/ui";
import { useFirebase} from "@hooks/api";
import { Check, Pencil } from "@components/icons";
import { useStore } from "@context/store";
const { getDatabase, dbRef, child, get } = useFirebase()

interface Props {
    initialized?: boolean;
    allCases: object;
    loading: boolean;
    error: any;
}

const UseCaseDash: FC<Props> = ({ allCases }) => {
    const { useCase, contact } = useStore()
    // Must have a use case!
    if(!useCase) return null
    // Must have an owner!
    if(!contact) return null

    if(typeof useCase === 'string'
        && typeof allCases === 'object') {

    }
    // @ts-ignore
    return (
        <>
            <h2>{useCase.caseName}</h2> {useCase.id}
            <p>{contact.firstName} {contact.lastName}
                <br/>
                {contact.company} {contact.title}
            </p>
            <p>{useCase.status}</p>
            <p>{useCase.stakeholders}</p>
            <p>{useCase.partDrawing}</p>
            <p>{useCase.partModel}</p>
            <p>{useCase.partFiles}</p>
            <p>{useCase.caseNotes}</p>
            <p>{useCase}</p>
        </>
        )
}

// @ts-ignore
const Dashboard: FC<Props> = ({initialized,allCases, loading, error}) => {
    const { currentStep, setStep } = useUI();

    const {
        contact,
        useCase,
        reset,
        setNewUseCase,
        setUseCase,
        setContact
    } = useStore();

    const getContact = ( id:Contact['id']) => {
        if(!id) {
            console.error("id required to getContact")
            return null
        }

        const ref = dbRef(getDatabase());
        get(child(ref, `users/${id}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    setContact(snapshot.val())
                } else {
                    console.log("No user found");
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    const checkUseCase = ( e:any ) => {
        const useCaseInput = e.target.value
        let filteredCases:object = {}

        const objectFilter = (obj:{}, predicate:any) =>
            Object.fromEntries(Object.entries(obj).filter(predicate));

        if(allCases) {
            // @ts-ignore
            filteredCases = objectFilter(allCases, ([useCaseId, useCaseData]) => useCaseId === useCaseInput)
        }
        if(filteredCases // 👈 null and undefined check
            && Object.keys(filteredCases).length > 0
            && Object.getPrototypeOf(filteredCases) === Object.prototype) {
            console.log(filteredCases)
        }
        // Get list of useCases from DB
        // Filter against supplied value
        // Return status for UI
        // @ts-ignore
        if(filteredCases[useCaseInput]) {
            // @ts-ignore
            setUseCase(allCases[useCaseInput])
            // @ts-ignore
            getContact(allCases[useCaseInput].owner)
        }
    }

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
            {!loading && (
                <>
                    <Button onClick={() => setNewUseCase(true)} >Create New Use Case</Button>
                    <br/>
                    or
                    <br/>
                    <Input type="text" placeholder="Enter Use Case Name/ID" onChange={checkUseCase}/>
                    {useCase && (
                        <UseCaseDash allCases={allCases} loading={loading} error={error} />
                    )}
                </>
            )}
        </>
    );
};

export default Dashboard;
