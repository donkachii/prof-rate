'use client';
import { FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import { FcGraduationCap } from 'react-icons/fc';
import Link from 'next/link';


const Nav = () => {
	const [open, setOpen] = useState(false);

	function Modal() {
		setOpen(!open);
	}
	return (
		<header className='p-1 shadow-2xl bg-red-800'>
			<div className='flex justify-between items-center max-w-6xl mx-auto w-full flex-wrap'>
				<Link href='/'>
					<h1 className='navHead'>
						ProRate
						<span className='text-red-800'>
							<FcGraduationCap />
						</span>
						AI
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
						<Link href=''>
							<button className='loginBtn'>Sign In</button>
						</Link>
						<Link href=''>
							<button className='signupBtn'>Sign Up</button>
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Nav;
