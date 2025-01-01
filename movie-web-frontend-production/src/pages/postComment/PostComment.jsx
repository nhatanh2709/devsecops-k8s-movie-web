import React, { useState } from 'react'
import logo2 from '../../assets/png2.png'
import './postComment.scss'
import { useContext } from 'react'
import { AuthContext } from '../authContext/AuthContext'
import axios from 'axios'
const PostComment = props => {
    const { user } = useContext(AuthContext);
    const [comment, setComment] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await axios.post(
                `${process.env.REACT_APP_GATEWAY_BACKEND_URL}/service2/api/movies/interactive/post/` + props.id,
                {
                    email: user.email,
                    comment : comment,
                },
                {
                    headers: {
                        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
                    }
                }
            )
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='body'>
            <div className='comment-session'>
                <div className='comment-box'>
                    <div className='user'>
                        <div className='image'><img src={logo2} alt='image' /></div>
                        <div className='name'>{user?.username}</div>
                    </div>
                    <form action="" method='post'>
                        <textarea name='comment'
                            id='comment'
                            placeholder='Your Message'
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <button className='comment-submit' onClick={handleSubmit}>Comment</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostComment
