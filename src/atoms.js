import { atom } from "recoil";

export const imagesState = atom({
    key: 'imagesState',
    default: [],
});

export const searchSiteState = atom({
    key: 'searchSiteState',
    default: {},
})

export const sideBarDataState = atom({
    key: 'sideBarData',
    default: [],
})

export const siteIsSetState = atom({
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

export const preplanningLocationsState = atom({
    key: 'preplanningLocations',
    default: [],
})