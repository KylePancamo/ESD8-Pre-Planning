import {useState} from 'react';

const useStateWithCallback = (initialState) => {
    const [value, setValue] = useState(initialState);

    const setValueAndCallback = (newValue, callback) => {
        setValue(prevValue => {
            if (callback) {
                callback(prevValue, newValue);
            }
            return newValue;
        });
    }

    return [value, setValueAndCallback];
}

export default useStateWithCallback;