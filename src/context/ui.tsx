import React, { FC, useMemo } from "react";

export enum ModalViews {
    PICKUP_PICKER,
    NOTIFY_ME,
}

export interface State {
    currentStep: 0 | 1 | 2 | 3;
    displayModal: boolean;
    view: ModalViews;
}

const initialState: State = {
    currentStep: 0 as 0,
    displayModal: false,
    view: ModalViews.PICKUP_PICKER,
};

type Action =
    | {
          type: "SET_STEP";
          step: State["currentStep"];
      }
    | {
          type: "NEXT_STEP";
      }
    | {
          type: "OPEN_MODAL";
      }
    | {
          type: "CLOSE_MODAL";
      }
    | {
          type: "SET_MODAL_VIEW";
          view: ModalViews;
      };

export const UIContext = React.createContext<Partial<State & any>>(
    initialState
);

UIContext.displayName = "UIContext";

function uiReducer(state: State, action: Action) {
    switch (action.type) {
        case "SET_STEP": {
            return {
                ...state,
                currentStep: action.step,
            };
        }
        case "NEXT_STEP": {
            const number = (state.currentStep < 3
                ? state.currentStep + 1
                : state.currentStep) as State["currentStep"];
            return {
                ...state,
                currentStep: number,
            };
        }
        case "OPEN_MODAL": {
            return {
                ...state,
                displayModal: true,
            };
        }
        case "CLOSE_MODAL": {
            return {
                ...state,
                displayModal: false,
            };
        }
        case "SET_MODAL_VIEW": {
            return {
                ...state,
                modalView: action.view,
            };
        }
    }
}

export const UIProvider: FC = (props) => {
    const [state, dispatch] = React.useReducer(uiReducer, initialState);

    const openModal = () => dispatch({ type: "OPEN_MODAL" });
    const closeModal = () => dispatch({ type: "CLOSE_MODAL" });

    const setStep = (step: 0 | 1 | 2 | 3) =>
        dispatch({ type: "SET_STEP", step });

    const nextStep = () => dispatch({ type: "NEXT_STEP" });

    const setModalView = (view: ModalViews) =>
        dispatch({ type: "SET_MODAL_VIEW", view });

    const value = useMemo(
        () => ({
            ...state,
            openModal,
            closeModal,
            setStep,
            nextStep,
            setModalView,
        }),
        [state]
    );

    return <UIContext.Provider value={value} {...props} />;
};

export const useUI = () => {
    const context = React.useContext(UIContext);
    if (context === undefined) {
        throw new Error(`useUI must be used within a UIProvider`);
    }
    return context;
};
