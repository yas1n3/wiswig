import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function NewUser() {
    return (
        <Form>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control placeholder="First name" />
                </Col>
                <Col md={6}>
                    <Form.Control placeholder="Last name" />
                </Col>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
            </Row>
            <Row>
                <Col>
                    <button className="btn btn-primary">Submit</button>
                </Col>
            </Row>
        </Form>
    );
}
