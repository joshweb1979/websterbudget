import React from "react";
import { Query } from "react-apollo";
import { Formik, Form } from "formik";
import { listBudgetCategories } from "../../queries";
import {
  ModalFooter,
  ModalHeader,
  Label,
  FormGroup,
  ModalBody
} from "reactstrap";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { graphql, compose } from "react-apollo";
import Select from "react-select";

const AddEditTransactionBudget = props => (
  <React.Fragment>
    <ModalHeader>{props.modalTitle}</ModalHeader>
    <ModalBody>
      <Formik
        initialValue={props.iv}
        render={({
          errors,
          status,
          touched,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          values
        }) => (
          <Form className="container">
            <FormGroup>
              <Label for="budgetCategoryId">Budget Category:</Label>
              {/* ------- Budget Category ------- */}
              <Query query={listBudgetCategories}>
                {({ loading, error, data }) => {
                  if (loading) return "Loading...";
                  if (error) return `Error! ${error.message}`;

                  return (
                    <Select
                      name="budgetcategoryid"
                      id="budgetCategoryid"
                      values={values.budgetCategoryid}
                      options={data.listBudgetCategories}
                      onChange={e => {
                        setFieldValue("budgetcategoryId", e.value);
                        setFieldValue("budgetcategoryid", e);
                      }}
                      onBlur={e => {
                        setFieldTouched("budgetcategoryid", true);
                      }}
                    />
                  );
                }}
              </Query>

              {/* ------- /Budget Category ------- */}
            </FormGroup>
            <FormGroup>
              {/* ------- Amount ------- */}
              <Label for="budgetCategoryId">Amount:</Label>
              <input
                autoComplete="off"
                name="amount"
                className="form-control"
                type="number"
                id="amount"
                onChange={e => {
                  setFieldValue("amount", e.target.value);
                }}
                onBlur={e => {
                  setFieldTouched("amount", true);
                }}
              />

              {/* ------- /Amount ------- */}
            </FormGroup>
            {/* ------- Form Buttons ------- */}

            <ModalFooter>
              <button type="submit" className="btn btn-primary">
                <FontAwesomeIcon className="mr-2" icon="save" />
                Save
              </button>
              <button
                onClick={e => {
                  props.openModal();
                }}
                type="button"
                className="btn btn-secondary"
              >
                <FontAwesomeIcon className="mr-2" icon="times" />
                Cancel
              </button>
            </ModalFooter>
            {/* ------- /Form Buttons ------- */}
          </Form>
        )}
      />
    </ModalBody>
  </React.Fragment>
);
export default AddEditTransactionBudget;
