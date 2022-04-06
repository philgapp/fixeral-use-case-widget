import { FC, memo, ReactNode } from "react";
import cn from "classnames";
import { DaySlot } from "@api/index";

import { Button } from "@components/ui";
import { useStore } from "@context/store";
import { useUI } from "@context/ui";
import { SharedState } from "./PickupPicker";
import { AvailablePickupLocation } from "@schema/types";

interface ListItemProps {
    active: boolean;
    disabled: boolean;
    title: string;
    description: string;
    content: ReactNode;
    onClick: () => void;
    onConfirm: () => void;
}

interface ListProps {
    locations: AvailablePickupLocation[];
}

export const ListItemSkeleton: FC = () => {
    return (
        <div className="animate-pulse opacity-40 space-y-2 px-6 py-4">
            <div className="h-4 bg-decent rounded w-3/5"></div>
            <div className="h-4 bg-decent rounded w-4/5"></div>
        </div>
    );
};

const ListItem: FC<ListItemProps> = ({
    onClick,
    onConfirm,
    disabled,
    title,
    description,
    active,
    content,
}) => {
    const rootClassName = cn("cursor-pointer", {
        "bg-active": active,
        "opacity-40": disabled,
    });

    return (
        <li className={rootClassName} onClick={onClick}>
            <div className="px-5 py-3">
                <div className="">{title}</div>
                <div className="text-sm">{description}</div>
            </div>
            {active && (
                <div className="px-5 py-3 flex flex-col">
                    <div>{content}</div>
                    <Button
                        primary
                        disabled={disabled}
                        onClick={onConfirm}
                        className="self-end"
                    >
                        Confirm
                    </Button>
                </div>
            )}
        </li>
    );
};

const OpeningHours: FC<{ openingHours?: DaySlot[] }> = ({ openingHours }) => {
    return openingHours ? (
        <div className="text-xs">
            {openingHours.map(({ day, timeEntries }, index) => (
                <div key={`opening-hours-${index}`}>{`${day} ${timeEntries.map(
                    ({ startTime, endTime }) => `${startTime}-${endTime}`
                )}`}</div>
            ))}
        </div>
    ) : (
        <></>
    );
};

const List: FC<ListProps & SharedState> = ({
    locations,
    selected,
    setSelected,
}) => {
    const { setLocation } = useStore();
    const { nextStep, closeModal } = useUI();

    const handleSelected = (value: number) => {
        setSelected(value);
    };

    const handleConfirm = () => {
        const location = locations[selected];
        const locationPicked = (({ id, name, address, price, slots }) => ({
            id,
            name,
            address,
            price,
            slots,
        }))(location);

        setLocation(locationPicked);
        closeModal();
        nextStep();
    };

    return (
        <ul className="w-full list-none p-0 m-0 divide-y divide-gray-200">
            {locations.map(
                ({ openingHours, id, available, ...location }, index) => (
                    <ListItem
                        key={id}
                        disabled={!available}
                        onClick={handleSelected.bind(this, index)}
                        onConfirm={handleConfirm}
                        title={`${location.name}`}
                        description={`${location.address.address1} ${location.address.city} ${location.address.zipCode}`}
                        active={selected === index}
                        content={<OpeningHours openingHours={openingHours} />}
                    />
                )
            )}
        </ul>
    );
};

export default memo(List, (prev, next) => {
    if (prev.selected !== next.selected) {
        return false;
    }
    if (prev.locations.length !== next.locations.length) {
        return false;
    }
    return true;
});
