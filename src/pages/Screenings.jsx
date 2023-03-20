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

  // Group the screenings by date and get weekday
  const screeningsByDate = {};
  screenings.forEach(screening => {
    const dateObj = new Date(screening.time);
    const date = dateObj.toLocaleDateString();
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const dateWithWeekday = `${weekday}, ${date}`;
    if (!screeningsByDate[dateWithWeekday]) {
      screeningsByDate[dateWithWeekday] = [];
    }
    screeningsByDate[dateWithWeekday].push(screening);
});


  return (
    <div>
      <Container fluid className="movieContainer">
        {Object.entries(screeningsByDate).map(([date, screeningsForDate]) => (
          <div key={date}>
            <h2 className="headlineDate">{date}</h2>
            <hr className="headlineLine" />
            <Row md={2} lg={3} xxl={4} className="mt-4">
              {screeningsForDate.map(({ movieId, title, time, auditoriumId }, index) => (
                <Col key={index} className="mb-4">
                  <Screening title={title} time={time} auditoriumId={auditoriumId} />
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default Screenings;
