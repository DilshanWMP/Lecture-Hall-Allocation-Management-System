import Logo from '../assets/images/logo.png';
import Hamburger from '../assets/icons/Hamburger.png';
import { navLinks } from '../constants';

const Nav = () => {
  return (
    <header className='padding-x py-8 absolute z-10 w-full bg-primary'>
        <nav  className='flex justify-between items-center max-container'>
            <a href="/">
                <img src={Logo} alt="Logo" 
                  width={250}
                />
            </a>

            <ul className='flex-1 flex justify-center items-center gap-16 max-lg:hidden'>
              {navLinks.map((link) => (
                <li key={link.href} className='font-montserrat
                  leading-normal 
                  text-lg 
                  text-neutral'>
                  <a href={link.href}>{link.lable}</a>
                </li>
              ))}
            </ul>

            <div className='hidden max-lg:block max-lg:cursor-pointer'>
              <img src={Hamburger} alt="Hamburger" width={25} height={25}/>
            </div>
        </nav>
    </header>
  )
}

export default Nav