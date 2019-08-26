import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';


export default function Routes () {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Home}/>
            <Route path="/login" exact component={Login}/>
            <Route path="/signup" exact component={Signup}/>
            <Route path="/main" exact component={Main}/>
        </BrowserRouter>
    )
}