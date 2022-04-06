import { useLoadScript } from "@react-google-maps/api";

import { useConfig } from "@context/config";

export const LIBRARIES = ["places"] as ["places"];

export const useGoogleMaps = () => {
    const { googleMapsApiKey } = useConfig();

    return useLoadScript({
        id: "google-map-script",
        googleMapsApiKey,
        libraries: LIBRARIES,
    });
};
