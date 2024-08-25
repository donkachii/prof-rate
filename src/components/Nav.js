'use client';
import { FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import { PiPulseLight } from 'react-icons/pi';
import Link from 'next/link';


const Nav = () => {
	const [open, setOpen] = useState(false);

	function Modal() {
		setOpen(!open);
	}
	return (
		<header className='p-1 shadow-2xl bg-green-500'>
			<div className='flex justify-between items-center xl:max-7xl xl:mx-auto py-5 px-[8%] w-full flex-wrap'>
				<Link href='/'>
					<h1 className='navHead'>
						Life
						<span className='text-red-800'>
							<PiPulseLight />
						</span>
						Gen
					</h1>
				</Link>
				<FiMenu
					className='block w-6 h-6 text-white cursor-pointer lg:hidden'
					onClick={Modal}
				/>
				<nav
					className={`lg:flex lg:justify-betweenlg:items-center lg:w-auto w-full ${
						open ? 'block' : 'hidden'
					}`}>
					<div>
						<Link href='/sign-in'>
							<button className='loginBtn'>
								Sign In
							</button>
						</Link>
						<Link href='sign-up'>
							<button className='signupBtn'>
								Sign Up
							</button>
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Nav;
