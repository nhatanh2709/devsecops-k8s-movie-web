import React from 'react'
import './mostView.scss'
import { SwiperSlide, Swiper } from 'swiper/react'
import MovieCard from '../movie-card/MovieCard'
import { useState, useEffect } from 'react'
import axios from 'axios'
const MostView = () => {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        const getMovie = async () => {
            try {
                const res = await axios.get(`http://${process.env.REACT_APP_GATEWAY_HOST}:${process.env.REACT_APP_GATEWAY_PORT}/service2/api/movies/view/mostView`, {
                    headers: {
                        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
                    }
                });
                setMovies(res.data.result);
            } catch (err) {
                console.log(err)
            }
        }
        getMovie();
    }, [])

    return (
        <>
        <div className='section__header mb-2'>
            <h2>Most View</h2>
        </div>
        <div className='movie-list'>
            <Swiper
                grabCursor={true}
                spaceBetween={10}
                slidesPerView={'auto'}
            >
                {
                    movies.map((item, i) => (
                        <SwiperSlide key={i}>
                            <MovieCard id={item._id} />
                        </SwiperSlide>
                    ))
                }

            </Swiper>
        </div>
        
        </>
    )
}

export default MostView
