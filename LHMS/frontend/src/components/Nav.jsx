import { useState, useEffect } from 'react';
import Logo from '../assets/images/logo.png';
import Hamburger from '../assets/icons/Hamburger.png';
import { navLinks } from '../constants';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsLoggedIn(!!token);
      setIsAdmin(adminStatus);
    };

   
    checkAuthStatus();

   
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
  
    window.addEventListener('focus', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkAuthStatus);
    };
  }, []);

  const handleSignOut = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    
   
    setIsLoggedIn(false);
    setIsAdmin(false);
    
   
    navigate('/');
    window.location.reload(); 
  };

  
  const getFilteredNavLinks = () => {
    return navLinks.filter(link => {
    
      if (isLoggedIn && link.lable === 'Sign in / Explore more') {
        return false;
      }
     
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