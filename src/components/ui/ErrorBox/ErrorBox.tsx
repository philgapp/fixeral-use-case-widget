import { FC } from "react";

const ErrorBox: FC = ({ children }) => {
    return (
        <div className="m-5 flex text-red-800 flex-row items-center bg-red-200 p-3 rounded border-b-2 border-red-300">
            {children ? (
                children
            ) : (
                <>
                    Oops. Something unexpected happened.<br></br>
                    Try to reload the page.
                </>
            )}
        </div>
    );
};

export default ErrorBox;
