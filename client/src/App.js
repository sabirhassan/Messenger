import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom'

import Login from './components/login/login'
import Signup from './components/signup/signup'
import Dashboard from './components/dashboard/dashboard'

class App extends Component {
  render() {
    return (
      <BrowserRouter>

          <Switch>
            <Route exact path='/' component={Login}/>
            <Route path='/login' component={Login}/>
            <Route path='/signup' component={Signup}/>
            <Route path='/dashboard' component={Dashboard}/>


          </Switch>
      </BrowserRouter>
    );
  }
}

export default App;