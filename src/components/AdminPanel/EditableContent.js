import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function Content(props) {
  return (
    <div className="editable-content">
      <Form>
        <Form.Group size="lg" controlId="email" >
          <Form.Label>Occupancy Type :</Form.Label>

          <Form.Control
            autoFocus
            className="edit-form"
          />
        </Form.Group>

        <Form.Group size="lg" controlId="password">
          <Form.Label>Construction Type :</Form.Label>

          <Form.Control
            className="edit-form"
          />
          <div styles="height:20px"></div>
        </Form.Group>
        <Form.Group size="lg" controlId="email" >
          <Form.Label>Mutual Aid:</Form.Label>

          <Form.Control
            autoFocus
            className="edit-form"
          />
        </Form.Group>

        <Form.Group size="lg" controlId="password">
          <Form.Label>Hazards:</Form.Label>

          <Form.Control
            className="edit-form"
          />
          <div styles="height:20px"></div>
        </Form.Group>

        <Form.Group size="lg" controlId="password">
          <Form.Label>Hydrant Location:</Form.Label>

          <Form.Control
            className="edit-form"
          />
          <div styles="height:20px"></div>
        </Form.Group>

        <Form.Group size="lg" controlId="password">
          <Form.Label>Access:</Form.Label>

          <Form.Control
            className="edit-form"
          />
          <div styles="height:20px"></div>
        </Form.Group>

        <Form.Group size="lg" controlId="password">
          <Form.Label>Emergency Contact:</Form.Label>

          <Form.Control
            className="edit-form"
          />
          <div styles="height:20px"></div>
        </Form.Group>

        <Form.Group size="lg" controlId="password">
          <Form.Label>Notes :</Form.Label>

          <Form.Control
            className="edit-form"
          />
          <div styles="height:20px"></div>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Content;
