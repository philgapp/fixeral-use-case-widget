import { FC, useEffect, useState } from "react";
import { TimeEntry } from "@api/index";
import { useStore } from "@context/store";
import { useUI } from "@context/ui";
import { Button } from "@components/ui";
import { DAYS } from "@constants/index";
import { formatDate } from "@utils/index";
import { AvailableDateSlot } from "@schema/types";

const ListItemTimeEntriesSkeleton = () => {
    return (
        <div className="animate-pulse opacity-40 py-4">
            <div className="h-7 w-32  float-left mr-2 mb-2 bg-decent rounded"></div>
            <div className="h-7 w-32 float-left mr-2 mb-2 bg-decent rounded"></div>
            <div className="clear-both" />
            <div className="h-7 w-28  float-left mr-2 mb-2 bg-decent rounded"></div>
        </div>
    );
};

const TimeEntries = ({
    timeEntries,
    onClick,
    activeIndex,
}: {
    timeEntries: TimeEntry[];
    activeIndex: number;
    onClick: (index: number) => void;
}) => {
    return (
        <>
            {timeEntries.map(({ startTime, endTime, available }, index) => (
                <Button
                    className="button-no-round float-left mr-2 mb-2"
                    disabled={!available}
                    active={activeIndex === index}
                    onClick={onClick.bind(this, index)}
                    key={`time-entry-${index}`}
                >{`${startTime}-${endTime}`}</Button>
            ))}
        </>
    );
};

const TimeEntryPicker: FC<{ slots: AvailableDateSlot[] }> = ({ slots }) => {
    const { nextStep } = useUI();
    const { setTimeEntry } = useStore();
    const [dateIndex, setDateIndex] = useState(-1);

    const [timeEntryIndex, setTimeEntryIndex] = useState(-1);

    const getFirstAvailableIndex = (
        entries: {
            available: boolean;
        }[]
    ): number => {
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].available) return i;
        }
        return -1;
    };

    const handleSelectDate = (_dateIndex: number) => {
        setDateIndex(_dateIndex);

        const _timeEntryIndex = getFirstAvailableIndex(
            slots[_dateIndex].timeEntries
        );
        setTimeEntryIndex(_timeEntryIndex);
    };

    const handleTimeEntrySelect = (index: number) => {
        setTimeEntryIndex(index);
    };

    const handleConfirm = () => {
        if (slots[dateIndex] && slots[dateIndex].timeEntries[timeEntryIndex]) {
            const { date, timeEntries } = slots[dateIndex];
            const { id, startTime, endTime, variantId } = timeEntries[
                timeEntryIndex
            ];

            setTimeEntry({ id, startTime, endTime, date, variantId });
            nextStep();
        }
    };

    const renderDate = (date?: Date) => {
        if (date) {
            return (
                <div>
                    {DAYS[date.getDay()]}
                    <br></br>
                    {formatDate(date)}
                </div>
            );
        }
        return "N/A";
    };

    useEffect(() => {
        const _dateIndex = getFirstAvailableIndex(slots);
        setDateIndex(_dateIndex);

        const _timeEntryIndex = getFirstAvailableIndex(
            slots[_dateIndex].timeEntries
        );
        setTimeEntryIndex(_timeEntryIndex);
    }, []);

    if (dateIndex < 0) {
        return <ListItemTimeEntriesSkeleton />;
    }

    const { timeEntries, available } = slots[dateIndex];

    const isDisabled = !(available && timeEntries[timeEntryIndex].available);

    const buttonClasses = "float-left mr-2 mb-2";

    return (
        <>
            {slots.map(({ date, available }, index) => (
                <Button
                    className={`button-no-round ${buttonClasses}`}
                    key={`date-slot-${index}`}
                    disabled={!available}
                    active={index === dateIndex}
                    onClick={handleSelectDate.bind(this, index)}
                >
                    {renderDate(date)}
                </Button>
            ))}
            <div className="clear-both" />
            {timeEntries && (
                <TimeEntries
                    timeEntries={timeEntries}
                    activeIndex={timeEntryIndex}
                    onClick={handleTimeEntrySelect}
                />
            )}
            <div className="clear-both" />
            <Button
                primary
                className={buttonClasses}
                disabled={isDisabled}
                onClick={handleConfirm}
            >
                Confirm
            </Button>
        </>
    );
};

export default TimeEntryPicker;
