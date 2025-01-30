import axios from 'axios';
import { decodeError } from './DecodeError';

const API = 'http://localhost:8083/user';

export const loginUser = async (username, password) => {
    
    try{
        const credentials = `${username}:${password}`;
        const base64Credentials = btoa(credentials);

        const config = {
            headers: {
              'Authorization': `Basic ${base64Credentials}`, 
              'Content-Type': 'application/json', 
            },
        };
        const bodyData = { username, password };

       const response = await axios.post(`${API}/login`, bodyData, config);

        console.log(response);
        
        return response.data;
        
    }catch(error){
        console.log("Error during login: ", error);
        const message = decodeError(error);
        return {error: true, message: message};
    }
    
}