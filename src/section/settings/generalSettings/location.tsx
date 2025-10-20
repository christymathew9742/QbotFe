// "use client";

// import { useState } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L, { LatLngExpression } from "leaflet";
// import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
// import "leaflet-geosearch/dist/geosearch.css";

// // Fix marker icon issue in Next.js + Leaflet
// const DefaultIcon = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconAnchor: [12, 41],
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// // Reverse geocode using Nominatim
// async function getPlaceName(lat: number, lng: number): Promise<string> {
//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
//     );
//     const data = await res.json();
//     return data.display_name || "Unnamed Location";
//   } catch {
//     return "Unnamed Location";
//   }
// }

// function LocationMarker({ addLocation }: { addLocation: (pos: [number, number], name?: string) => void }) {
//   useMapEvents({
//     async click(e) {
//       const name = await getPlaceName(e.latlng.lat, e.latlng.lng);
//       addLocation([e.latlng.lat, e.latlng.lng], name);
//     },
//   });
//   return null;
// }

// function SearchControlComponent({ addLocation }: { addLocation: (pos: [number, number], name?: string) => void }) {
//   const map = useMapEvents({});
//   const provider = new OpenStreetMapProvider();

//   if (!(map as any)._searchControl) {
//     const searchControl = new (GeoSearchControl as any)({
//       provider,
//       style: "bar",
//       autoClose: true,
//       showMarker: true,
//       showPopup: true,
//       retainZoomLevel: false,
//     });
//     map.addControl(searchControl);
//     (map as any)._searchControl = searchControl;

//     // Fix typing: event as any
//     map.on("geosearch/showlocation", (result: any) => {
//       if (result?.location) {
//         const { x, y, label } = result.location;
//         addLocation([y, x], label);
//       }
//     });
//   }
//   return null;
// }

// export default function LocationPickerInner({
//   onSelect,
// }: {
//   onSelect: (coords: { lat: number; lng: number; name?: string }[]) => void;
// }) {
//   const [position, setPosition] = useState<[number, number]>([20, 77]); // default India
//   const [locations, setLocations] = useState<
//     { lat: number; lng: number; name?: string }[]
//   >([]);

//   const addLocation = (pos: [number, number], name?: string) => {
//     setPosition(pos);

//     const newLocation = { lat: pos[0], lng: pos[1], name };
//     setLocations((prev) => {
//       const updated = [...prev, newLocation];
//       onSelect(updated); // send array to parent
//       return updated;
//     });
//   };

//   return (
//     <div>
//       <MapContainer center={position} zoom={5} style={{ height: "500px", width: "100%" }}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         <LocationMarker addLocation={addLocation} />
//         <SearchControlComponent addLocation={addLocation} />
//         <Marker position={position as LatLngExpression} />
//       </MapContainer>

//       {/* Bottom Display */}
//       <div className="p-4 bg-gray-100 text-sm">
//         <h3 className="font-semibold mb-2">Selected Locations:</h3>
//         {locations.length === 0 ? (
//           <p>No location selected yet.</p>
//         ) : (
//           <ul className="list-disc pl-5 space-y-1">
//             {locations.map((loc, i) => (
//               <li key={i}>
//                 <strong>{loc.name ?? "Unnamed"}</strong> → Lat: {loc.lat}, Lng: {loc.lng}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// Fix marker icon issue in Next.js + Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Reverse geocode using Nominatim
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

    // Fix typing: event as any
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
}: {
  onSelect: (coords: { lat: number; lng: number; name?: string }) => void;
}) {
  const [position, setPosition] = useState<[number, number]>([20, 77]); // default India
  const [selected, setSelected] = useState<{ lat: number; lng: number; name?: string } | null>(null);

  const setLocation = (pos: [number, number], name?: string) => {
    setPosition(pos);

    const newLocation = { lat: pos[0], lng: pos[1], name };
    setSelected(newLocation);
    onSelect(newLocation); // send latest only
  };

  return (
    <div>
      <MapContainer center={position} zoom={5} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker setLocation={setLocation} />
        <SearchControlComponent setLocation={setLocation} />
        <Marker position={position as LatLngExpression} />
      </MapContainer>

      {/* Bottom Display */}
      <div className="p-4 bg-gray-100 text-sm">
        <h3 className="font-semibold mb-2">Selected Location:</h3>
        {selected ? (
          <p className="!text-xxs">
            <strong>{selected.name ?? "Unnamed"}</strong> → Lat: {selected.lat}, Lng: {selected.lng}
          </p>
        ) : (
          <p>No location selected yet.</p>
        )}
      </div>
    </div>
  );
}

