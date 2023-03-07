import { useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { preplanningLocationsState } from '../atoms';

function usePrePlanningLocations() {
  const [prePlanningLocations, setPrePlanningLocations] = useRecoilState(preplanningLocationsState);

  const updateLocations = useCallback((newVal, id) => {
    setPrePlanningLocations((locations) => {
      return locations.map((location) => {
        if (location.id === id) {
          location = newVal;
          location.id = id;
        }

        return location;
      });
    });
  }, [prePlanningLocations]);

  const addNewLocation = useCallback((newVal) => {
    setPrePlanningLocations((locations) => {
      return [...locations, newVal];
    });
  }, [prePlanningLocations])

  return {prePlanningLocations, updateLocations, addNewLocation};
}

export default usePrePlanningLocations;