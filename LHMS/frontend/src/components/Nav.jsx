import { useState, useEffect } from 'react';
import Logo from '../assets/images/logo.png';
import Hamburger from '../assets/icons/Hamburger.png';
import { navLinks } from '../constants';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount and when storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsLoggedIn(!!token);
      setIsAdmin(adminStatus);
    };

    // Check initially
    checkAuthStatus();

    // Listen for storage changes (for when login/logout happens in other components)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check on focus in case another tab changed auth state
    window.addEventListener('focus', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkAuthStatus);
    };
  }, []);

  const handleSignOut = () => {
    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    
    // Update state
    setIsLoggedIn(false);
    setIsAdmin(false);
    
    // Redirect to home page
    navigate('/');
    window.location.reload(); // Refresh to update the UI
  };

  // Filter nav links based on authentication
  const getFilteredNavLinks = () => {
    return navLinks.filter(link => {
      // If user is logged in, show all links except Sign In
      if (isLoggedIn && link.lable === 'Sign in / Explore more') {
        return false;
      }
      // If user is not logged in, show all links
      return true;
    });
  };

  return (
    <header className='padding-x py-8 absolute z-10 w-full bg-primary'>
      <nav className='flex justify-between items-center max-container'>
        <Link to="/">
          <img src={Logo} alt="Logo" width={250} />
        </Link>

        <ul className='flex-1 flex justify-evenly items-center gap-16 max-lg:hidden'>
          {getFilteredNavLinks().map((link) => (
            <li key={link.href} className='font-montserrat leading-normal text-2xl text-neutral'>
              <Link to={link.href.replace('#', '')}>{link.lable}</Link>
            </li>
          ))}
          
          {/* Show Sign Out button if logged in */}
          {isLoggedIn && (
            <li className='font-montserrat leading-normal text-2xl text-neutral'>
              <button 
                onClick={handleSignOut}
                className='hover:text-coral-red transition-colors duration-200 cursor-pointer'
              >
                Sign Out
              </button>
            </li>
          )}

          
        </ul>

        <div className='hidden max-lg:block max-lg:cursor-pointer'>
          <img src={Hamburger} alt="Hamburger" width={25} height={25}/>
        </div>
      </nav>
    </header>
  );
};

export default Nav;