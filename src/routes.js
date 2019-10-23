import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';
import Customers from './pages/Customers';
import CustomerNew from './pages/CustomerNew';
import Customer from './pages/Customer';


export default function Routes () {
    return (
        <BrowserRouter>
            <Switch>
                <Route name="home" path="/" exact component={Home}/>
                <Route name="login" path="/login" exact component={Login}/>
                <Route name="signup" path="/signup" exact component={Signup}/>
                <Route name="main" path="/main" exact component={Main}/>
                <Route name="customers" path="/customers" exact component={Customers}/>
                <Route name="customerNew" path="/customer/new" exact component={CustomerNew}/>
                <Route name="customer" path="/customer/:id" component={Customer}/>
            </Switch>
        </BrowserRouter>
    )
}