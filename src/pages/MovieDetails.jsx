import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Screening from '../components/Screening';

export default function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const [movieData, screeningsData] = await Promise.all([
          fetch(`/api/movies/${id}`),
          fetch(`/api/screenings?movieId=${id}&sort=time`),
      ]);
      if (movieData.ok && screeningsData.ok) {
        const movieInfo = await movieData.json();
        const screeningsInfo = await screeningsData.json();
        const screeningComplete = screeningsInfo.map(screening => {
          return { ...screening, title: movieInfo.title };
        });
        setMovie(movieInfo);
        setScreenings(screeningComplete);
      }
    })();
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  let { title, description } = movie;
  let { posterImage } = description;
  posterImage = 'https://cinema-rest.nodehill.se/' + posterImage;

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

  const dates = Object.keys(screeningsByDate);

  return (
    <Container fluid className="movieDetails" key={id}>
      <div>
        <img className="mx-auto pt-4 pb-4" src={posterImage} alt={title} />
        <hr className="headlineLine" />
        <p className="movieTitle">Title: {title}</p>
        <hr className="headlineLine" />
        <p className="movieTitle">Future Screenings</p>
        <Row>
          {dates.map(date => (
            <Col key={date} className="mb-4 col-xxl-6">
              <h3 className="detailsDate text-align-center">{date}</h3>
              <Row className="justify-content-center">
                {screeningsByDate[date].map(({ id, time, auditoriumId, title }) => (
                  <Col key={id} className="mb-4">
                    <Screening title={title} time={new Date(time).toLocaleString()} auditoriumId={auditoriumId} />
                  </Col>
                ))}
              </Row>
            </Col>
          ))}
          <hr className="headlineLine" />
        </Row>
        <hr className="headlineLine" />
      </div>
    </Container>
  );
}