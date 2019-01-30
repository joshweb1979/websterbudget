import React, { Component } from "react";
import { Card, CardBody, Table, Modal, ModalBody } from "reactstrap";
import TransactionDisplay from "./TransactionDisplay";
import TransactionForm from "./TransactionForm";
import PayeeTable from "./PayeeTable";
import SweetAlert from "react-bootstrap-sweetalert";
import AddEditPayeeForm from "../Payees/AddEditPayeeForm";
import { locationList, addPayee } from "../../queries";
import { Mutation } from "react-apollo";
import _ from "lodash";
class IndividualTransaction extends Component {
  state = {
    showDisplay: false,
    showEditPayeeModal: false,
    showPayeeTable: false,
    showUpdateAlert: false,
    payeeAdded: "",
    showPayeeAlert: false
  };
  changeDisplay = tran => {
    this.setState({ showDisplay: !this.state.showDisplay });
  };
  toggleEditPayeeModal = () => {
    this.setState({ showEditPayeeModal: !this.state.showEditPayeeModal });
  };

  toggleShowPayeeTable = () => {
    this.setState({ showPayeeTable: !this.state.showPayeeTable });
  };
  showDeleteAlert = () => {
    this.props.delAlert();
  };
  toggleUpdateAlert = () => {
    this.setState({ showUpdateAlert: !this.state.showUpdateAlert });
  };
  toggleAddPayeeAlert = () => {
    this.setState({ showPayeeAlert: !this.state.showPayeeAlert });
  };
  render() {
    const props = this.props;
    const tran = props.trans;

    return (
      <Card
        className={
          tran.debit > 0
            ? "border border-danger mb-1 "
            : "border border-success mb-1"
        }
      >
        <SweetAlert
          success
          title={`Transaction #${props.trans.id} Updated`}
          onConfirm={this.toggleUpdateAlert}
          show={this.state.showUpdateAlert}
        >
          "Transaction was successfully updated!"
        </SweetAlert>
        <SweetAlert
          success
          title={`Payee "${this.state.payeeAdded}" Added`}
          onConfirm={this.toggleAddPayeeAlert}
          show={this.state.showPayeeAlert}
        >
          "Payee was successfully updated!"
        </SweetAlert>
        <TransactionDisplay
          changeDisplay={this.changeDisplay}
          tran={props.trans}
          acctId={props.acctId}
          showDelete={this.showDeleteAlert}
          budgetBalance={_.round(
            props.trans.amount - props.trans.budgetTotal,
            2
          )}
        />

        <Modal
          isOpen={this.state.showDisplay}
          className="modal-dialog-centered modal-lg"
        >
          <ModalBody>
            <TransactionForm
              changeDisplay={this.changeDisplay}
              tran={props.trans}
              acctId={props.acctId}
              updateAlertShow={this.toggleUpdateAlert}
              addPayeeModal={this.toggleEditPayeeModal}
            />
            <Modal
              isOpen={this.state.showEditPayeeModal}
              className="modal-dialog-centered"
              toggle={this.toggleEditPayeeModal}
            >
              <Mutation mutation={addPayee}>
                {(addPayee, { data }) => (
                  <AddEditPayeeForm
                    openModal={this.toggleEditPayeeModal}
                    modalTitle="Add Payee"
                    iv={{
                      id: 0,
                      payeeName: "",
                      locationId: 0,
                      locationid: { value: 0, label: "" }
                    }}
                    payeeSubmit={async e => {
                      const sub = await addPayee({ variables: e });
                      if (sub) {
                        this.setState({
                          payeeAdded: sub.data.addPayee.payeeName
                        });
                        this.toggleAddPayeeAlert();
                      }
                    }}
                  />
                )}
              </Mutation>
            </Modal>
          </ModalBody>
        </Modal>

        <CardBody>
          <button className="btn btn-link" onClick={this.toggleShowPayeeTable}>
            {this.state.showPayeeTable ? "CLOSE PAYEES" : "OPEN PAYEES"}
          </button>
          {this.state.showPayeeTable ? (
            <PayeeTable
              transactionId={props.trans.id}
              budgetTotal={props.trans.budgetTotal}
              payeeName={props.trans.payeeName}
            />
          ) : null}
        </CardBody>
      </Card>
    );
  }
}

export default IndividualTransaction;
