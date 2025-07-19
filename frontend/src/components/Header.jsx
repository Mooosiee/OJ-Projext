import {Link, useLocation} from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function Header() {
  const currentUser = useSelector((state) => state.user.user);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  console.log('Redux currentUser:', currentUser);
  return (
    <header className={`w-full text-white ${isHomePage?'absolute ' :''}`}>
        <nav className='flex justify-between mx-auto p-2 mt-2'>
          <div>
            <Link to= '/'>
            <h1 className = 'font-bold font-palanquin text-xl sm:text-3xl flex flex-wrap hover:text-primary'>OG-OJ</h1>
            </Link>
          </div>
          <div>
            <ul className='font-montserrat font-bold flex gap-4'>
              <Link to= '/'>
              <li className=" font-montserrat font-bold hidden sm:inline-block hover:underline hover:underline-offset-4">Home</li>
              </Link>
              <Link to='/problems/all'>
              <li className="font-montserrat font-bold hidden sm:inline hover:underline hover:underline-offset-4">Problems</li>
              </Link>
              <Link to='/profile'>
              {currentUser ? (
                <img src = {currentUser.avatar} alt='profile'  className="h-8 w-8 rounded-full object-cover"/>
              ) : (
              <li className="font-montserrat font-bold  hover:underline hover:underline-offset-4">Log In</li>
              )}
              </Link>
            
            </ul>
          </div>
          </nav>
        
    </header>
  )
}

