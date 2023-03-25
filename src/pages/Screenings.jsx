import Screening from '../components/Screening';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const Screenings = () => {
  const [screenings, setScreenings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');


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
          return { ...screening, title: movie.title, description: movie.description, };
      });
      setScreenings(screeningComplete);
      const uniqueCategories = [...new Set(moviesInfo.flatMap(movie => movie.description.categories))];
      setCategories(uniqueCategories);
    })();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const filteredScreenings = selectedCategory ? screenings.filter(screening => screening.description.categories.includes(selectedCategory)) : screenings;


  // Group the screenings by date and get weekday
  const screeningsByDate = {};
  filteredScreenings.forEach(screening => {
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
        <Row className="justify-content-center">
          <Col>
            <DropdownButton
              id="category-dropdown"
              className="dropdownButton"
              title={selectedCategory || 'Select Category'}
              onSelect={handleCategorySelect}
              variant="warning"
            >
              <Dropdown.Item eventKey="">All Categories</Dropdown.Item>
              <hr className="headlineCategory" />
              {categories.map((category, index) => (
                <Dropdown.Item key={index} eventKey={category}>{category}</Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </Row>
        {Object.entries(screeningsByDate).map(([date, screeningsForDate]) => (
          <div key={date}>
            <h2 className="headlineDate">{date}</h2>
            <hr className="headlineLine" />
            <Row md={2} lg={3} xxl={4} className="mt-4">
            {screeningsForDate.map(({ id, title, time, auditoriumId, description }, index) => (
              <Col key={index} className="mb-4">
                <Screening id={id} title={title} time={time} auditoriumId={auditoriumId} description={description} />
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