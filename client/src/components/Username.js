import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store';
import { authenticate } from '../helper/helper';

import styles from '../styles/Username.module.css';

export default function Username() {
  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername)

  const formik = useFormik({
    initialValues: {
      username: ''
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      try {
        // Show loading toast while validating user
        const loadingToastId = toast.loading('Validating user...');

        // Check if user exists
        const response = await authenticate(values.username);
        console.log("responsie in username =", response)
        // Dismiss the loading toast
        toast.dismiss(loadingToastId);


        if (response.status !== 200) {
          toast.error('User does not exist ..!');
        } else {
          // User exists, proceed with navigation
          setUsername(values.username);
          navigate('/password');
        }
      } catch (error) {
        // Handle other errors
        console.error('Error checking user existence:', error);
        toast.error('An error occurred while checking user existence.');
      }
    }
  });


  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello Again!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username' autoComplete='off' />
              <button className={styles.btn} type='submit'>Let's Go</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Not a Member <Link className='text-red-500' to="/register">Register Now</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
} 