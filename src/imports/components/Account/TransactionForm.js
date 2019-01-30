import React from "react";
import { Formik, Field, Form } from "formik";
import DatePicker from "react-datepicker";
import AsyncSelect from "react-select/lib/Async";
import Moment from "moment";
import { ModalFooter, ModalHeader, FormGroup, Col } from "reactstrap";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Mutation, graphql, compose } from "react-apollo";
import {
  checkNumbers,
  optionAsyncPayees,
  editTransaction,
  oneAccount
} from "../../queries";

const TransactionSchema = Yup.object().shape({
  amount: Yup.number()
    .lessThan(20000, "Must be less than $20000")
    .moreThan(0, "Must be greater than $0")
    .required("Amount is required"),
  payeeId: Yup.object().required("You must choose a Payee"),
  checkNumber: Yup.number()
});

const fieldClass = (err, tou) => {
  if (err) {
    return "form-control is-invalid";
  } else if (tou && !err) {
    return "form-control is-valid";
  } else {
    return "form-control";
  }
};

const TransactionForm = props => (
  <Mutation
    mutation={editTransaction}
    key={props.tran.id}
    update={(store, { data }) => {
      if (data) {
        props.updateAlertShow();
      }
    }}
    refetchQueries={[
      {
        query: oneAccount,
        variables: { id: props.acctId }
      }
    ]}
  >
    {(editTransaction, { data }) => (
      <Formik
        initialValues={{
          id: props.tran.id,
          dateOfTransaction: props.tran.dateOfTransaction,
          payeeId: {
            __typename: "Options",
            value: props.tran.payeeId,
            label: props.tran.payeeName
          },
          checkNumber: props.tran.checkNumber,
          debit: props.tran.debit,
          reconciled: props.tran.reconciled,
          pending: props.tran.pending,
          amount: props.tran.amount
        }}
        validationSchema={TransactionSchema}
        onSubmit={async (values, actions) => {
          values.payeeid = values.payeeId.value;
          const sub = await editTransaction({ variables: values });
          if (sub) {
            props.changeDisplay();
          }
        }}
        render={({
          errors,
          status,
          touched,
          isSubmitting,
          setFieldValue,
          values
        }) => (
          <Form>
            <ModalHeader toggle={props.changeDisplay}>
              <FontAwesomeIcon className="mr-2" icon="edit" />
              {values.payeeId.label}
            </ModalHeader>
            <div className="mt-2">
              <div className="row">
                <Col sm={2}>
                  {/* Id */}
                  <FormGroup>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon="hashtag" />
                        </span>
                      </div>
                      <input
                        className="form-control "
                        type="text"
                        name="id"
                        value={values.id}
                        readOnly
                      />
                    </div>
                  </FormGroup>
                  {/* /Id */}
                </Col>
                <Col sm={6}>
                  {/* Date */}
                  <FormGroup>
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
                  </FormGroup>
                  {/* /Date */}
                </Col>
                <Col sm={3}>
                  {/* Amount */}
                  <FormGroup>
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
                    </div>

                    {errors.amount && touched.amount ? (
                      <div className="text-danger">{errors.amount}</div>
                    ) : null}
                  </FormGroup>
                  {/* /Amount */}
                </Col>
              </div>
              <div className="row">
                <Col sm={6}>
                  {/* Choose a Payee */}

                  <FormGroup>
                    <AsyncSelect
                      className="ml-0 pl-0"
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
                      name="payeeId"
                      value={values.payeeId}
                      onChange={e => {
                        setFieldValue("payeeId", e);
                      }}
                    />
                  </FormGroup>
                  {/* /Choose a Payee */}
                </Col>
                <Col sm={2}>
                  <button
                    type="button"
                    className="btn btn-primary "
                    onClick={e => props.addPayeeModal()}
                  >
                    Add Payee
                  </button>
                </Col>
                <Col sm={3}>
                  {/* ------- Check Number ------- */}
                  <FormGroup>
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
                            if (value !== props.tran.checkNumber) {
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
                          }
                        }}
                      />
                    </div>

                    {errors.checkNumber && touched.checkNumber ? (
                      <div className="text-danger">{errors.checkNumber}</div>
                    ) : null}
                  </FormGroup>
                  {/* ------- Check Number ------- */}
                </Col>
              </div>
            </div>
            {/* ------- New Row with Other buttons ------- */}
            <div className="row">
              <div className="form-group col">
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
              <div className="form-group col">
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
                  {values.reconciled > 0 ? "Reconciled" : "Not Reconciled"}
                </button>
              </div>
              <FormGroup className="col">
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
              </FormGroup>
            </div>
            {/* ------- / New Row with Other buttons ------- */}
            <ModalFooter className="">
              {/* Button Group */}

              <button type="submit" className="btn  btn-primary ">
                <FontAwesomeIcon icon="save" />
                &nbsp;SAVE
              </button>
              <button
                type="button"
                className="btn  btn-secondary"
                onClick={e => {
                  props.changeDisplay();
                }}
              >
                <FontAwesomeIcon icon="times" />
                &nbsp;CANCEL
              </button>

              {/* /Button Group */}
            </ModalFooter>
          </Form>
        )}
      />
    )}
  </Mutation>
);
export default compose(
  graphql(optionAsyncPayees, {
    options: props => ({
      variables: { payeeNameString: props.tran.payeeName }
    })
  }),
  graphql(checkNumbers, {
    props: ({ data: { checkNumbers } }) => ({
      checkNumbers
    }),
    options: props => ({ variables: { accountId: props.acctId } })
  })
)(TransactionForm);
