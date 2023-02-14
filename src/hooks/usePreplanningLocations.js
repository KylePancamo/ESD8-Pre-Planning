import { useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { preplanningLocationsState } from '../atoms';

function usePrePlanningLocations() {
  const [prePlanningLocations, setPrePlanningLocations] = useRecoilState(preplanningLocationsState);

  const updateLocations = useCallback((newVal) => {
    setPrePlanningLocations((locations) => {
      return locations.map((location) => {
        if (location.id === newVal.id) {
          location.occupancyname = newVal.occupancyname;
          location.occupancyaddress = newVal.occupancyaddress;
        }

        return location;
      });
    });
  }, []);

  return [prePlanningLocations, updateLocations];
}

export default usePrePlanningLocations;