import {
    FC,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useConfig } from "@context/config";
import { SharedState } from "./PickupPicker";

import { useGoogleMaps } from "@hooks/google-maps";
import { AvailablePickupLocation } from "@schema/types";

declare global {
    interface Window {
        google: any;
    }
}

interface MapProps {
    locations: AvailablePickupLocation[];
    coords?: { latitude: number | null; longitude: number | null };
}

const CONTAINER_STYLE = {
    width: "100%",
    height: "100%",
};

// Copenhagen
const CENTER = {
    lat: 55.6683071,
    lng: 12.4762091,
};

const MAP_OPTIONS: google.maps.MapOptions = {
    styles: [
        {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#444444",
                },
            ],
        },
        {
            featureType: "landscape",
            elementType: "all",
            stylers: [
                {
                    color: "#eaeaea",
                },
            ],
        },
        {
            featureType: "poi",
            elementType: "all",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "road",
            elementType: "all",
            stylers: [
                {
                    saturation: -100,
                },
                {
                    lightness: 45,
                },
            ],
        },
        {
            featureType: "road.highway",
            elementType: "all",
            stylers: [
                {
                    visibility: "simplified",
                },
            ],
        },
        {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "transit",
            elementType: "all",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "water",
            elementType: "all",
            stylers: [
                {
                    color: "#283583",
                },
                {
                    visibility: "on",
                },
            ],
        },
    ],
};

const PIN_ICON = {
    path:
        "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    fillColor: "#363636",
    strokeColor: "#fff",
    fillOpacity: 1,
    strokeWeight: 1,
    scale: 2,
};

const HOME_ICON = {
    path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    fillColor: "#fabb04",
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 1,
    scale: 1.5,
};

export const MapSkeleton = () => {
    return (
        <div className="w-full h-full animate-pulse opacity-40 bg-decent"></div>
    );
};

const getLatLng = ({ lat, lng }: { lat: string; lng: string }) => {
    return {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
    };
};

const Map: FC<MapProps & SharedState> = ({
    locations,
    selected,
    setSelected,
    coords,
}) => {
    const { defaultLocation } = useConfig();

    const { isLoaded, loadError } = useGoogleMaps();

    const renderMap = () => {
        const [map, setMap] = useState<GoogleMap | null>(null);

        const center = useRef({ ...CENTER, ...defaultLocation });

        const onLoad = useCallback(function callback(map) {
            setMap(map);
        }, []);

        const handleClick = (index: number) => {
            setSelected(index);
        };

        useEffect(() => {
            if (
                map &&
                coords &&
                coords.latitude !== null &&
                coords.longitude !== null
            ) {
                const { latitude, longitude } = coords;

                map.panTo({ lat: latitude, lng: longitude });
            }
        }, [coords]);

        useEffect(() => {
            if (map && selected >= 0 && selected < locations.length) {
                map.panTo(getLatLng(locations[selected].coordinates));
            }
        }, [selected]);

        useEffect(() => {
            return () => {
                setMap(null);
            };
        }, []);

        return (
            <GoogleMap
                mapContainerStyle={CONTAINER_STYLE}
                center={center.current}
                zoom={11}
                onLoad={onLoad}
                options={MAP_OPTIONS}
            >
                {locations.map(({ id, coordinates }, index) => (
                    <Marker
                        onClick={handleClick.bind(this, index)}
                        key={id}
                        position={getLatLng(coordinates)}
                        icon={{
                            ...PIN_ICON,
                            fillColor:
                                index === selected ? "#e94335" : "#363636",
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(12, 24),
                        }}
                    />
                ))}
                {coords &&
                    coords.latitude !== null &&
                    coords.longitude !== null && (
                        <Marker
                            key="home-icon"
                            position={{
                                lat: coords.latitude,
                                lng: coords.longitude,
                            }}
                            icon={{
                                ...HOME_ICON,
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(12, 24),
                            }}
                        />
                    )}
            </GoogleMap>
        );
    };

    if (loadError) {
        return (
            <div className="text-center pt-40">
                Map cannot be loaded right now, sorry.
            </div>
        );
    }

    return isLoaded ? renderMap() : <MapSkeleton />;
};

export default memo(Map, (prev, next) => {
    if (prev.selected !== next.selected) {
        return false;
    }
    if (prev.locations.length !== next.locations.length) {
        return false;
    }
    if (JSON.stringify(prev.coords) !== JSON.stringify(next.coords)) {
        return false;
    }
    return true;
});
