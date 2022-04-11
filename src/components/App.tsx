import { FC } from "react";
import { ApiProvider } from "@context/api";
import { UIProvider } from "@context/ui";
import { StoreProvider, useStore } from "@context/store";
import { Form } from "@components/form";
import { Dashboard } from "@components/dashboard";
import { useAllCases } from "@hooks/api";

const UseCaseApp: FC = () => {
    const { newUseCase } = useStore()
    const { allCases, loading, error } = useAllCases();

    return (
        <>{ !loading && (
            <>
            { newUseCase
                ? <Form allCases={allCases} loading={loading} error={error} />
                : <Dashboard allCases={allCases} loading={loading} error={error} />
            }
            </>
        )}
        </>
    );
};

const App: FC = (props) => {

    return (
        <ApiProvider>
            <UIProvider>
                <StoreProvider>
                    <div className="font-sans text-base">
                        <UseCaseApp {...props} />
                    </div>
                </StoreProvider>
            </UIProvider>
        </ApiProvider>
    );
};

export default App;
