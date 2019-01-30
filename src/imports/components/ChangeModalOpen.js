import React from "react";
import { gql } from "apollo-boost";
import { graphql, compose } from "react-apollo";

const getModalOpen = gql`
  query {
    modalOpen @client {
      isOpen
    }
  }
`;

const ChangeModalOpen = ({ mutate, data: { loading, modalOpen } }) =>
  !loading ? (
    <button
      className="btn btn-primary"
      onClick={() =>
        mutate({
          variables: {
            isOpen: !modalOpen.isOpen
          }
        })
      }
    >
      Open Modal
    </button>
  ) : null;

const changeIsOpenMutation = gql`
  mutation($isOpen: Boolean) {
    updateModalOpen(isOpen: $isOpen) @client
  }
`;

export default compose(
  graphql(getModalOpen),
  graphql(changeIsOpenMutation)
)(ChangeModalOpen);
