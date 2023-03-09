export type Image = {
    file_name: string;
    icon_id: number;
    icon_name: string;
}

export type SearchSite = {
    location: string;
    latitude: number;
    longitude: number;
}

export type LocationTypes = {
    id?: number | undefined;
    google_formatted_address: string;
    latitude: number;
    longitude: number;
    occupancyname: string;
    mut_aid_helotesfd: number;
    mut_aid_d7fr: number;
    mut_aid_leonspringsvfd: number;
    mut_aid_bc2fd: number;
    occupancyaddress: string;
    occupancycity: string;
    occupancystate: string;
    occupancyzip: string;
    occupancycountry: string;
    constructiontype: number;
    hazards: string;
    hydrant_address: string;
    hydrant_distance: number;
    access: string;
    electric_meter: string;
    breaker_box: string;
    water: string;
    gas_shutoff: string;
    emergency_contact_number: string;
    other_notes: string;
    occupancytype: string;
    contactname: string;
};