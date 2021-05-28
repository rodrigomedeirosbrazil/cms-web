import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { getAuth } from './services/auth';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const RecoveryPassword = lazy(() => import('./pages/RecoveryPassword'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const Main = lazy(() => import('./pages/Main'));
const Customers = lazy(() => import('./pages/Customers'));
const CustomerNew = lazy(() => import('./pages/CustomerNew'));
const Customer = lazy(() => import('./pages/Customer'));
const Items = lazy(() => import('./pages/Items'));
const ItemNew = lazy(() => import('./pages/ItemNew'));
const Item = lazy(() => import('./pages/Item'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderNew = lazy(() => import('./pages/OrderNew'));
const Order = lazy(() => import('./pages/Order'));

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
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route name="home" path="/" exact component={Home}/>
                    <Route name="login" path="/login" exact component={Login}/>
                    <Route name="signup" path="/signup" exact component={Signup} />
                    <Route name="recovery_password" path="/recovery_password" exact component={RecoveryPassword} />
                    <PrivateRoute name="profile" path="/profile" exact component={Profile} />
                    <PrivateRoute name="change_password" path="/change_password" exact component={ChangePassword} />
                    <PrivateRoute name="main" path="/main" exact component={Main}/>
                    <PrivateRoute name="customers" path="/customers" component={Customers}/>
                    <PrivateRoute name="customerNew" path="/customer/new" exact component={CustomerNew} />
                    <PrivateRoute name="customer" path="/customer/:id" component={Customer}/>
                    <PrivateRoute name="items" path="/items" component={Items} />
                    <PrivateRoute name="itemNew" path="/item/new" exact component={ItemNew} />
                    <PrivateRoute name="item" path="/item/:id" component={Item} />
                    <PrivateRoute name="orders" path="/orders" component={Orders} />
                    <PrivateRoute name="orderNew" path="/order/new" exact component={OrderNew} />
                    <PrivateRoute name="order" path="/order/:id" component={Order} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    )
}