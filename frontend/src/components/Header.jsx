import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  // We get the user state to conditionally show the profile image or login button
  const currentUser = useSelector((state) => state.user.user);
  const isAdmin = currentUser?.role === 'admin';
  console.log(currentUser?.role);
  // We use the `useLocation` hook to know which page the user is currently on
  const location = useLocation();

  /**
   * A helper function to determine the correct styling for navigation links.
   * It checks if the link's path matches the current page's path.
   * @param {string} path - The path of the navigation link (e.g., '/', '/problems/all').
   * @returns {string} - The appropriate Tailwind CSS classes.
   */
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    // Return a different style if the link is for the currently active page
    return isActive 
      ? 'bg-white/10 text-white rounded-md px-3 py-2' // Active link style
      : 'text-gray-300 hover:bg-white/10 hover:text-white rounded-md px-3 py-2'; // Inactive link style
  };

  return (
    // 1. POSITIONING & THEME:
    // `sticky top-0 z-50` is the key. It scrolls with the page initially, then sticks to the top.
    // The background is always applied, creating our consistent "frosted glass" look.
    <header className="sticky top-0 z-50 w-full bg-black/30 backdrop-blur-xl text-white p-2 shadow-lg">
      
      {/* 2. LAYOUT & SPACING: */}
      {/* `max-w-7xl mx-auto` centers the content on large screens. */}
      {/* `flex justify-between items-center` creates the robust side-to-side layout. */}
      <nav className='flex justify-between items-center max-w-7xl mx-auto p-3'>
        
        {/* Logo */}
        <div>
          <Link to='/'>
            <h1 className='font-extrabold font-playwrite text-2xl sm:text-3xl flex flex-wrap text-purple-400 hover:text-purple-300 transition-colors'>
              OG-OJ
            </h1>
          </Link>
        </div>

        {/* 3. NAVIGATION LINKS (Desktop): */}
        {/* The `getLinkClass` function is used here to apply dynamic styles. */}
        {/* The links have been corrected to point to their proper routes. */}
        <div className="hidden sm:flex items-center gap-2">
          <ul className='font-sans font-semibold flex items-center gap-2 text-sm'>
            <li><Link to='/' className={getLinkClass('/')}>Home</Link></li>
            <li><Link to='/problems/all' className={getLinkClass('/problems/all')}>Problems</Link></li>
            <li><Link to='/contests' className={getLinkClass('/contests')}>Contests</Link></li>
            <li><Link to='/leaderboard' className={getLinkClass('/leaderboard')}>Leaderboard</Link></li>
            {isAdmin && <li><Link to='/admin-dashboard' className={getLinkClass('/admin-dashboard')}>Admin</Link></li>}
          </ul>
        </div>
        
        {/* 4. USER PROFILE / LOGIN BUTTON: */}
        {/* This section now renders a styled button for "Log In" for a clear call-to-action. */}
        <div>
          <Link to='/profile'>
            {currentUser ? (
              <img 
                src={`https://api.dicebear.com/8.x/identicon/svg?seed=${currentUser.username}`}
                alt='profile'  
                className="h-10 w-10 rounded-sm object-cover border-[0.75px] border-white hover:border-purple-500 transition-all"
              />
            ) : (
              <button className="font-semibold bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-500 transition-colors text-sm">
                Log In
              </button>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}