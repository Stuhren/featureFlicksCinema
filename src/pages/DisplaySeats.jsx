import { useEffect, React } from 'react';
import { useStates } from '../utilities/states';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Receipt from './Receipt'
import { Link } from 'react-router-dom';

const DisplaySeats = () => {
  const s = useStates({
    screening: null,
    movie: null,
    seats: [],
  });
  const { screeningId } = useParams();

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
  }

  function handleCompleteOrder() {
    const selectedSeats = s.seats
      .flat()
      .filter((seat) => seat.selected)
      .map((seat) => seat.seatNumber);
    const title = s.screening.movie;
    
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    
    return (
      <>
        <Receipt seats={selectedSeats} title={title} />
        <p>Booking ID: 123123</p>
      </>
    );
  }

  // Render seating chart here
  return (
    s.seats.length === 0 ? null : (
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
        <Button
          onClick= {handleCompleteOrder}
          variant="outline-warning"
          as={Link}
          to={`/receipt`}
        >
          Complete Order
        </Button>
      </div>
    )
  );
}

export default DisplaySeats;