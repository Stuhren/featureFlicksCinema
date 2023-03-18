import Screening from '../components/Screening';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';


const Screenings = () => {
const [screenings, setScreenings] = useState([]);

useEffect(() => {
    (async () => {
      const [screeningsData, moviesData] = await Promise.all([
          fetch('/api/screenings?sort=time'),
          fetch('/api/movies')
      ]);
      const screeningsInfo = await screeningsData.json();
      const moviesInfo = await moviesData.json();
      const screeningComplete = screeningsInfo.map(screening => {
          const movie = moviesInfo.find(movie => movie.id === screening.movieId);
          return { ...screening, title: movie.title };
      });
      setScreenings(screeningComplete);
    })();
  }, []);


return (
    <div>
  <Container fluid className="movieContainer">
    <Row md={2} lg={3} xxl={4} className="mt-4">
    {screenings.map(({ movieId, title, time, auditoriumId }, index) => (
  <Col key={index} className="mb-4">
    <Screening title={title} time={time} auditoriumId={auditoriumId} />
  </Col>
      ))}
    </Row>
  </Container>
  </div>
);
}

export default Screenings;