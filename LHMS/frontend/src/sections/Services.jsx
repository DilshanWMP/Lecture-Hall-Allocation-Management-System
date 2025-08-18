import {service} from "../constants"
import ServiceCard from "../components/ServiceCard"

const Services = () => {
  return (
    <section className="max-container flex justify-center flex-wrap gap-9">
      {service.map((service) =>(
        <ServiceCard key={service.label} {...service}/>
      ))}
    </section>
  )
}

export default Services