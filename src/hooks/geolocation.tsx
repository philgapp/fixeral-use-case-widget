import { useEffect, useRef, useState } from "react";

export const useGeolocation = () => {
    const [error, setError] = useState("");

    const isSubscribed = useRef(true);

    const [coords, setCoords] = useState<GeolocationPosition["coords"]>();

    const handleSuccess = (positoin: GeolocationPosition) => {
        if (isSubscribed.current) {
            setCoords(positoin.coords);
        }
    };

    const handleError = (error: GeolocationPositionError) => {
        if (isSubscribed.current) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported.");
            return;
        }
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

        return () => {
            isSubscribed.current = false;
        };
    }, []);

    return { coords, error };
};
