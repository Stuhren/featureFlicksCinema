import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export default function Screening(props) {

  // Destructure props into separate variables
  let { id, time, title, auditoriumId, description } = props;
  let {length, categories, posterImage} = description;

  if (auditoriumId === 1) {
    auditoriumId = "Stora Salongen"
  } else {
    auditoriumId = "Lilla Salongen"
  }

  const hours = Math.floor(length / 60);
  const minutes = length % 60;

  posterImage = 'https://cinema-rest.nodehill.se/' + posterImage;

  return (
    <Card className="cardLayout" border="dark" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={posterImage} style={{ height: '400px' }} />
      <Card.Body className="text-center">
        <Card.Title>{title}</Card.Title>
        <Card.Text>{new Date(time).toLocaleString()}</Card.Text>
        {Array.isArray(categories) && (
          <Card.Text>{categories.join(" | ")}</Card.Text>
        )}
        <Card.Text>Length: {hours}h {minutes}m</Card.Text>
        <Card.Text>{auditoriumId}</Card.Text>
        <Button variant="outline-dark" as={Link} to={`/booking/${id}`}>Book Seats</Button>
      </Card.Body>
    </Card>
  );
}