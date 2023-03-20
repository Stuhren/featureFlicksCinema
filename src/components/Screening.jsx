import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export default function Screening(props) {

  // Destructure props into separate variables
  let { id, time, title, auditoriumId } = props;

  if (auditoriumId === 1) {
    auditoriumId = "Stora Salongen"
  } else {
    auditoriumId = "Lilla Salongen"
  }

  return (
    <Card className="cardLayout" border="dark" style={{ width: '18rem' }}>
      <Card.Body className="text-center">
        <Card.Title>{title}</Card.Title>
        <Card.Text>{new Date(time).toLocaleString()}</Card.Text>
        <Card.Text>{auditoriumId}</Card.Text>
        <Button variant="outline-dark" as={Link} to={`/booking/${id}`}>Book Seats</Button>
      </Card.Body>
    </Card>
  );
}