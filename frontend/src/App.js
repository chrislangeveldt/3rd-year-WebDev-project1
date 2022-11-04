import React from 'react';
import './App.css';
import DevReg from './Components/Dev_Registration'
import ComReg from './Components/Com_Registration'
import Login from './Components/Login'
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute';
import ContractPage from './Components/ContractPage';
import './Components/CSS/LoginCSS.css';
import ViewProfile from './Components/ViewProfile';
import EditDevProfile from './Components/Profile';
import AddContract from './Components/Other/AddContract';
import EditComProfile from './Components/EditComProfile';
import PreviewComProfile from './Components/PreviewComProfile';

function App() {
  return (
    <Router>
      <div>
        <Router>
          <Route exact path='/login' component={Login} />
          <Route exact path='/DevReg' component={DevReg} />
          <Route exact path='/ComReg' component={ComReg} />
          <Route exact path='/AddContract' component={AddContract} />
          <ProtectedRoute exact path='/EditComProfile' component={EditComProfile} />
          <ProtectedRoute exact path='/viewComProfile' component={PreviewComProfile} />
          <ProtectedRoute exact path='/ViewProfile' component={ViewProfile} />
          <ProtectedRoute exact path='/EditDevProfile' component={EditDevProfile} />
          <ProtectedRoute exact path='/' component={Home} />
          <ProtectedRoute exact path='/contracts' component={ContractPage} />
        </Router>
      </div>
    </Router>
  );
}

export default App;

