import React, { Component } from "react";
import { Query } from "react-apollo";
import { oneAccount } from "../queries";
import TransactionTable from "../components/Account/TransactionTable";
//import { NavLink } from "react-router-dom";
class Account extends Component {
  render() {
    let props = this.props;
    const accntId = props.match.params.accountid;
    const myid = { id: parseInt(accntId) };
    const esTransaction = r => {
      let x = "EDIT " + r.payeeName + " TRANSACTION";
      this.setState({
        transAddModalOpen: !this.state.transAddModalOpen,
        transModalTitle: x,
        modalHeaderColor: "bg-warning"
      });
    };
    const dltTransaction = r => {
      console.log(r);
    };

    return (
      <Query query={oneAccount} variables={myid}>
        {({ loading, error, data }) => {
          if (loading) return "Loading..";
          if (error) return `ERROR !: ${error.message}`;
          let dt = data.oneAccount;
          return (
            <React.Fragment>
              <h2 className="text-center text-primary">{dt.accountName}</h2>

              <h4>Actual Balance:{dt.actualBalance}</h4>
              <h4>Bank Balance:{dt.bankBalance}</h4>
              <TransactionTable
                trans={[]}
                etrans={esTransaction}
                dtrans={dltTransaction}
                acctId={myid}
              />
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}
export default Account;
