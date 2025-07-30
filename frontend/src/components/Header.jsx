import {Link, useLocation} from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function Header() {
  const currentUser = useSelector((state) => state.user.user);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  console.log('Redux currentUser:', currentUser);
  return (
    <header className={`w-full text-black px-2 ${isHomePage?'absolute ' :''}`}>
        <nav className='flex justify-between mx-auto p-2 mt-2 '>
          <div>
            <Link to= '/'>
            <h1 className = 'font-extrabold font-playwrite text-xl sm:text-3xl flex flex-wrap hover:text-white transition-colors'>OG-OJ</h1>
            </Link>
          </div>
          <div>
            <ul className='font-sans font-bold flex gap-4'>
              <Link to= '/'>
              <li className = "hidden sm:inline-block hover:underline hover:underline-offset-4 hover:text-white transition-colors">Home</li>
              </Link>
              <Link to='/problems/all'>
              <li className="hidden sm:inline hover:underline hover:underline-offset-4 hover:text-white transition-colors">Problems</li>
              </Link>
              <Link to='/profile'>
              {currentUser ? (
                <img src = {currentUser.avatar} alt='profile'  className="h-8 w-8 rounded-full object-cover"/>
              ) : (
              <li className="hover:underline hover:underline-offset-4 hover:text-white transition-colors">Log In</li>
              )}
              </Link>
            
            </ul>
          </div>
          </nav>
        
    </header>
  )
}

