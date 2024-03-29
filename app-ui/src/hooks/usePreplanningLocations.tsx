import { useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { preplanningLocationsState } from '../atoms';
import { LocationTypes } from "../types/location-types";

function usePrePlanningLocations() {
  const [prePlanningLocations, setPrePlanningLocations] = useRecoilState<LocationTypes[]>(preplanningLocationsState);

  const removeLocation = useCallback((id: number) => {
    setPrePlanningLocations((locations: LocationTypes[]) => {
      return locations.filter((location) => location.id !== id);
    });
  }, [prePlanningLocations]);
  
  const updateLocations = useCallback((newVal: LocationTypes, id: number) => {
    setPrePlanningLocations((locations: LocationTypes[]) => {
      return locations.map((location) => {
        if (location.id === id) {
          location = newVal;
          location.id = id;
        }

        return location;
      });
    });
  }, [prePlanningLocations]);

  const addNewLocation = useCallback((newVal: LocationTypes) => {
    setPrePlanningLocations((locations: LocationTypes[]) => {
      return [...locations, newVal];
    });
  }, [prePlanningLocations])

  // Provides an initial empty location object with all properties initialized
  const locationInitalizer: LocationTypes = {
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
  }

  return {prePlanningLocations, updateLocations, addNewLocation, removeLocation, locationInitalizer};
}

export default usePrePlanningLocations;