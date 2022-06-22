import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
// Styles
import './App.css'
// Components 
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/login/Login'
import Project from './pages/project/Project'
import Signup from './pages/signup/Signup'
import Create from './pages/create/Create'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar';

function App() {
  const {user, authIsReady } = useAuthContext()
  
  return (
    <div className="App">
      {authIsReady && 
      <BrowserRouter>
        {user && <Sidebar/>}
        <div className="container">
          <Navbar/>
          <Switch>
            <Route path='/' exact>
              {!user && <Redirect to='/login' />}
              {user && <Dashboard />}
            </Route>
            <Route path='/login'>
              {user && <Redirect to='/' />}
              {!user && <Login/> }
            </Route>
            <Route path='/signup'>
              {user && <Redirect to='/' />}
              {!user && <Signup/> }
            </Route>
            <Route path='/create'>
              {!user && <Redirect to='/login' />}
              {user && <Create/>}
            </Route>
            <Route path='/project/:id'>
              {!user && <Redirect to='/login' />}
              {user && <Project/> }
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
      }
    </div>
  );
}

export default App

/* 
  -dashboard (home)
  - login
  - signup
  - create
  - project (project Details)
*/
