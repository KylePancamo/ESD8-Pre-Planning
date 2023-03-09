import { useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { preplanningLocationsState } from '../atoms';
import { LocationTypes } from "../types/location-types";

function usePrePlanningLocations() {
  const [prePlanningLocations, setPrePlanningLocations] = useRecoilState<LocationTypes[]>(preplanningLocationsState);

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

  return {prePlanningLocations, updateLocations, addNewLocation};
}

export default usePrePlanningLocations;