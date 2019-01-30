import React from "react";
import { Formik, Form } from "formik";
import { locationList } from "../../queries";
import { ModalFooter, ModalHeader, Label, FormGroup } from "reactstrap";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { graphql, compose } from "react-apollo";
import Select from "react-select";
const PayeeSchema = Yup.object().shape({
  payeeName: Yup.string()
    .min(2, "Must be greater than one character.")
    .required("You must enter a payee name."),
  locationId: Yup.number()
    .moreThan(0, "You must choose a Location")
    .required("You must choose a Location")
});
//import PropTypes from 'prop-types';
const AddEditPayeeForm = props => (
  <React.Fragment>
    <ModalHeader toggle={e => props.openModal()}>
      {props.modalTitle}
    </ModalHeader>

    <Formik
      initialValue={props.iv}
      onSubmit={async (values, actions) => {
        props.payeeSubmit(values);
        props.openModal();
      }}
      validationSchema={PayeeSchema}
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
            <Label for="payeeName">Payee Name:</Label>
            {/* ------- payeeName ------- */}
            <input
              autoComplete="off"
              name="payeeName"
              className="form-control"
              type="text"
              id="payeeName"
              onChange={e => {
                setFieldValue("payeeName", e.target.value);
              }}
              onBlur={e => {
                setFieldTouched("payeeName", true);
              }}
            />
            {errors.payeeName && touched.payeeName ? (
              <div className="text-danger">{errors.payeeName}</div>
            ) : null}
            {/* ------- /payeeName ------- */}
          </FormGroup>
          <FormGroup>
            {/* ------- Location ------- */}

            <Label for="locationid">Location:</Label>
            <Select
              options={props.locationList}
              name="locationid"
              id="locationid"
              values={values.locationid}
              onChange={e => {
                setFieldValue("locationId", e.value);
                setFieldValue("locationid", e);
              }}
              onBlur={e => {
                setFieldTouched("locationid", true);
              }}
            />
            {/* ------- /Location ------- */}
            {errors.locationId && touched.locationid ? (
              <div className="text-danger">{errors.locationId}</div>
            ) : null}
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
  </React.Fragment>
);
export default compose(
  graphql(locationList, {
    props: ({ data: { locationList } }) => ({ locationList })
  })
)(AddEditPayeeForm);
