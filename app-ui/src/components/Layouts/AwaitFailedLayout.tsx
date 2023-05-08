import { useAsyncError } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
const AwaitFailedLayout = () => {
    const error = useAsyncError() as any

    return (
        <div>
            <Container className="align-items-center">
                <Row className="justify-content-center">
                    <Col md={3}>
                        <h1>{error.message} </h1>
                        <h1>Error Code: {error.code}</h1>
                    </Col>
                </Row>
            </Container>
            
        </div>
    );
};

export default AwaitFailedLayout;