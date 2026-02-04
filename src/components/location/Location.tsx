"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconAnchor: [12, 41],
});

interface Location {
    lat?: number; 
    lng?: number; 
    name?: string 
}

L.Marker.prototype.options.icon = DefaultIcon;

async function getPlaceName(lat: number, lng: number): Promise<string> {
    try {
        const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        return data.display_name || "Unnamed Location";
    } catch {
        return "Unnamed Location";
    }
}

function LocationMarker({
    setLocation,
}: {
    setLocation: (pos: [number, number], name?: string) => void;
}) {
    useMapEvents({
        async click(e) {
            const name = await getPlaceName(e.latlng.lat, e.latlng.lng);
            setLocation([e.latlng.lat, e.latlng.lng], name);
        },
    });
    return null;
}

function SearchControlComponent({
    setLocation,
}: {
     setLocation: (pos: [number, number], name?: string) => void;
}) {
    const map = useMapEvents({});
    const provider = new OpenStreetMapProvider();

    if (!(map as any)._searchControl) {
        const searchControl = new (GeoSearchControl as any)({
            provider,
            style: "bar",
            autoClose: true,
            showMarker: true,
            showPopup: true,
            retainZoomLevel: false,
        });
        map.addControl(searchControl);
        (map as any)._searchControl = searchControl;

        map.on("geosearch/showlocation", (result: any) => {
            if (result?.location) {
                const { x, y, label } = result.location;
                setLocation([y, x], label);
            }
        });
    }
    return null;
}

export default function LocationPickerInner({
    onSelect,
    value,
}: {
    onSelect: (coords: { lat: number; lng: number; name?: string }) => void;
    value?: Location | any;
}) {
    const [position, setPosition] = useState<[number, number]>([20, 77]);

    const setLocation = (pos: [number, number], name?: string) => {
        setPosition(pos);
        const newLocation = { lat: pos[0], lng: pos[1], name };
        onSelect(newLocation); 
    };

    return (
        <div className="dark:p-2 mb-2 h-[370px]">
            <MapContainer 
                center={value?.length && value[0] || position as LatLngExpression} 
                zoom={16} 
                style={{ height: "100%", width: "100%", cursor:"pointer" }}
            >
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 />
                <LocationMarker setLocation={setLocation} />
                <SearchControlComponent setLocation={setLocation} />
                <Marker position={ value?.length && value[0] || position as LatLngExpression } />
            </MapContainer>
            <div className="p-2 bg-gray-300 text-xxs">
                {value[0] ? (
                    <p><strong>Coordinates:</strong> Lat: {value[0]?.lat}, Lng: {value[0]?.lng}</p>
                ) : (
                    <p>No Coordinates found.</p>
                )}
            </div>
        </div>
    );
}