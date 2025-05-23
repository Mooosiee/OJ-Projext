import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Problems from './pages/Problems';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path="/" element = {<Home/>}/>
    <Route path="/problems" element = {<Problems/>}/>
    <Route path="/login" element = {<Login/>}/>
    <Route path="/register" element = {<Register/>}/>
    <Route path="/profile" element = {<Profile/>}/>
  </Routes>
  </BrowserRouter>;
}
