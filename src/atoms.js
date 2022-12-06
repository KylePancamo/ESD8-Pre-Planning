import { atom } from "recoil";

export const imagesState = atom({
    key: 'nameState',
    default: [],
});

export const searchSiteState = atom({
    key: 'searchSiteState',
    default: {},
})

export const boundsState = atom({
    key: 'bounds',
    default: null,
})

export const searchBoxState = atom({
    key: 'searchBox',
    default: null,
})