import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Problems from './pages/Problems';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
export default function App() {
  return <BrowserRouter>
  <Header/>
  <Routes>
    <Route path="/" element = {<Home/>}/>
    <Route path="/problems" element = {<Problems/>}/>
    <Route path="/login" element = {<Login/>}/>
    <Route path="/signup" element = {<SignUp/>}/>
    <Route path="/profile" element = {<Profile/>}/>
  </Routes>
  </BrowserRouter>;
}
