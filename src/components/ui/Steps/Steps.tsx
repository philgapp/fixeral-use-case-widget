import * as React from "react";
import RcSteps from "rc-steps";
import classNames from "classnames";
import s from "./Steps.module.css";
import { Check } from "@components/icons";

export interface StepsProps {
    type?: "default" | "navigation";
    className?: string;
    current?: number;
    direction?: "horizontal" | "vertical";
    initial?: number;
    onChange?: (current: number) => void;
}

export interface StepProps {
    className?: string;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLElement>;
    disabled?: boolean;
    title?: React.ReactNode;
    subTitle?: React.ReactNode;
}

interface StepsType extends React.FC<StepsProps> {
    Step: React.ComponentClass<StepProps>;
}

const Steps: StepsType = ({ className, ...props }) => {
    const stepsClassName = classNames(s.root, className);

    const icons = {
        finish: <Check />,
        error: <p>error</p>,
    };

    return (
        <RcSteps
            icons={icons}
            {...props}
            prefixCls="cls"
            className={stepsClassName}
        />
    );
};

Steps.Step = RcSteps.Step;

Steps.defaultProps = {
    current: 0,
};

export default Steps;
