import React from "react";
import { Switch, Route } from "react-router-dom";

// components
import AppNav from "../imports/components/AppNav";
// pages
import Dashboard from "../imports/pages/Dashboard";
import Account from "../imports/pages/Account";
import MakeTransaction from "../imports/pages/Account/MakeTransaction";
const Home = props => (
  <React.Fragment>
    <AppNav />
    <div className="container-fluid">
      <Switch>
        <Route path={`${props.match.path}/dashboard`} component={Dashboard} />
        <Route
          path={`${props.match.path}/account/:accountid`}
          component={Account}
        />
        <Route
          path={`${props.match.path}/maketransaction/:accountid`}
          component={MakeTransaction}
          {...props}
        />
      </Switch>
    </div>
  </React.Fragment>
);

export default Home;
