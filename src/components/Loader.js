"use client"
import Home from "@/app/home/page"
import { useState,useEffect } from "react"
import { Hourglass } from 'react-loader-spinner';

const Loader = () => {
  const [loader, setLoader] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
    setLoader(false);
    }, 2000)
    return ()=> clearTimeout(timer)
  }, [])
  
  return (
		<>
			{loader ? (
				<main className='loader'>
					<Hourglass
						visible={true}
						height='80'
						width='80'
						ariaLabel='hourglass-loading'
						wrapperStyle={{}}
						wrapperClass=''
						colors={['#fff']}
					/>

					<div className='text-white'>
						<p className='lg:text-4xl font-bold'>Loading</p>
						<small className='lg:text-lg '>Please be patient...</small>
					</div>
				</main>
			) : (
				<Home />
			)}
		</>
	);
}

export default Loader

