import React from 'react'
import { useState, useEffect } from 'react'
import HeroSlide from '../components/hero-silde/HeroSlide'
import MovieList from '../components/movie-list/MovieList'
import axios from 'axios'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import ListRating from '../components/listRating/ListRating'
import MostView from '../components/mostView/MostView'

const Home = ({type}) => {
  const [lists, setLists] = useState([]); 
  useEffect(() => {
    const getRandomLists = async () => {
      try {
        const res = await axios.get(
          `http://${process.env.REACT_APP_GATEWAY_HOST}:${process.env.REACT_APP_GATEWAY_PORT}/service2/api/lists${type ? "?type=" + type : ""}`,
          {
            headers: {
              token: "Bearer "+JSON.parse(localStorage.getItem("user")).accessToken
            }
          }
        )
        setLists(res.data.result);
      } catch (err) {
        console.log(err);
      }
    };
    getRandomLists();
  }, [type]);
  return (
    <>
      <Header/>
      <HeroSlide/>
      <div className="container">
        <div className="section mb-3">
          <MostView/>
          <ListRating/>
          {
            lists.map((item , i) => (
             <>
                <div className='section__header mb-2'> 
                  <h2>{item.title}</h2>
                </div>
                <MovieList key={i} content ={item.content} />
             </>
            ))
          }
        </div>
      </div>
      <Footer/>
      
    </>
  )
}

export default Home
