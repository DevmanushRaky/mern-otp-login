import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from "../store/store"
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from "react-router-dom"

import styles from '../styles/Username.module.css';

export default function Recovery() {
  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth)
  const [OTP, setOTP] = useState();

  useEffect(() => {
    const fetchOTP = async () => {
      try {
        const generatedOTP = await generateOTP(username);
        if (generatedOTP) return toast.success('OTP has been sent to your email');
        return toast.error('Problem while generating OTP');
      } catch (error) {
        
        return toast.error('Problem while generating OTP');
      }
    };

    fetchOTP();
  }, [username]);


  async function onSubmit(e) {
    e.preventDefault();
    try {
      let { status } = await verifyOTP(username, OTP);

      if (status === 201) {
        toast.success('Verify Successfully');
        navigate('/reset');
      } else {
        toast.error('Wrong OTP, please check your email again.');
      }
    } catch (error) {

      toast.error('An error occurred during OTP verification. Please try again.');
    }
  }

  //  handle function of resend otp 
  function resendOTP() {
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: "Sending OTP",
      success: <b>Email has been sent</b>,
      error: <b>Failed to Send Email</b>
    })
    sendPromise.then(OTP => {
      // console.log(OTP)
    })
  }


  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter OTP to recover password.
            </span>
          </div>

          <form className='pt-20' onSubmit={onSubmit}>

            <div className="textbox flex flex-col items-center gap-6">

              <div className="input text-center">
                <span className='py-4 text-sm text-left text-gray-500'>
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input onChange={(e) => setOTP(e.target.value)} className={styles.textbox} type="text" placeholder='OTP' />
              </div>

              <button className={styles.btn} type='submit'>Recover</button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className='text-gray-500'>Can't get OTP? <button className='text-red-500' onClick={resendOTP}>Resend</button></span>
          </div>

        </div>
      </div>
    </div>
  )
}