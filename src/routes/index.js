//import React from "react";
import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import decode from "jwt-decode";
import { graphql, compose } from "react-apollo";
// pages
import Login from "./Login";
import Home from "./Home";
import Main from "./Main";
// graphql
import { getUser, updateUserInfo } from "../imports/queries";
// icons
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faSquare,
  faCoffee,
  faBell,
  faBellSlash,
  faCaretDown,
  faCaretUp,
  faCaretRight,
  faCaretLeft,
  faCashRegister,
  faCalendarDay,
  faChartPie,
  faCheck,
  faClock,
  faClipboard,
  faCog,
  faDollarSign,
  faDonate,
  faDownload,
  faEdit,
  faEnvelope,
  faHashtag,
  faPlus,
  faMinus,
  faMoneyCheck,
  faPlusCircle,
  faPiggyBank,
  faStore,
  faSave,
  faSearch,
  faTimes,
  faThumbsUp,
  faThumbsDown,
  faTrashAlt,
  faTv,
  faUser
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faCheckSquare,
  faSquare,
  faCoffee,
  faBell,
  faBellSlash,
  faCalendarDay,
  faCaretDown,
  faCaretUp,
  faCaretRight,
  faCaretLeft,
  faCashRegister,
  faChartPie,
  faCheck,
  faClock,
  faClipboard,
  faCog,
  faDollarSign,
  faDonate,
  faDownload,
  faEdit,
  faEnvelope,
  faHashtag,
  faPlus,
  faMinus,
  faMoneyCheck,
  faPlusCircle,
  faPiggyBank,
  faSave,
  faSearch,
  faStore,
  faTimes,
  faThumbsUp,
  faThumbsDown,
  faTrashAlt,
  faTv,
  faUser
);
class mainroute extends Component {
  render() {
    const props = this.props;

    const isLoggedIn = () => {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      try {
        decode(token);
        const { exp } = decode(refreshToken);
        const usr = decode(token);
        var current_time = Date.now() / 1000;
        if (current_time > exp) {
          return false;
        }
        props.updateUser({
          variables: {
            user: usr.user
          }
        });
        return true;
      } catch (err) {
        return false;
      }
    };

    const PrivateRoute = ({ component: Component, ...rest }) => (
      // is logged in but normal user nothing special

      <Route
        {...rest}
        render={props =>
          isLoggedIn(props) ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login"
              }}
            />
          )
        }
      />
    );

    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Main} />
          <PrivateRoute path="/home" component={Home} {...props} />
          <Route path="/login" exact component={Login} />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default compose(
  graphql(updateUserInfo, { name: "updateUser" }),
  graphql(getUser, {
    props: ({ data: { userInfo } }) => ({
      userInfo
    })
  })
)(mainroute);
