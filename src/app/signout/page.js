import Button from '@/components/Button'
import { auth, signOut } from 'firebase/auth'

 

const handleSignOut = async () => {
  try {
    await signOut(auth)
    alert('user signed out successfully')
  } catch (err) {
    console.error(err)
  }

}

const page = () => {
  return (
    <div>
      <Button value='signOut' onClick={handleSignOut} className='bg-red-500 text-white'/>
    </div>
  )
}

export default page
