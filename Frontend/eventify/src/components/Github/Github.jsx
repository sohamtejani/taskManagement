import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

const  Github = () => {
    // const [data, setData] = useState([]);
    // useEffect(() => {
    //     fetch('https://api.github.com/users/sohamtejani')
    //     .then(reponse => reponse.json())
    //     .then( data => {
    //         console.log(data);
    //         setData(data);
    //     })
    // }, [])

    const data = useLoaderData();

  return (
    <div className='text-center m-4 bg-gray-600 text-white p-4 text-5xl'>Github followers: {data?.followers}</div>
  )
}

export default  Github;

export const githubInfoLoader = async() => {
    const response = await fetch("https://api.github.com/users/sohamtejani");
    return response.json();
}