import Logo from '../assets/logo.png';

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
              <li className='font-montserrat leading-normal text-lg text-neutral'>Home</li>
              <li className='font-montserrat leading-normal text-lg text-white'>Time Table</li>
              <li className='font-montserrat leading-normal text-lg text-white'>Schedule Allocation</li>
              <li className='font-montserrat leading-normal text-lg text-white'>Modules</li>
              <li className='font-montserrat leading-normal text-lg text-white'>Sign in / Explore more</li>
            </ul>
        </nav>
    </header>
  )
}

export default Nav