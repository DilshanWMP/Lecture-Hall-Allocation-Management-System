import Button from "../components/Button"
import lectureHall from "../assets/images/lectureHall.jpg"

const AboutUs = () => {
  return (
    <section id="about-us" className="flex justify-center items-center max-lg:flex-col gap-10 w-full max-container ">
      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-[570px] h-[380px]">
          <img src={lectureHall} width={570} height={380} className="rounded-3xl"/>"
          <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,rgba(31,41,55,0.4)_20%,rgba(29,78,216,0.4)_80%)]"></div>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col">
        <h2 className="font-palanquin text-4xl capitalize font-bold lg:max-w-lg">
            About LHMS
        </h2>
        <h3 className="font-palanquin text-3xl capitalize font-medium lg:max-w-lg">
          Smart Scheduling, Better Learning
        </h3>
        <p className="mt-4 lg:max-w-lg info-text">LHMS (Lecture-Hall-Allocation-Management-System) is a comprehensive platform developed to simplify and streamline the process of allocating lecture halls in Faculty of Engineering University of Ruhuna.</p>
        <div className="mt-11">
          <Button label="Read More"  />
        </div>    
      </div>

      
    </section>
  )
}

export default AboutUs