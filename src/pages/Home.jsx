import Movie from '../components/Movie';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/movies');
      const data = await response.json();
      setMovies(data);
      const uniqueCategories = [...new Set(data.flatMap(movie => movie.description.categories))];
      setCategories(uniqueCategories);
    })();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const filteredMovies = selectedCategory ? movies.filter(movie => movie.description.categories.includes(selectedCategory)) : movies;

  return (
    <div>
      <Container fluid className="movieContainer">
        <Row>
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
            <hr className="headlineLine" />
          </Col>
        </Row>
        <Row md={2} lg={3} xxl={4} className="mt-4">
          {filteredMovies.map(({ id, title, description }) => (
            <Col key={id} className="mb-4">
              <Movie title={title} description={description} id={id} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
