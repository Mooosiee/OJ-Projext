import {Link} from 'react-router-dom';
export default function Header() {
  return (
    <header className="bg-surface text-text-primary ">
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <Link to= '/Home'>
          <h1 className = 'font-bold text-sm sm:text-xl flex flex-wrap'>Logo</h1>
          </Link>
          <ul className='flex gap-4'>
            <Link to= '/'>
            <li className="hidden sm:inline  hover:text-secondary">Home</li>
            </Link>
            <Link to='/problems'>
            <li className="hidden sm:inline  hover:text-secondary">Problems</li>
            </Link>
            <Link to='/login'>
            <li className=" hover:text-secondary">Log In</li>
            </Link>
            <Link to='/profile'>
            <li className="hidden sm:inline   hover:text-secondary">Profile</li>
            </Link>
          </ul>
          </div>
        
    </header>
  )
}

