import React, { useContext, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import { Navigate } from 'react-router-dom';
import ajax from '../Services/fetchService';
import { useUser } from '../UserProvider';

const PrivateRoute = ({children}) => {
    const user = useUser();
  //  const [jwt,setJwt] = useLocalState("", "jwt")
    const [isLoading, setIsLoading] = useState(true);
    const [isValid,setIsValid] = useState(null);

    if(user){
        ajax(`/api/auth/validate?token=${user.jwt}`,"GET",user.jwt)
        .then((isValid) =>{
           setIsValid(isValid);
           setIsLoading(false);
            
        }); 
        
    }else{
       return  <Navigate to="/login"/>
    }

    return isLoading ? ( <div>Loading...</div>) : 
    isValid === true ? ( children ) :
    (<Navigate to="/login"/>);
     
};

export default PrivateRoute;