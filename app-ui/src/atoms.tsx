import { atom } from "recoil";
import { Image } from "./types/atoms-types";
import { LocationTypes } from "./types/location-types";

export const imagesState = atom<Image[]>({
    key: 'imagesState',
    default: [],
});

export const searchSiteState = atom<LocationTypes>({
    key: 'searchSiteState',
    default: {
        google_formatted_address: '',
        latitude: 0,
        longitude: 0,
        occupancyname: '',
        mutual_aids: [],
        occupancyaddress: '',
        occupancycity: '',
        occupancystate: '',
        occupancyzip: '',
        occupancycountry: '',
        construction_types: [],
        hazards: '',
        hydrant_address: '',
        hydrant_distance: 0,
        access: '',
        electric_meter: '',
        breaker_box: '',
        water: '',
        gas_shutoff: '',
        emergency_contact_number: '',
        other_notes: '',
        occupancy_types: [],
        contactname: '',
    },
})

export const boundsState = atom({
    key: 'bounds',
    default: null,
})

export const searchBoxState = atom({
    key: 'searchBox',
    default: null,
})

export const preplanningLocationsState = atom<LocationTypes[]>({
    key: 'preplanningLocations',
    default: [],
})

export const defaultMarkerIconExistsState = atom<boolean>({
    key: 'defaultMarkerIconExists',
    default: false,
})