import { useEffect, React, useState } from 'react';
import { useStates } from '../utilities/states';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { GenerateBookingNumber } from '../components/GenerateBookingNumber';

const DisplaySeats = () => {
  const s = useStates({
    screening: null,
    movie: null,
    seats: [],
  });
  const [selectedSeats, setSelectedSeats] = useState([]);

  const { screeningId } = useParams();
  const [a,b] = useState(false)
  let bookingNumber = GenerateBookingNumber();
  

  useEffect(() => {
    (async () => {
      let screening = (
        await (
          await fetch(`/api/occupied_seats?screeningId=${screeningId}`)
        ).json()
      )[0];
      

      // Convert the string of occupied seats into an array of numbers
      screening.occupiedSeats = screening.occupiedSeats
        .split(', ')
        .map((x) => +x);

      // Set the state variable
      s.screening = screening;

      // Get the movie (with poster image, length of movie etc)
      s.movie = (
        await (
          await fetch(`/api/movies?title=${screening.movie}`)
        ).json()
      )[0];

      // Get the auditorium id from the auditorium name
      let auditoriumId =
        ['Stora Salongen', 'Lilla Salongen'].indexOf(
          s.screening.auditorium
        ) + 1;

      // Get the seats
      let seats = await (
        await fetch(
          `/api/seats/?auditoriumId=${auditoriumId}&sort=seatNumber`
        )
      ).json();

      // Convert the data structure from an array of objects
      // to an array (rows) of arrays (seats in rows) of objects
      let rows = [];
      let row;
      let latestRow;

      for (let seat of seats) {
        // Add a new property: Is the seat occupied? (true/false)
        seat.occupied = screening.occupiedSeats.includes(seat.seatNumber);
        // Arrange seats into rows
        if (latestRow !== seat.rowNumber) {
          row = [];
          rows.push(row);
        }
        row.push(seat);
        latestRow = seat.rowNumber;
      }

      // Set the state variable
      s.seats = rows;
    })();
  }, [screeningId]);

  function toggleSeatSelection(seat) {
    // do nothing if occupied
    if (seat.occupied) return;
  
    // toggle selected state
    seat.selected = !seat.selected;
  
    // update state variable
    s.seats = [...s.seats];
  
    // update selectedSeats array
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seat)) {
        return prevSelectedSeats.filter((s) => s !== seat);
      } else {
        return [...prevSelectedSeats, seat];
      }
    });
  }

  function handleCompleteOrder() {
    b(true)
  }

 

  // Render seating chart here
  
    return !a ?(s.seats.length === 0 ? null : (
      <div className="screening-and-seats">
        <h1>{s.screening.movie}</h1>
        <h2>
          {new Intl.DateTimeFormat('eng-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(s.screening.screeningTime))}
        </h2>
        <h2>{s.screening.auditorium}</h2>
        <hr className="headlineLine" />
        <img
          className="poster-screen"
          src={'https://cinema-rest.nodehill.se' + s.movie.description.posterImage}
        />
        <div className="seats">
          {s.seats.map((row) => (
            <>
              <div className="row">
                {row.map((seat) => (
                  <div
                    className={
                      (seat.selected ? 'selected' : '') +
                      (seat.occupied ? ' occupied' : '')
                    }
                    onClick={() => toggleSeatSelection(seat)}
                    key={seat.seatNumber} // Add a unique key prop to each seat element
                  >
                    {seat.seatNumber}
                  </div>
                ))}
              </div>
              <br />
            </>
          ))}
        </div>
        <hr className="headlineLine" />
        <h2>Choose Ticket Types</h2>
        <hr className="headlineLine" />
        <Button
          onClick= {handleCompleteOrder}
          variant="outline-warning"
        >
          Complete Order
        </Button>
      </div>)):(
        <div className="receiptPage">
        <h2 className='receiptText'>Thank you for booking your experience with us at Feature Flicks!</h2>
        <h2 className='receiptText'>Here is your receipt:</h2>
        <hr className="headlineLine pb-2" />
        <Card className="cardLayout" border="dark" style={{ width: '30rem', textAlign:"left"}}>
        <Card.Body className="text-align-left">
        <Card.Title>Booking ID: {bookingNumber}</Card.Title>
        <Card.Title>Movie: {s.movie.title}</Card.Title>
        <Card.Title>Date&Time: {new Intl.DateTimeFormat('eng-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(s.screening.screeningTime))}</Card.Title>
        <Card.Title>Auditorium: {s.screening.auditorium}</Card.Title>
        <Card.Title>Seats: {selectedSeats.map(seat => `Seat ${seat.seatNumber}, Row ${seat.rowNumber}`).join(" | ")}</Card.Title>
        <Card.Title>Ticket Types: tjabbatjena</Card.Title>
        <Card.Title>Total: tjabbatjena</Card.Title>
        </Card.Body>
        </Card>
        </div>)}

export default DisplaySeats;