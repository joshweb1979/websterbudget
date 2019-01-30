import React, { Component } from "react";
import { Table, Modal, ModalBody } from "reactstrap";
import { oneTransactionAllTransactionBudgets } from "../../queries";
import { Query } from "react-apollo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddEditTransactionBudget from "./AddEditTransactionBudget";
class PayeeTable extends Component {
  state = {
    showBudgetTransaction: false
  };
  toggleBudgetTransaction = () => {
    this.setState({ showBudgetTransaction: !this.state.showBudgetTransaction });
  };
  render() {
    const props = this.props;

    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.showBudgetTransaction}
          className="modal-dialog-centered"
          toggle={this.toggleBudgetTransaction}
        >
          <AddEditTransactionBudget
            modalTitle={`Add Budget Transaction to ${props.payeeName}`}
            iv={{
              budgetCategoryId: 0,
              budgetCategoryid: {
                label: "",
                value: 0
              },
              amount: 0
            }}
            openModal={this.toggleBudgetTransaction}
          />
        </Modal>
        <Table size="sm" striped>
          <thead>
            <tr>
              <th>
                Budget Category
                <button
                  className="btn btn-sm btn-success ml-3"
                  onClick={this.toggleBudgetTransaction}
                >
                  <FontAwesomeIcon icon="plus" className="mr-1" />
                  Add
                </button>
              </th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <Query
              query={oneTransactionAllTransactionBudgets}
              variables={{ transactionId: props.transactionId }}
            >
              {({ loading, error, data }) => {
                if (loading) return null;
                if (error) return `Error!: ${error}`;
                return data.oneTransactionAllTransactionBudgets.map(dt => {
                  return (
                    <tr key={dt.id}>
                      <td>{dt.budgetCategoryName}</td>
                      <td>${dt.amount}</td>
                    </tr>
                  );
                });
              }}
            </Query>
          </tbody>
          <tfoot>
            <tr>
              <td />
              <th>${props.budgetTotal}</th>
            </tr>
          </tfoot>
        </Table>
      </React.Fragment>
    );
  }
}
export default PayeeTable;
