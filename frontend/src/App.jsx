import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import CreateProblem from './pages/CreateProblems.jsx';
import Login from './pages/Login';
import SignUp from './pages/SignUp.jsx';
import Profile from './pages/Profile';
import ProblemsPage from './pages/ProblemsPage.jsx';
// import ForgotPassword from './pages/ForgotPass.jsx';
import Header from './components/Header';
export default function App() {
  return <BrowserRouter>
  <Header/>
  <Routes>
    <Route path="/home" element = {<Home/>}/>
    <Route path="/login" element = {<Login/>}/>
    {/* <Route path="/forgot-password" element = {<ForgotPassword/>}/> */}
    <Route path="/signup" element = {<SignUp/>}/>
    <Route path="/profile" element = {<Profile/>}/>
    <Route path="/create-problem" element = {<CreateProblem/>}/>
    <Route path="/problems" element = {<ProblemsPage/>}/>
  </Routes>
  </BrowserRouter>;
}
