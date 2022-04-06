import { Input } from "@components/ui";
import { FieldProps } from "formik";
import { FC } from "react";

const InputField: FC<FieldProps> = ({ form: { errors }, field, ...props }) => {
    return (
        <Input
            {...field}
            error={
                errors[field.name] !== null
                    ? (errors[field.name] as string)
                    : ""
            }
            {...props}
        />
    );
};

export default InputField;
