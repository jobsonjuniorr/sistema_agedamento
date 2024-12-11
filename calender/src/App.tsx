import CalendarStructure from './app/calender/page.tsx'
import { HomePage } from './app/homepage/page.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './app/login/page.tsx';
import Cadastro from './app/register/page.tsx';
import PrivateRoute from './app/privateroute.tsx';
import Graphic from './app/graphic/page.tsx';
function App() {
  return (
  <Router>
   
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/calender' element={<PrivateRoute><CalendarStructure/></PrivateRoute>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Cadastro/>}/>
      <Route path='/graphic' element={<Graphic/>}/>
    </Routes>
  </Router>
  )
}

export default App
