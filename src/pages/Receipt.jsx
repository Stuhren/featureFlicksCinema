import Card from 'react-bootstrap/Card';
import { GenerateBookingNumber } from '../components/GenerateBookingNumber';

const Receipt = (props) => {

    let { seats, title } = props;


    let bookingNumber = GenerateBookingNumber();
    return (
        <Card className="cardLayout" border="dark" style={{ width: '24rem' }}>
        <Card.Body className="text-center">
        <Card.Title>Booking ID: {bookingNumber}</Card.Title>
        <Card.Title>{title}</Card.Title>
        {Array.isArray(seats) && (
          <Card.Text>Seats: {seats.join(" | ")}</Card.Text>
        )}
        </Card.Body>
        </Card>
    );
}

export default Receipt;