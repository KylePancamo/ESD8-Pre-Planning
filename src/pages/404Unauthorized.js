import './404Unauthorized.css';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from "../hooks/AuthProvider";

const RouteUnauthorized = () => {

        // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const Ref = useRef(null);
    const { logout } = useAuth();
  
    // The state for our timer
    const [timer, setTimer] = useState('00');
  
  
    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        return {
            total, seconds
        };
    }
  
  
    const startTimer = (e) => {
        let { total, seconds } = getTimeRemaining(e);
        if (total >= 0) {
  
            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setTimer((seconds > 9 ? seconds : '0' + seconds))
        }
        else {
            console.log('Time is up')
            logout();
        }
    }
  
  
    const clearTimer = (e) => {
  
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next    
        setTimer('10');
  
        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }
  
    const getDeadTime = () => {
        let deadline = new Date();
  
        // This is where you need to adjust if 
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + 10);
        return deadline;
    }
  
    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible
  
    // We put empty array to act as componentDid
    // mount only
    useEffect(() => {
        clearTimer(getDeadTime());

        return () => {
            if (Ref.current) clearInterval(Ref.current);
        }
    }, []);

    return (
        <div className="Unauthorized">
            <div className="Unauthorized-container" style = {{
                fontFamily: 'Arial',
                
            }}>
                <h1>404</h1>
                <h2>Unauthorized</h2>
                <p>Sorry, you do not have permissions to view this page.</p>
                <p>Logging out in... {timer} seconds</p>
            </div>
        </div>
    );
}

export default RouteUnauthorized;