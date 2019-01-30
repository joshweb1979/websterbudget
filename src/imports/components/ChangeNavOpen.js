import React from "react";
import { gql } from "apollo-boost";
import { graphql, compose } from "react-apollo";

const getNavOpen = gql`
  query {
    navOpen @client {
      isNavOpen
    }
  }
`;

const ChangeNavOpen = ({ mutate, data: { loading, navOpen } }) =>
  !loading ? (
    <button
      className="navbar-toggler"
      onClick={() =>
        mutate({
          variables: {
            isNavOpen: !navOpen.isNavOpen
          }
        })
      }
    >
      <span className="navbar-toggler-icon" />
    </button>
  ) : null;

const changeNavOpenMutation = gql`
  mutation($isNavOpen: Boolean) {
    updateNavOpen(isNavOpen: $isNavOpen) @client
  }
`;

export default compose(
  graphql(getNavOpen),
  graphql(changeNavOpenMutation)
)(ChangeNavOpen);
