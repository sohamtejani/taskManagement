import axios from 'axios';

const API = 'http://localhost:8083/user';


export const fetchUserData = async () => {
    
    try{
        const token = localStorage.getItem('token');
        if(!token){
            return {authenticated: false};
        }

        const response = await axios.get(API, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        
        return response.data;
        
    }catch(error){
        console.log(error);
        return {error: true, message: error};
    }
}