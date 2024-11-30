import React from 'react'
import './profile.scss'
import Header from '../../components/header/Header'
import { useState, useEffect, useContext } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from '../../components/firebase';
import axios from 'axios';
import Toastify from 'toastify-js';
import { AuthContext } from '../authContext/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import { logout } from '../authContext/apiCalls';
const ImgUrl = 'https://bootdey.com/img/Content/avatar/avatar1.png'

const Profile = () => {
  const [profilePic, setprofilePic] = useState(null);
  const [uploadProfile, setUploadProfile] = useState(false);
  const [imgPicture, setImgPicture] = useState('');
  const [userName, setUserName] = useState(null);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [age, setAge] = useState(null);
  const [city, setCity] = useState(null);
  const [info, setInfo] = useState([]);
  const [oldInfo, setOldInfo] = useState([]);
  const { user } = useContext(AuthContext);
  const {dispatch} = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const getInfo = async () => {
      const res = await axios.get(`${process.env.REACT_APP_GATEWAY_BACKEND_URL}/service1/api/users/find/${user.email}`, {
        headers: {
          token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
        }
      });
      console.log(res.data);
      setOldInfo(res.data.result);
    }
    getInfo();
  },[user])
  useEffect(() => {
    const setInfo =  () => {
        if( userName === null) setUserName(oldInfo.username);   
        if( age === null) setAge(oldInfo.age);
        if( city === null) setCity(oldInfo.city);
        
    }
    if(oldInfo.length !== 0 ) {
      setInfo();
      
      
    }
  },[oldInfo])
  useEffect(() => {
    const getImgPicture = async () => {
      if(imgPicture === '') {
        
        if(oldInfo.profilePic === undefined) {
          setImgPicture(ImgUrl);
        }
        else setImgPicture(oldInfo.profilePic);
      }
    }
    if(oldInfo.length !== 0) {
        getImgPicture();
    }
  }, [imgPicture, oldInfo])

  const upload = async (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const storageRef = ref(storage, `/items/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, item.file);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setInfo((prev) => {
              return { ...prev, [item.label]: url };
            });
            setUploadProfile(true);   
          });
        });
    });
  };
  
  const upProfile = async () => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_GATEWAY_BACKEND_URL}/service1/api/users/change/${user.email}`, info , {
        headers: {
          token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
        }
      });
      Toastify({
        text: 'Thay đổi thông tin thành công',
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          display : "flex",
          justifyContent: "center",  // Căn giữa theo chiều ngang
          alignItems: "center",
        },
        
      
      }).showToast();
    } catch (err) {
      console.log(err);
    }
  }
  const handleUpload = (e) => {
    e.preventDefault();

  
    setInfo({ username: userName });
    setInfo((prev) => {
      return { ...prev, age: age };
    })
    setInfo((prev) => {
      return { ...prev, city: city };
    })

    if(newPass !== null) {
      if(newPass !== confirmPass) {
        Toastify({
          text: 'Mật khẩu nhập lại không đúng mời nhập lại',
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            display : "flex",
            justifyContent: "center",  // Căn giữa theo chiều ngang
            alignItems: "center",
          },        
        }).showToast();
        return ;
      }
      setInfo((prev) => {
        return { ...prev, password: newPass };
      })
    }
    
    if(profilePic !== null) {
      upload([
        { file: profilePic, label: "profilePic" },
      ]);
    }
    else setUploadProfile(true);
    
  }
  const handleLogout = (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("user");
      logout(dispatch);
      Toastify({
      text: 'Đăng xuất thành công',
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        display : "flex",
        justifyContent: "center",  // Căn giữa theo chiều ngang
        alignItems: "center",
      },
    }).showToast();
    } catch(err) {
      
    }
    navigate('/login');
  }
  useEffect(() => {
    if (uploadProfile === true) {
      upProfile();
      setUploadProfile(false);
    }
  }, [uploadProfile])
  return (
    <>
      <Header />
      <div className='button-container'>
      <button className='new-button' onClick={handleLogout}>Logout</button>
      </div>
      <div className='desgin-form'>
        <div className='form-container'>
          <form action='' id="profileForm" className='form-desgin'>
            <div className='column-left'>
              <label for="name" className='desgin-label'>User Name</label>
              <input type='text'
                name='name'
                placeholder='Enter user name'
                className='desgin-input' 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              ></input>

              <label for="new-pass" className='desgin-label'>New Password</label>
              <input type='text'
                name='newPass'
                className='desgin-input'
                placeholder='Enter new password'
                onChange={(e) => setNewPass(e.target.value)}
              ></input>

              <label for="confirm-pass" className='desgin-label'>Confirm Password</label>
              <input type='text'
                name='confirm-pass'
                className='desgin-input'
                placeholder='Confirm new password'
                onChange={(e) => setConfirmPass(e.target.value)}
              ></input>

              <label for="age" className='desgin-label'>Age</label>
              <input type='text'
                name='age'
                className='desgin-input'
                placeholder='Enter the age'
                value={age}
                onChange={(e) => setAge(e.target.value)}
              ></input>

              <label for="city" className='desgin-label'>City</label>
              <input type='text'
                name='city'
                className='desgin-input'
                placeholder='Enter the city'
                value={city}
                onChange={(e) => setCity(e.target.value)}></input>
              <button type='button' className='desgin-button' onClick={handleUpload}>Submit</button>
            </div>

            <div className='column-right'>
              <label for="photo" className='desgin-label'>Profile Picture</label>
              <input type='file'
                id='profilePic'
                className='desgin-input'
                onChange={(e) => {
                  setUploadProfile(false)
                  setImgPicture(URL.createObjectURL(e.target.files[0]))
                  setprofilePic(e.target.files[0])
                }}
              ></input>
              <img src={imgPicture} alt='Profile' className='desgin-img'></img>
            </div>


          </form>
        </div>
      </div>
      <Footer/>
    </>

  )
}

export default Profile
