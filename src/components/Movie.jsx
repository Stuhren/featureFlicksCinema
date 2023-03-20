import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export default function Movie(props) {

  // Destructure props into separate variables
  let { title, description } = props;
  let { posterImage } = description;

  // Add the correct domain to the image path
  posterImage = 'https://cinema-rest.nodehill.se/' + posterImage;

  return (
    <Card className="cardLayout" border="dark" style={{ width: '18rem' }}>
    <Card.Img variant="top" src={posterImage} style={{ height: '400px' }} />
    <Card.Body className="text-center">
      <Card.Title>{title}</Card.Title>
      <Card.Text>This is a movie!</Card.Text>
      <Button variant="outline-dark" as={Link} to={`/movies/${props.id}`}>More Info</Button>
    </Card.Body>
  </Card>
  );
}