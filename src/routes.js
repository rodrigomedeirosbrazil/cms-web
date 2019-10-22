import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';
import Customers from './pages/Customers';
import CustomerRegister from './pages/CustomerRegister';


export default function Routes () {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/login" exact component={Login}/>
                <Route path="/signup" exact component={Signup}/>
                <Route path="/main" exact component={Main}/>
                <Route path="/customers" exact component={Customers}/>
                <Route path="/customerRegister" exact component={CustomerRegister}/>
            </Switch>
        </BrowserRouter>
    )
}