export type position = {
    lat: number;
    lng: number;
}

export type marker = {
    file_name: string;
    icon_id: number;
    image: string | null;
    latitude: number;
    longitude: number;
    marker_id: number;
    marker_name: string;
    position: position;
}