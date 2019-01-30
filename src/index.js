import React from "react";
import { render } from "react-dom";
import "./index.css";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  from
} from "apollo-boost";

import { ApolloProvider } from "react-apollo";
import { withClientState } from "apollo-link-state";

import "./styles/custom.scss";
import "react-datepicker/dist/react-datepicker.css";

import Routes from "./routes";
import { defaults, resolvers } from "./resolvers";
const cache = new InMemoryCache();
const httpLink = new HttpLink({ uri: "http://192.168.1.113:4000/graphql" });
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  operation.setContext({
    headers: {
      xtoken: token ? token : "",
      xrefreshtoken: refreshToken ? refreshToken : ""
    }
  });
  return forward(operation);
});

const otherLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const {
      response: { headers }
    } = operation.getContext();
    if (headers) {
      const token = headers.get("xtokenss");
      const refreshToken = headers.get("xrefreshtokenss");

      if (token) {
        localStorage.setItem("token", token);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }

    return response;
  });
});

// link clientState
const stateLink = withClientState({
  cache,
  defaults,
  resolvers
});

// link clientState
const client = new ApolloClient({
  link: from([stateLink, authLink, otherLink, httpLink]),
  cache
});

const App = () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);
render(<App />, document.getElementById("root"));
