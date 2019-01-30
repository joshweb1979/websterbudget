import React, { Component } from "react";

import IndividualTransaction from "./IndividualTransaction";
import TransactionAdd from "./TransactionAdd";
import { graphql, compose } from "react-apollo";

//import PropTypes from "prop-types";
import { allTransactionsOneAccount } from "../../queries";
import SweetAlert from "react-bootstrap-sweetalert";

class TransactionTable extends Component {
  state = {
    hasMoreItems: true,
    show: false,
    showDeleteAlert: false,
    showAddAlert: false,
    addTransactionTitle: ""
  };
  componentWillReceiveProps({ data: { allTransactionsOneAccount } }) {
    if (
      this.scroller &&
      this.props.data.allTransactionsOneAccount &&
      allTransactionsOneAccount &&
      this.props.data.allTransactionsOneAccount.length !==
        allTransactionsOneAccount.length
    ) {
      setTimeout(() => {
        this.scroller.scrollTop = this.scroller.scrollHeight - 2000;
      }, 300);
    }
  }
  toggleDeleteAlert = () => {
    this.setState({ showDeleteAlert: !this.state.showDeleteAlert });
  };
  toggleAddAlert = e => {
    if (e) {
      let title = `Transaction for $
      ${e.amount} was added!`;
      this.setState({
        showAddAlert: !this.state.showAddAlert,
        addTransactionTitle: title
      });
    } else {
      this.setState({
        showAddAlert: !this.state.showAddAlert
      });
    }
  };

  handleScroll = () => {
    const {
      data: { allTransactionsOneAccount, fetchMore }
    } = this.props;
    if (
      this.scroller &&
      this.state.hasMoreItems &&
      allTransactionsOneAccount.length >= 10
    ) {
      let hgt = this.scroller.scrollHeight;
      let offHgt = this.scroller.offsetHeight;
      let st = this.scroller.scrollTop;
      if (st === hgt - offHgt) {
        let len = allTransactionsOneAccount.length;
        fetchMore({
          variables: {
            accountId: this.props.acctId.id,
            cursor: allTransactionsOneAccount[len - 1].id
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            if (fetchMoreResult.allTransactionsOneAccount.length === 0) {
              this.setState({ hasMoreItems: false });
            }
            return {
              ...previousResult,
              allTransactionsOneAccount: [
                ...previousResult.allTransactionsOneAccount,
                ...fetchMoreResult.allTransactionsOneAccount
              ]
            };
          }
        });
      }
    }
  };
  render() {
    const props = this.props;
    const {
      data: { loading, allTransactionsOneAccount }
    } = props;
    return loading ? null : (
      <React.Fragment>
        <div>
          <SweetAlert
            success
            title={this.state.addTransactionTitle}
            onConfirm={this.toggleAddAlert}
            show={this.state.showAddAlert}
          >
            "Transaction was successfully added!"
          </SweetAlert>
          <TransactionAdd
            acctId={this.props.acctId}
            addAlert={this.toggleAddAlert}
          />
        </div>
        <div
          id="transholder"
          style={{ overflow: "auto", maxHeight: "600px" }}
          onScroll={this.handleScroll}
          ref={scroller => {
            this.scroller = scroller;
          }}
        >
          <div className="">
            <SweetAlert
              danger
              title="Transaction Deleted"
              onConfirm={this.toggleDeleteAlert}
              show={this.state.showDeleteAlert}
            >
              "Transaction was successfully deleted!"
            </SweetAlert>

            {allTransactionsOneAccount.map(r => (
              <IndividualTransaction
                key={r.id}
                trans={r}
                acctId={this.props.acctId.id}
                delAlert={this.toggleDeleteAlert}
              />
            ))}
          </div>
        </div>
        {this.state.hasMoreItems && allTransactionsOneAccount.length >= 10 && (
          <h5 className="text-primary text-center">Load More..</h5>
        )}
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(allTransactionsOneAccount, {
    options: props => ({
      variables: { accountId: props.acctId.id },
      fetchPolicy: "network-only"
    })
  })
)(TransactionTable);
