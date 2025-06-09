// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SignOutUserSuccess, SignOutUserFailure /* Add SignOutUserStart if you have it */ } from '../redux/userSlice.js'; // Adjust path

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // dispatch(SignOutUserStart()); // Optional: if you have a loading state for signout
      const res = await fetch('/backend/auth/logout', { method: 'POST' /* or GET */ }); // Ensure method matches backend
      const data = await res.json();
      if (data.success === false) {
        dispatch(SignOutUserFailure(data.message || 'Sign out failed.')); // Dispatch failure
        // Optionally show an error toast/message to the user
        return;
      }
      dispatch(SignOutUserSuccess()); // This should clear currentUser in Redux
      navigate('/signin'); // Redirect to sign-in page after successful sign-out
    } catch (error) {
      dispatch(SignOutUserFailure(error.message || 'An error occurred during sign out.'));
    }
  };

  return (
    <header className="bg-surface text-text-primary shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20"> {/* Consistent height */}
          {/* Logo / Site Name */}
          <Link to={currentUser ? "/home" : "/"} className="flex items-center"> {/* Link to /home if logged in, / if not */}
            <h1 className="font-bold text-xl sm:text-2xl text-primary hover:opacity-80 transition-opacity">
              YourOJName {/* Replace with your actual logo or name */}
            </h1>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to={currentUser ? "/home" : "/"} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/problems/all" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
              Problems
            </Link>
            <Link to="/contests" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
              Contests
            </Link>
            {/* Add more links like Leaderboard, Discuss, etc. */}
          </nav>

          {/* Auth Links / User Profile */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {currentUser ? (
              <>
                {/* Optional: Create Problem Link for logged-in users */}
                <Link
                  to="/create-problem"
                  className="hidden sm:inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                  title="Contribute a Problem"
                >
                  {/* Replace with an icon if desired */}
                  New Problem +
                </Link>
                <div className="relative group">
                  <Link to="/profile" title="View Profile">
                    <img
                      src={currentUser.avatar}
                      alt="profile"
                      className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all"
                    />
                  </Link>
                  {/* Basic Dropdown for Sign Out - can be expanded */}
                  <div className="absolute right-0 mt-1 w-48 bg-surface rounded-md shadow-lg py-1 z-20 hidden group-hover:block ring-1 ring-border ring-opacity-5">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-text-secondary hover:bg-border hover:text-text-primary w-full text-left"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/submissions" // Link to user's submissions page
                      className="block px-4 py-2 text-sm text-text-secondary hover:bg-border hover:text-text-primary w-full text-left"
                    >
                      My Submissions
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-warning hover:bg-border hover:text-red-400"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-sm font-medium text-text-secondary hover:text-primary transition-colors px-4 py-2 rounded-md hover:bg-border"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          {/* Mobile Menu Button (placeholder - requires JS for toggle) */}
          {/* <div className="md:hidden">
            <button type="button" className="text-text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div> */}
        </div>
      </div>
    </header>
  );
}