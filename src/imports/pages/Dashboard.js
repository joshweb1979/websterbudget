import React, { Component } from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import ChangeModalOpen from "../components/ChangeModalOpen";

class Dashboard extends Component {
  render() {
    const isOpenQuery = gql`
      query {
        modalOpen @client {
          isOpen
        }
      }
    `;
    return (
      <React.Fragment>
        <h1>Dashboard</h1>
        <Query query={isOpenQuery}>
          {({ loading, error, data }) => {
            if (loading) return <h1 className="text-primary">Loading</h1>;
            if (error) {
              return <h1 className="text-danger">{`Error!: ${error}`}</h1>;
            }
            return (
              <h1 className="text-success">
                {data.modalOpen.isOpen ? "OPEN" : "CLOSED"}
              </h1>
            );
          }}
        </Query>
        <ChangeModalOpen />
      </React.Fragment>
    );
  }
}
export default Dashboard;
