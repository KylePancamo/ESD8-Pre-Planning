import { atom } from "recoil";
import { Image, SearchSite, LocationTypes } from "./types/atoms-types";

export const imagesState = atom<Image[]>({
    key: 'imagesState',
    default: [],
});

export const searchSiteState = atom<SearchSite>({
    key: 'searchSiteState',
    default: {
        location: '',
        latitude: 0,
        longitude: 0,
    },
})

export const sideBarDataState = atom<LocationTypes[]>({
    key: 'sideBarData',
    default: [],
})

export const siteIsSetState = atom<boolean>({
    key: 'siteIsSet',
    default: false,
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