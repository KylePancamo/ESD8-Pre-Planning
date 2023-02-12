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
  }, []);

  return [prePlanningLocations, updateLocations];
}

export default usePrePlanningLocations;