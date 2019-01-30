import React from "react";
import { Formik, Field, Form } from "formik";
import { FormGroup, Label } from "reactstrap";
import * as Yup from "yup";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

//import _ from "lodash";
const checkLogin = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      refreshToken
      ok
      token
      errors {
        path
        message
      }
    }
  }
`;
const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Must be greater than two characters!")
    .max(50, "Must be less than 50 characters!")
    .required("Username is Required!"),
  password: Yup.string()
    .min(2, "Must be greater than two characters!")
    .max(50, "Must be less than 50 characters!")
    .required("password is required")
});
const Login = props => {
  return (
    <Mutation mutation={checkLogin}>
      {(login, { data }) => (
        <React.Fragment>
          <h3 className="text-center">Login Form</h3>

          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={async (values, actions) => {
              const mylogin = await login({ variables: values });
              const { ok, token, refreshToken, errors } = mylogin.data.login;
              if (!ok) {
                console.log(errors);
              } else {
                localStorage.setItem("token", token);
                localStorage.setItem("refreshToken", refreshToken);
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("refreshToken", refreshToken);
                props.history.push("/home/dashboard");
              }
            }}
            validationSchema={LoginSchema}
            render={({ errors, status, touched, isSubmitting }) => (
              <Form className="container">
                <FormGroup row>
                  <Label for="usrname">Username</Label>
                  <Field
                    className={
                      errors.username && touched.username
                        ? "form-control is-invalid"
                        : "form-control is-valid"
                    }
                    type="text"
                    name="username"
                    placeholder="username"
                    autoComplete="off"
                    id="usrname"
                  />
                  {errors.username && touched.username ? (
                    <div className="invalid-feedback">{errors.username}</div>
                  ) : null}
                </FormGroup>
                <FormGroup row>
                  <Label for="usrname">Password</Label>

                  <Field
                    className={
                      errors.password && touched.password
                        ? "form-control is-invalid"
                        : "form-control is-valid"
                    }
                    type="password"
                    name="password"
                    placeholder="password"
                    autoComplete="off"
                  />
                  {errors.password && touched.password ? (
                    <div className="text-danger">{errors.password}</div>
                  ) : null}
                </FormGroup>
                <button className="btn-primary" type="submit">
                  Submit
                </button>
              </Form>
            )}
          />
        </React.Fragment>
      )}
    </Mutation>
  );
};

export default Login;
