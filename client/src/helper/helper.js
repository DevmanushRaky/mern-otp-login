import axios from "axios";
import { jwtDecode } from "jwt-decode";



axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


//  make api request 


//  to get username from local strogae token 
export async function getUsername() {
    const token = localStorage.getItem('token')
    if (!token) return Promise.reject(" can not find token ")
    let decode = jwtDecode(token)
    return decode
}

// authenticate function 
export async function authenticate(username) {
    try {
      
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
       
        return { error: " Username doesn't exist..!!" }
    }
}

// get user details
export async function getUser({ username }) {
    try {
        const data = await axios.get(`/api/user/${username}`);
        return data;
    } catch (error) {
        return { error: " Password does not matcch" }
    }
}

// register the user 
export async function registerUser(credentials) {
    try {
     

        const { data: { msg }, status } = await axios.post(`/api/register`, credentials);

    
        let { username, email } = credentials;

        if (status === 201) {
           await axios.post("/api/registerMail", {username,userEmail: email,text: msg,});  
        }

        return Promise.resolve(msg);
    } catch (error) {
      
        // Handle different HTTP status codes here
        if (error.response && error.response.status === 409) {
            // Conflict - Existing username or email
            return Promise.reject({ error: error.response.data.error });
        } else {
            // Other errors
            return Promise.reject({ error: "Could not register. Please try again later." });
        }
    }
}

// login function
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post('/api/login', { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error: " Password doesn't match " })
    }
}

// update user profile function 
export async function updateUser(response) {
    try {
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers: { "Authorization": `Bearer ${token}` } })

        return Promise.resolve({ data })
    } catch (error) {

        return Promise.reject({ error: " couldn't update profile  " })
    }
}

//  generate otp 
export async function generateOTP(username) {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });
        //  send mail with otp
        if (status === 201) {
            let { data: { email } } = await getUser({ username });
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recoverty OTP" })
        }
        return Promise.resolve(code);

    } catch (error) {
        return Promise.reject({ error })
    }
}



// verify OTP
export async function verifyOTP(username, code) {
    console.log(" username=", username  , " otp =",code)
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } })
       
        return { data, status }
    } catch (error) {
       
        return Promise.reject({ error })
    }
}


//  reset password 
export async function resetPassword({username, password}) {
    try {
        console.log("what coming user name =",username , "Password =", password )
        const { data, status } = await axios.put('/api/resetpassword', { username, password })
        console.log(" data in reset password =", data)
        console.log(" status in reset password =", status)
        return Promise.resolve({ data, status })
    } catch (error) {
        console.log( " error in reset password =", error)
        return Promise.reject({ error })
    }
}