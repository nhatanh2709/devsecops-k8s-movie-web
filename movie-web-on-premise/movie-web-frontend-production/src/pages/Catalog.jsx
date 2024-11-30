import React, { useState ,useEffect} from 'react'
import PageHeader from '../components/page-header/PageHeader';
import axios from 'axios';
import MovieGird from '../components/movie-gird/MovieGird';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { useParams } from 'react-router-dom';

const Catalog = () => {
  const {category} = useParams();
  const {type} = useParams();
  const isSeries = (category === "movies" ? false : true )
  const genre = (type !== "search") ? type : '';
  if(genre === "Genre") genre ='';
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const getRandomLists = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_GATEWAY_BACKEND_URL}/service2/api/movies/query${"?isSeries=" + isSeries}${genre ? "&genre=" + genre  : ""}`,
          {
            headers: {
              token: "Bearer "+JSON.parse(localStorage.getItem("user")).accessToken
            }
          }
        )
        setMovies(res.data.result);
      } catch (err) {
        console.log(err);
      }
    };
    getRandomLists();
  }, [type, isSeries]);
  return (
    <div>
      <Header/>
      <PageHeader type={category === "movies" ? "Movies" : "Series"}/>
      <div className='container'>
        <div className="section mb-3">
          <MovieGird movies={movies} />
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Catalog
