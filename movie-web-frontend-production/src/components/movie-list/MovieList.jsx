import React from 'react'
import './movie-list.scss'
import { SwiperSlide,Swiper } from 'swiper/react'

import MovieCard from '../movie-card/MovieCard'
const MovieList = props => {
  return (
    <div className='movie-list'>
        <Swiper
            grabCursor={true}
            spaceBetween={10}
            slidesPerView={'auto'}
        
        >
            {
                props.content.map((item,i) => (
                    <SwiperSlide key={i}>
                        <MovieCard id = {item} />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    </div>
  )
}



export default MovieList
