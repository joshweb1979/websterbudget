import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import TransactionForm from "../../components/Account/TransactionForm";
import { optionPayees } from "../../queries";
class MakeTransaction extends Component {
  render() {
    const props = this.props;
    const acctId = parseInt(props.match.params.accountid);
    return (
      <React.Fragment>
        <TransactionForm
          payees={props.optionPayees}
          acctId={acctId}
          {...props}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(optionPayees, {
    props: ({ data: { optionPayees } }) => ({ optionPayees })
  })
)(MakeTransaction);
