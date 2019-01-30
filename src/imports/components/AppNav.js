import React, { Component } from "react";
import { Query, graphql, compose } from "react-apollo";

import { allAccounts, getUser } from "../queries";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { NavLink } from "react-router-dom";

class AppNav extends Component {
  state = {
    openNav: false
  };
  toggle = () => {
    this.setState({
      openNav: !this.state.openNav
    });
  };
  render() {
    //OTHER FIELDS AVAILABLE id, lastName, firstName,, isAdmin
    const {
      userInfo: { username }
    } = this.props;
    return (
      <Navbar color="dark" dark expand="md">
        <NavbarBrand>BMS</NavbarBrand>

        <NavbarToggler onClick={this.toggle} />
        <Collapse navbar isOpen={this.state.openNav}>
          <Nav className="ml-left" navbar>
            <NavItem>
              <NavLink className="nav-link" to="/home/dashboard">
                Home
              </NavLink>
            </NavItem>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Accounts
              </DropdownToggle>
              <DropdownMenu right>
                <Query query={allAccounts}>
                  {({ loading, error, data }) => {
                    if (loading) return <DropdownItem>Loading...</DropdownItem>;

                    if (error) {
                      return <DropdownItem>Error :(</DropdownItem>;
                    }

                    return data.allAccounts.map(s => (
                      <DropdownItem key={s.id}>
                        <NavLink to={`/home/account/ ${s.id}`}>
                          {s.accountName}
                        </NavLink>
                      </DropdownItem>
                    ));
                  }}
                </Query>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {username}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Loading...</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
export default compose(
  graphql(getUser, {
    props: ({ data: { userInfo } }) => ({
      userInfo
    })
  })
)(AppNav);
