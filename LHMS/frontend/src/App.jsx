import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TimeTable from './pages/TimeTable'
import Modules from './pages/Modules'
import SignIn from './pages/SignIn'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/timetable" element={<TimeTable />} />
      <Route path="/modules" element={<Modules />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  )
}

export default App