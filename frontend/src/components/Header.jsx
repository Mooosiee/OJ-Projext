import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function Header() {
  const currentUser = useSelector((state) => state.user.user);
  console.log('Redux currentUser:', currentUser);
  return (
    <header className="bg-surface text-text-primary ">
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <Link to= '/home'>
          <h1 className = 'font-bold text-sm sm:text-xl flex flex-wrap'>Logo</h1>
          </Link>
          <ul className='flex gap-4'>
            <Link to= '/'>
            <li className="hidden sm:inline  hover:text-secondary">Home</li>
            </Link>
            <Link to='/problems/all'>
            <li className="hidden sm:inline  hover:text-secondary">Problems</li>
            </Link>
            <Link to='/profile'>
            {currentUser ? (
              <img src = {currentUser.avatar} alt='profile'  className="h-8 w-8 rounded-full object-cover"/>
            ) : (
            <li className=" hover:text-secondary">Log In</li>
            )}
            </Link>
            
          </ul>
          </div>
        
    </header>
  )
}

