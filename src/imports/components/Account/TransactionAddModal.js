import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { graphql, compose } from "react-apollo";
import TransactionForm from "./TransactionForm";
import { optionPayees } from "../../queries";
class TransactionAddModal extends Component {
  render() {
    const props = this.props;
    const myToggle = () => {
      props.addModalToggle();
    };
    const closeBtn = (
      <button
        className="close btn btn-link btn-primary btn-sm"
        onClick={props.addModalToggle}
      >
        &times;
      </button>
    );
    return (
      <React.Fragment>
        <Button
          color="success"
          onClick={props.addModalToggle}
          size="sm"
          className="mb-1"
        >
          Add Transaction
        </Button>
        <Modal
          isOpen={props.addModalOpen}
          toggle={props.addModalToggle}
          centered={true}
          size="lg"
        >
          <ModalHeader
            toggle={props.addModalToggle}
            close={closeBtn}
            className={props.modalTitleColor}
          >
            {props.addModalTitle}
          </ModalHeader>
          <ModalBody>
            <TransactionForm
              payees={props.optionPayees}
              mtoggle={() => myToggle()}
              acctId={props.acctId}
            />
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}
export default compose(
  graphql(optionPayees, {
    props: ({ data: { optionPayees } }) => ({ optionPayees })
  })
)(TransactionAddModal);
