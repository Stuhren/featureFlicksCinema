import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Screenings from "./pages/Screenings";
import MovieDetails from "./pages/MovieDetails";
import DisplaySeats from "./pages/DisplaySeats";


export default function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="screenings" element={<Screenings />} />
      <Route path="home" element={<Home />} />
      <Route path="movies/:id" element={<MovieDetails />} />
      <Route path="booking/:screeningId" element={<DisplaySeats />} />
      <Route path="*" element={<NoPage />} />
      </Route>
   </Routes>
   </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);