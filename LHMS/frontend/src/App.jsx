import { AboutUs, Footer, Hero, Services } from "./sections";
import Nav from "./components/Nav";

const App = () => {
  return (
    <main className="relative">
      <Nav/>
      <section className='xl:padding-l wide:padding-r '>
        <Hero/>
      </section>
      
      <section className='padding'>
        <AboutUs/>
      </section>
      <section className='padding-x py-10'>
        <Services/>
      </section>
      <section className=' bg-black padding-x padding-t pb-8'>
        <Footer/>
      </section>
    </main>
  )
}

export default App