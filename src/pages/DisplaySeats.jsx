import { useEffect, React, useState } from 'react';
import { useStates } from '../utilities/states';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { GenerateBookingNumber } from '../components/GenerateBookingNumber';
import { DropdownButton, Dropdown } from 'react-bootstrap';

const DisplaySeats = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [childTicket, setChildTicket] = useState([]);
  const [adultTicket, setAdultTicket] = useState([]);
  const [seniorTicket, setSeniorTicket] = useState([]);
  const [selectedAdultValue, setSelectedAdultValue] = useState(0);
  const [selectedSeniorValue, setSelectedSeniorValue] = useState(0);
  const [selectedChildValue, setSelectedChildValue] = useState(0);


  const s = useStates({
    screening: null,
    movie: null,
    seats: [],
  });

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { screeningId } = useParams();
  const [receiptNotReady,receiptReady] = useState(false)
  let bookingNumber = GenerateBookingNumber();


  function ticketTypeLength() {
    if (selectedSeats.length == 0) {
      return 1
    } else {
      return selectedSeats.length
    }
  }


  const dropdownOptions = [];
  for (let i = 1; i <= ticketTypeLength; i++) {
    dropdownOptions.push(
      <Dropdown.Item key={i} eventKey={i.toString()}>{i}</Dropdown.Item>
    );
  }
  

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

      const ticketTypes = await (
        await fetch('/api/ticketTypes')
      ).json();
      setTicketTypes(ticketTypes);
      
      // Add the price for each ticket type
      ticketTypes.forEach((ticketType) => {
        if (ticketType.id === 1) {
          setChildTicket(ticketType.price)
        } else if (ticketType.id === 2) {
          setSeniorTicket(ticketType.price)
        } else if (ticketType.id === 3) {
          setAdultTicket(ticketType.price)
        }
      });

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
    const newSeats = s.seats.map((row) =>
      row.map((s) =>
        s.seatNumber === seat.seatNumber ? { ...s, selected: !s.selected } : s
      )
    );
  
    // update state variable
    s.seats = newSeats;
  
    // update selectedSeats array
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.some((s) => s.seatNumber === seat.seatNumber)) {
        return prevSelectedSeats.filter((s) => s.seatNumber !== seat.seatNumber);
      } else {
        return [...prevSelectedSeats, seat];
      }
    });
  }


  function handleCompleteOrder() {
    var ticketsSelected = parseInt(selectedAdultValue) + parseInt(selectedChildValue) + parseInt(selectedSeniorValue)
    if (selectedSeats.length === ticketsSelected) {
      receiptReady(true)
    } else {
      alert("Please make sure that the selected seats amount and the ticket types amount corresponds with each other.")
    }
  }


  function AdultDropdownButton() {
  
    const handleAdultSelect = (adultEventKey) => {
      const adultTicketCount = parseInt(adultEventKey, 10);
      const prevAdultTicketCount = parseInt(selectedAdultValue, 10) || 0;
      const prevAdultContribution = adultTicket * prevAdultTicketCount;
      const newAdultContribution = adultTicket * adultTicketCount;
      const newTotalPrice = totalPrice - prevAdultContribution + newAdultContribution;
      setSelectedAdultValue(adultEventKey);
      setTotalPrice(newTotalPrice);
    };
  
    const dropdownOptions = [];
    for (let i = 1; i <= ticketTypeLength(); i++) {
      dropdownOptions.push(
        <Dropdown.Item key={i} eventKey={i.toString()}>
          {i}
        </Dropdown.Item>
      );
    }
  
    return (
      <div>
        <h4>Adults</h4>
        <DropdownButton
          id="adult-dropdown-button"
          title={selectedAdultValue || "Amount"}
          onSelect={handleAdultSelect}
          variant="warning"
        >
          {dropdownOptions}
        </DropdownButton>
      </div>
    );
  }


  function SeniorDropdownButton() {
    const handleSeniorSelect = (seniorEventKey) => {
      const seniorTicketCount = parseInt(seniorEventKey, 10);
      const prevSeniorTicketCount = parseInt(selectedSeniorValue, 10) || 0;
      const prevSeniorContribution = seniorTicket * prevSeniorTicketCount;
      const newSeniorContribution = seniorTicket * seniorTicketCount;
      const newTotalPrice = totalPrice - prevSeniorContribution + newSeniorContribution;
      setSelectedSeniorValue(seniorEventKey);
      setTotalPrice(newTotalPrice);
    };


    const dropdownOptions = [];
    for (let i = 1; i <= ticketTypeLength(); i++) {
      dropdownOptions.push(
        <Dropdown.Item key={i} eventKey={i.toString()}>
          {i}
        </Dropdown.Item>
      );
    }
  
    return (
      <div>
        <h4>Seniors</h4>
      <DropdownButton
        id="adult-dropdown"
        className="dropdownButton"
        title={selectedSeniorValue || "Amount"}
        onSelect={handleSeniorSelect}
        variant="warning"
      >
        {dropdownOptions}
      </DropdownButton>
      </div>
    );
  }


  function ChildDropdownButton() {
  
    const handleChildSelect = (childEventKey) => {
      const childTicketCount = parseInt(childEventKey, 10);
      const prevChildTicketCount = parseInt(selectedChildValue, 10) || 0;
      const prevChildContribution = childTicket * prevChildTicketCount;
      const newChildContribution = childTicket * childTicketCount;
      const newTotalPrice = totalPrice - prevChildContribution + newChildContribution;
      setSelectedChildValue(childEventKey);
      setTotalPrice(newTotalPrice);
    };
  
    const dropdownOptions = [];
    for (let i = 1; i <= ticketTypeLength(); i++) {
      dropdownOptions.push(
        <Dropdown.Item key={i} eventKey={i.toString()}>
          {i}
        </Dropdown.Item>
      );
    }
  
    return (
      <div>
        <h4>Children</h4>
      <DropdownButton
        id="adult-dropdown"
        className="dropdownButton"
        title={selectedChildValue || "Amount"}
        onSelect={handleChildSelect}
        variant="warning"
      >
        {dropdownOptions}
      </DropdownButton>
      </div>
    );
  }


  // Render seating chart here
  
    return !receiptNotReady ?(s.seats.length === 0 ? null : (
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
        <div className="ticket-dropdowns">
        <ChildDropdownButton />
        <AdultDropdownButton />
        <SeniorDropdownButton />
        </div>
        <hr className="headlineLine" />
        <h2>Total: {totalPrice} SEK</h2>
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
        <hr className="headlineCategory" />
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
        <hr className="headlineCategory" />
        <Card.Title>Ticket Types:</Card.Title>
        <Card.Title>Children: {selectedChildValue}x {childTicket} SEK</Card.Title>
        <Card.Title>Adults: {selectedAdultValue}x {adultTicket} SEK</Card.Title>
        <Card.Title>Seniors: {selectedSeniorValue}x {seniorTicket} SEK</Card.Title>
        <hr className="headlineCategory" />
        <Card.Title>Total: {totalPrice} SEK</Card.Title>
        </Card.Body>
        </Card>
        </div>)}


export default DisplaySeats;