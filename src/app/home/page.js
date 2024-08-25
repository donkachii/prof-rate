import Button from "@/components/Button";
import Nav from "@/components/Nav"
import Link from "next/link";


const page = () => {
  return (
		<div>
			<Nav />
			<main className='cover'>
				<div className='flex justify-center items-center pt-40'>
					<div className='glass'>
						<div className='text-center text-white'>
							<h2 className='title'>ProRate AI - Smart Professional Ratings & Reviews</h2>
							<p className='description'>
								{' '}
								Discover how ProRate AI uses advanced Retrieval-Augmented
								Generation (RAG) technology to provide insightful, AI-driven
								professional ratings and reviews.
              </p>
              <Link href='/signup'>
                <Button value="Get Stated" className="btnHero" />
              </Link>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default page

