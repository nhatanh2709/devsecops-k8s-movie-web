import React from 'react'
import { useEffect, useState } from 'react'
import Rating from '../rating/Rating'
import { Link, useParams } from 'react-router-dom'
import './detail.scss'
import Video from './VideoList'
import axios from 'axios'
import Recommender from './Recommender'
import ListComment from '../../components/listComment/ListComment'
import PostComment from '../postComment/PostComment'
import { useContext } from 'react'
import { AuthContext } from '../authContext/AuthContext'

const Detail = () => {
  const { Slug } = useParams();
  const {user} = useContext(AuthContext);
  const [movie, setMovie] = useState();
  const [upView, setUpView] = useState();
  const [comment, setComment] = useState([]);
  const [id, setId] = useState();
  const [isWatch, setIsWatch] = useState(false);
  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_GATEWAY_BACKEND_URL}/service2/api/movies/findName/` + Slug, {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
          }
        });
        setMovie(res.data.result);
        
        setUpView({ ...res.data.result, View: res.data.result.View + 1 });
        setId(res.data.result._id);
      }
      catch (err) {
        console.log(err)
      }
    }
    getMovie();
  }, [Slug]);

  useEffect(() => {
    const getComment = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_GATEWAY_BACKEND_URL}/service2/api/movies/interactive/get/` + id, {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
          }
        })
        setComment(res.data.result);
      } catch (err) {
        console.log(err)
      }
    }
    if(id !== undefined) {
      getComment();
    }
  }, [id]);

  useEffect(() => {
    const getWatch = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_GATEWAY_BACKEND_URL}/service1/api/users/info/` + user.email,{
            MovieID : id
          },  {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
          }
        })
        setIsWatch(res.data.result);

      } catch(err) {
        console.log(err);
      }
    }
    if(user!== undefined && id !== undefined ) {
      getWatch();
    }
  },[user, id]) 

  useEffect(() => {
    
    const updateView = async () => {
      try {
        await axios.put(
          `${process.env.REACT_APP_GATEWAY_BACKEND_URL}/service2/api/movies/` + id,
          upView,
          {
            headers: {
              token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
    if(id !== undefined) {
      updateView();
    }
  }, [upView, id])

  return (
    <div>
      {
        (
          <>
            <div className="banner" style={{ backgroundImage: `url(${movie?.img})` }}></div>
            <div className="mb-3 movie-content container">
              <div className="movie-content__poster">
                <div className="movie-content__poster__img" style={{ backgroundImage: `url(${movie?.img})` }}></div>
              </div>
              <div className="movie-content__info">
                <h1 className='title'>
                  {movie?.title}
                </h1>
                <div className='genres'>
                  {
                    movie?.genre
                  }
                </div>
                <p className='overview'>{movie?.desc}</p>
                <h1 className='overview'>Views: {movie?.View}</h1>
                <Rating id={id} />
              </div>
            </div>

            <div className='container'>
              <div className='section mb-3'>
                <Video link={movie?.trailer} name={"Trailer"} />

              </div>
              <div className='section mb-3'>
                <>
                  {
                    isWatch === true && <Video link={movie?.video} name={"Video"} />
                  } 
                  {
                    isWatch === false && 
                    <>
                      <h1 className='overview'>
                        To access this movie You must buy a  
                        <Link to={'/buyPackage'} className='highlight'>
                          Package
                        </Link>
                      </h1>
                    </>
                  }
                </>
                {
                  comment.length !== 0 && (
                    <h2>New Comment</h2>
                  )
                }
                {
                  comment.length !== 0 && comment.map((item) => (
                    <ListComment data={item} />
                  ))
                }
              </div>

              <div className='section mb-3'>
                <h2>Comment</h2>
                <PostComment id={id} />
              </div>

              <div className='section mb-3'>
                <div className='section__header mb-2'>
                  <h2>Recommend Movies</h2>

                </div>
                <Recommender title={movie?.title} />
              </div>
            </div>
          </>

        )
      }
    </div>
  )
}

export default Detail
