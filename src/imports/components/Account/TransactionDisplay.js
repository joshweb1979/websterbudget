import React from "react";
import { CardTitle, CardHeader, Col } from "reactstrap";
import { Mutation } from "react-apollo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  deleteTransaction,
  allTransactionsOneAccount,
  oneAccount
} from "../../queries";
const TransactionDisplay = props => (
  <React.Fragment>
    <CardHeader>
      <CardTitle>
        <div className="row mb-2">
          <div className="col-4">
            <h6 className="text-left">
              {`#${props.tran.id}`} &nbsp; {props.tran.dateOfTransaction} &nbsp;
              {props.tran.payeeName}
            </h6>
          </div>

          <div className="col-8">
            <div className="row">
              <div className="col">
                {props.tran.debit > 0 ? (
                  <h6 className="text-danger">
                    <FontAwesomeIcon className="mr-1" icon="check" />
                    Debit
                  </h6>
                ) : (
                  <h6 className="text-success">
                    <FontAwesomeIcon className="mr-1" icon="times" />
                    Debit
                  </h6>
                )}
              </div>
              <div className="col">
                {props.tran.reconciled > 0 ? (
                  <h6 className="text-success">
                    <FontAwesomeIcon className="mr-1" icon="check" />
                    Reconciled
                  </h6>
                ) : (
                  <h6 className="text-danger">
                    <FontAwesomeIcon className="mr-1" icon="times" />
                    Reconciled
                  </h6>
                )}
              </div>
              <div className="col">
                {props.tran.pending > 0 ? (
                  <h6 className="text-danger">
                    <FontAwesomeIcon className="mr-1" icon="check" />
                    Pending
                  </h6>
                ) : (
                  <h6 className="text-success">
                    <FontAwesomeIcon className="mr-1" icon="times" />
                    Pending
                  </h6>
                )}
              </div>
              <div className="col">
                {props.tran.checkNumber > 0 ? (
                  <h6>Check#: {props.tran.checkNumber}</h6>
                ) : null}
              </div>
              <div className="col">
                <div className="btn-group w-100">
                  <button
                    className="btn btn-warning btn-sm w-100"
                    onClick={e => {
                      props.changeDisplay(props.tran);
                    }}
                  >
                    <FontAwesomeIcon icon="edit" />
                  </button>
                  <Mutation
                    mutation={deleteTransaction}
                    variables={{ id: props.tran.id }}
                    key={props.tran.id}
                    update={(store, { data }) => {
                      const vars = { accountId: props.acctId };
                      const mydata = store.readQuery({
                        query: allTransactionsOneAccount,
                        variables: vars
                      });

                      let theindex = mydata.allTransactionsOneAccount.findIndex(
                        obj => obj.id === props.tran.id
                      );
                      mydata.allTransactionsOneAccount.splice(theindex, 1);
                      store.writeQuery({
                        query: allTransactionsOneAccount,
                        variables: vars,
                        data: mydata
                      });
                    }}
                    refetchQueries={[
                      {
                        query: oneAccount,
                        variables: { id: props.acctId }
                      }
                    ]}
                  >
                    {(deleteTransaction, { data }) => (
                      <button
                        className="btn btn-danger btn-sm w-100"
                        onClick={async e => {
                          const sub = await deleteTransaction({
                            variables: { id: props.tran.id }
                          });
                          if (sub) {
                            props.showDelete();
                          }
                        }}
                      >
                        <FontAwesomeIcon icon="trash-alt" />
                      </button>
                    )}
                  </Mutation>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-2">
          <Col sm={7}>
            <h5 className="">
              {props.tran.debit > 0 ? (
                <span className="text-danger">(${props.tran.amount})</span>
              ) : (
                <span className="text-success">${props.tran.amount}</span>
              )}
            </h5>
          </Col>

          <Col sm={5}>
            <h6>
              <strong
                className={
                  props.budgetBalance == 0 ? "text-success" : "text-danger"
                }
              >
                Budget Category Balance:{props.budgetBalance}
              </strong>
            </h6>
          </Col>
        </div>
      </CardTitle>
    </CardHeader>
  </React.Fragment>
);
export default TransactionDisplay;
