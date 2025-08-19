import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Timetable from './pages/Timetable'
import ScheduleAllocation from './pages/ScheduleAllocation'
import Modules from './pages/Modules'
import SignIn from './pages/SignIn'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/timetable" element={<Timetable />} />
      <Route path="/scheduleallocation" element={<ScheduleAllocation />} />
      <Route path="/modules" element={<Modules />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  )
}

export default App