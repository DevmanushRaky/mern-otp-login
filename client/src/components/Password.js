import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate'
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'
import styles from '../styles/Username.module.css';

export default function Password() {

  const navigate = useNavigate()
  const { username } = useAuthStore(state => state.auth)


  const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`);


  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      // Show loading toast while checking password
      const loadingToastId = toast.loading('Checking password...');

      let loginPromise = verifyPassword({ username, password: values.password });

      loginPromise
        .then((res) => {
          console.log("response after checking password =", res);
          // Dismiss the loading toast
          toast.dismiss(loadingToastId);

          // Check if res.data exists and has a token property
          console.log("checking if condition =", res.data && res.data.token);
          if (res.data && res.data.token) {
            let { token } = res.data;
            localStorage.setItem('token', token);
            navigate('/profile');
            toast.success(<b>Login Successfully...!</b>);
          } else {
            // Handle the case where the response doesn't have the expected structure
            console.error("An error occurred during login: Invalid response format", res);
            toast.error(res.error || "An error occurred during login");
          }
        })
        .catch((error) => {
          console.error("An error occurred during login:", error);
          toast.error(error && error.error ? error.error : "An error occurred during login");
        });


    }
  })

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password' autoComplete='off' />
              <button className={styles.btn} type='submit'>Sign In</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to="/recovery">Recover Now</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}