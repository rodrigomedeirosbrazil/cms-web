import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { getAuth } from './services/auth';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RecoveryPassword from './pages/RecoveryPassword';
import ChangePassword from './pages/ChangePassword';
import Main from './pages/Main';
import Customers from './pages/Customers';
import CustomerNew from './pages/CustomerNew';
import Customer from './pages/Customer';
import Items from './pages/Items';
import ItemNew from './pages/ItemNew';
import Item from './pages/Item';
import Orders from './pages/Orders';
import OrderNew from './pages/OrderNew';
import Order from './pages/Order';

const isAuthenticated = () => {
    const auth = getAuth();
    if (auth) return true;
    return false;
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route 
        { ...rest }
        render={props =>
            isAuthenticated() ? (
                <Component { ...props } />
            ) : (
                <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            )
        }
    />
)

export default function Routes () {
    return (
        <BrowserRouter>
            <Switch>
                <Route name="home" path="/" exact component={Home}/>
                <Route name="login" path="/login" exact component={Login}/>
                <Route name="signup" path="/signup" exact component={Signup} />
                <Route name="recovery_password" path="/recovery_password" exact component={RecoveryPassword} />
                <PrivateRoute name="change_password" path="/change_password" exact component={ChangePassword} />
                <PrivateRoute name="main" path="/main" exact component={Main}/>
                <PrivateRoute name="customers" path="/customers/:page?" component={Customers}/>
                <PrivateRoute name="customerNew" path="/customer/new" exact component={CustomerNew} />
                <PrivateRoute name="customer" path="/customer/:id" component={Customer}/>
                <PrivateRoute name="items" path="/items/:page?" component={Items} />
                <PrivateRoute name="itemNew" path="/item/new" exact component={ItemNew} />
                <PrivateRoute name="item" path="/item/:id" component={Item} />
                <PrivateRoute name="orders" path="/orders/:page?" component={Orders} />
                <PrivateRoute name="orderNew" path="/order/new" exact component={OrderNew} />
                <PrivateRoute name="order" path="/order/:id" component={Order} />
            </Switch>
        </BrowserRouter>
    )
}