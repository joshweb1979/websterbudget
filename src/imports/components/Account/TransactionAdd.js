import React from "react";
import { Formik, Field, Form } from "formik";
import DatePicker from "react-datepicker";
import AsyncSelect from "react-select/lib/Async";
import Moment from "moment";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Mutation, graphql, compose } from "react-apollo";
import { Card } from "reactstrap";
import {
  checkNumbers,
  optionAsyncPayees,
  AddTransaction,
  allTransactionsOneAccount,
  oneAccount
} from "../../queries";
const fieldClass = (err, tou) => {
  if (err) {
    return "form-control is-invalid";
  } else if (tou && !err) {
    return "form-control is-valid";
  } else {
    return "form-control";
  }
};
const AddTransactionSchema = Yup.object().shape({
  dateOfTransaction: Yup.string().required("Date is required"),
  amount: Yup.number()
    .lessThan(20000, "Must be less than $20000")
    .moreThan(0, "Must be greater than $0")
    .required("Amount is required"),
  payeeId: Yup.number().required("You must choose a Payee"),
  checkNumber: Yup.number()
});
const TransactionAdd = props => (
  <React.Fragment>
    <Card className="border border-info mb-2">
      <Mutation
        mutation={AddTransaction}
        update={(store, { data: { addTransaction } }) => {
          const vars = { accountId: props.acctId.id };
          const data = store.readQuery({
            query: allTransactionsOneAccount,
            variables: vars
          });
          data.allTransactionsOneAccount.unshift(addTransaction);
          store.writeQuery({
            query: allTransactionsOneAccount,
            variables: vars,
            data
          });
        }}
        refetchQueries={[
          {
            query: oneAccount,
            variables: { id: props.acctId.id }
          }
        ]}
      >
        {(AddTransaction, { data }) => (
          <Formik
            initialValues={{
              dateOfTransaction: Moment().format("YYYY-MM-DD"),
              payeeid: {
                __typename: "Options",
                value: "",
                label: ""
              },
              checkNumber: 0,
              debit: 1,
              reconciled: 0,
              pending: 0,
              amount: "",
              payeeId: ""
            }}
            validationSchema={AddTransactionSchema}
            onSubmit={async (values, actions) => {
              delete values.payeeid;
              values.accountId = props.acctId.id;
              const sub = await AddTransaction({ variables: values });
              if (sub) {
                actions.resetForm();
                props.addAlert(values);
              }
            }}
            render={({
              errors,
              status,
              touched,
              isSubmitting,
              setFieldValue,
              values,
              resetForm
            }) => {
              return (
                <Form>
                  <legend className="text-center text-info">
                    Add Transaction
                  </legend>
                  <div className="row m-2">
                    {/* Date */}
                    <div className="col-4">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <FontAwesomeIcon icon="calendar-day" />
                          </span>
                        </div>
                        <DatePicker
                          name="dateOfTransaction"
                          id="dateOfTransaction"
                          className="form-control"
                          onChange={e => {
                            let u = Moment(e).format("YYYY-MM-DD");
                            setFieldValue("dateOfTransaction", u);
                          }}
                          inline={false}
                          dateFormat="YYYY-MM-DD"
                          autoComplete="off"
                          value={values.dateOfTransaction}
                        />
                      </div>
                      {errors.dateOfTransaction && touched.dateOfTransaction ? (
                        <div className="text-danger">
                          {errors.dateOfTransaction}
                        </div>
                      ) : null}
                    </div>
                    {/* /Date */}
                    {/* Choose a Payee */}
                    <div className="col-5">
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={(inputValue, callback) => {
                          setTimeout(() => {
                            callback(props.data.optionAsyncPayees);
                          }, 1000);
                        }}
                        onInputChange={(newValue: string) => {
                          const {
                            data: { fetchMore }
                          } = props;
                          fetchMore({
                            variables: {
                              payeeNameString: newValue
                            },
                            updateQuery: (
                              previousResult,
                              { fetchMoreResult }
                            ) => {
                              if (!fetchMoreResult) {
                                return previousResult;
                              }
                              return {
                                ...previousResult,
                                optionAsyncPayees: [
                                  ...fetchMoreResult.optionAsyncPayees
                                ]
                              };
                            }
                          });
                        }}
                        name="payeeid"
                        value={values.payeeid}
                        onChange={e => {
                          setFieldValue("payeeId", e.value);
                          setFieldValue("payeeid", e);
                        }}
                      />
                      {errors.payeeId && touched.payeeid ? (
                        <div className="text-danger">{errors.payeeId}</div>
                      ) : null}
                    </div>
                    {/* /Choose a Payee */}
                    {/* Amount */}
                    <div className="col-3">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            <FontAwesomeIcon icon="dollar-sign" />
                          </span>
                        </div>
                        <Field
                          className={fieldClass(errors.amount, touched.amount)}
                          type="number"
                          name="amount"
                          id="amount"
                          autoComplete="off"
                        />
                        {errors.amount && touched.amount ? (
                          <div className="text-danger">{errors.amount}</div>
                        ) : null}
                      </div>
                    </div>
                    {/* /Amount */}
                  </div>
                  {/* ------- New Row with Other buttons ------- */}
                  <div className="row m-2">
                    <div className="col">
                      <button
                        className={
                          values.debit > 0
                            ? "btn  btn-block btn-danger"
                            : "btn  btn-block btn-success"
                        }
                        type="button"
                        onClick={e => {
                          let x = values.debit;
                          const y = x > 0 ? 0 : 1;
                          setFieldValue("debit", y);
                        }}
                      >
                        {values.debit > 0 ? "Debit" : "Deposit"}
                      </button>
                    </div>
                    <div className="col">
                      <button
                        className={
                          values.reconciled > 0
                            ? "btn  btn-block btn-success"
                            : "btn  btn-block btn-secondary"
                        }
                        type="button"
                        onClick={e => {
                          let x = values.reconciled;
                          const y = x > 0 ? 0 : 1;
                          setFieldValue("reconciled", y);
                        }}
                      >
                        {values.reconciled > 0
                          ? "Reconciled"
                          : "Not Reconciled"}
                      </button>
                    </div>
                    <div className="col">
                      <button
                        className={
                          values.pending > 0
                            ? "btn  btn-block btn-warning"
                            : "btn  btn-block btn-success"
                        }
                        type="button"
                        onClick={e => {
                          let x = values.pending;
                          const y = x > 0 ? 0 : 1;
                          setFieldValue("pending", y);
                        }}
                      >
                        {values.pending > 0 ? "Pending" : "Not Pending"}
                      </button>
                    </div>
                    {/* ------- Check Number ------- */}
                    <div className="col-3">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            <FontAwesomeIcon icon="money-check" />
                          </span>
                        </div>
                        <Field
                          className={fieldClass(
                            errors.checkNumber,
                            touched.checkNumber
                          )}
                          type="text"
                          name="checkNumber"
                          id="checkNumber"
                          autoComplete="off"
                          type="number"
                          validate={value => {
                            let errorMessage;

                            if (value) {
                              if (
                                props.checkNumbers.filter(
                                  chk => value === chk.checkNumber
                                ).length > 0
                              ) {
                                errorMessage =
                                  "This check number has already been used";
                              }
                              return errorMessage;
                            }
                          }}
                        />
                        {errors.checkNumber && touched.checkNumber ? (
                          <div className="text-danger">
                            {errors.checkNumber}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    {/* ------- Check Number ------- */}
                  </div>
                  {/* ------- / New Row with Other buttons ------- */}
                  <div className="row m-2">
                    {/* Button Group */}
                    <div className="col text-right">
                      <div className="btn-group">
                        <button type="submit" className="btn  btn-primary ">
                          <FontAwesomeIcon icon="save" />
                        </button>
                        <button
                          type="button"
                          className="btn  btn-secondary"
                          onClick={e => {
                            resetForm();
                          }}
                        >
                          <FontAwesomeIcon icon="times" />
                        </button>
                      </div>
                    </div>
                    {/* /Button Group */}
                  </div>
                </Form>
              );
            }}
          />
        )}
      </Mutation>
    </Card>
  </React.Fragment>
);
export default compose(
  graphql(optionAsyncPayees, {
    options: props => ({
      variables: { payeeNameString: "" }
    })
  }),
  graphql(checkNumbers, {
    props: ({ data: { checkNumbers } }) => ({
      checkNumbers
    }),
    options: props => ({ variables: { accountId: props.acctId.id } })
  })
)(TransactionAdd);
