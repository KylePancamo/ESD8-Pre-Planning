import {Spinner} from "react-bootstrap";
const Loading = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed', // Fixed positioning to cover whole screen
                top: 0,
                left: 0,
                width: '100%', // Full width
                height: '100%', // Full height
                zIndex: 9999, // High z-index to overlay all other elements
                backgroundColor: 'rgba(0, 0, 0, 0.4)' // Semi-transparent black background
            }}
        >
            <Spinner
                animation="border"
                variant="primary"
                style={{ width: '3rem', height: '3rem' }} // Make spinner bigger
            />
        </div>
    );
}

export default Loading;