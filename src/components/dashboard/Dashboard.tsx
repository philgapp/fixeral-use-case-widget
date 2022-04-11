import { FC } from "react";
import {
    AllUseCases,
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

    return (
        <>
            <h2><b>Name:</b> {useCase.caseName}</h2> ID: {useCase.id}
            <p><b>Owner:</b> {contact.firstName} {contact.lastName}
                <br/>Company: {contact.company}
                <br/>Title: {contact.title}
            </p>
            <p><b>Status:</b> {useCase.status}</p>
            <p><b>Stakeholders:</b> {useCase.stakeholders}</p>
            {useCase.files && useCase.files.partDrawing && (
                <p><b>Primary Drawing:</b> {useCase.files.partDrawing.path}</p>
            )}
            {useCase.files && useCase.files.partModel && (
                <p><b>Primary Model:</b> {useCase.files.partModel.path}</p>
            )}
            {useCase.files && useCase.files.partFiles && (
                <p><b>Other case files:</b> {useCase.files.partFiles.map( (caseFile) => {
                    return caseFile.path + <br/>
                })}</p>
            )}
            <p><b>Notes:</b> {useCase.caseNotes}</p>
        </>
        )
}

// @ts-ignore
const Dashboard: FC<Props> = ({initialized,allCases, loading, error}) => {
    const {
        contact,
        useCase,
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

        const objectFilter = (obj:{}, predicate:any) =>
            Object.fromEntries(Object.entries(obj).filter(predicate));

        if(allCases) {
            interface filtered { [fieldName: string]: any }
            // @ts-ignore
            const filteredCases:filtered = objectFilter(allCases, ([useCaseId]) => useCaseId === useCaseInput)

            if(filteredCases // 👈 null and undefined check
                && Object.keys(filteredCases).length > 0
                && Object.getPrototypeOf(filteredCases) === Object.prototype) {
                if(filteredCases[useCaseInput]) {
                    setUseCase(allCases[useCaseInput as keyof typeof allCases])
                    // @ts-ignore
                    getContact(allCases[useCaseInput].owner)
                    setNewUseCase(false)
                }
            }
        } else {
            console.error("Without allCases cannot checkUseCase.")
        }
    }

    return (
        <>
            {!loading && (
                <>
                    <Button onClick={() => setNewUseCase(true)} >Create New Use Case</Button>
                    <br/>
                    or
                    <br/>
                    <Input type="text" placeholder="Enter Use Case ID" onChange={(e) => checkUseCase(e)}/>
                    {useCase && (
                        <UseCaseDash allCases={allCases} loading={loading} error={error} />
                    )}
                </>
            )}
        </>
    );
};

export default Dashboard;
