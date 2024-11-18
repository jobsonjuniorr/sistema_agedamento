import CalendarStructure from './app/calender/page.tsx'
import Page from './app/teste/page.tsx'
import { HomePage } from './app/homepage/page.tsx';
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';
import Login from './app/login/page.tsx';
import Cadastro from './app/register/page.tsx';
function App() {
  return (
  <Router>
     <nav>
        <Link to="/calender">Calender</Link>
        <Link to="/teste">Teste</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Cadastro</Link>
      </nav>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/calender' element={<CalendarStructure/>}/>
      <Route path='/teste' element={<Page/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Cadastro/>}/>

    </Routes>
  </Router>
  )
}

export default App
