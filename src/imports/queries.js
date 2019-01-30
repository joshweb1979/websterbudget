import { gql } from "apollo-boost";

// client stuff
export const getUser = gql`
  query {
    userInfo @client {
      id
      lastName
      firstName
      isAdmin
      username
    }
  }
`;

export const updateUserInfo = gql`
  mutation updateUser($user: user) {
    updateUser(user: $user) @client {
      id
      lastName
      firstName
      isAdmin
      username
    }
  }
`;
// server stuff\
export const deleteTransaction = gql`
  mutation deleteTransaction($id: Int!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;
export const AddTransaction = gql`
  mutation(
    $accountId: Int!
    $payeeId: Int!
    $amount: Float!
    $pending: Int!
    $reconciled: Int!
    $debit: Int!
    $dateOfTransaction: String!
    $checkNumber: Int
  ) {
    addTransaction(
      accountId: $accountId
      payeeId: $payeeId
      amount: $amount
      pending: $pending
      reconciled: $reconciled
      debit: $debit
      dateOfTransaction: $dateOfTransaction
      checkNumber: $checkNumber
    ) {
      id
      payeeName
      payeeId
      amount
      debit
      deposit
      pending
      dateOfTransaction
      reconciled
      checkNumber
    }
  }
`;
export const updateReconciledInfo = gql`
  mutation updateReconciled($id: Int!, $reconciled: Int!) {
    updateReconciled(id: $id, reconciled: $reconciled) {
      id
      dateOfTransaction
      dateReconciled
      amount
      checkNumber
      pending
      payeeName
      payeeId
      reconciled
      debit
    }
  }
`;
export const updatePendingInfo = gql`
  mutation updatePending($id: Int!, $pending: Int!) {
    updatePending(id: $id, pending: $pending) {
      id
      dateOfTransaction
      dateReconciled
      amount
      checkNumber
      pending
      payeeName
      payeeId
      reconciled
      debit
    }
  }
`;
export const updateDebitInfo = gql`
  mutation updateDebit($id: Int!, $debit: Int!) {
    updateDebit(id: $id, debit: $debit) {
      id
      dateOfTransaction
      dateReconciled
      amount
      checkNumber
      pending
      payeeName
      payeeId
      reconciled
      debit
    }
  }
`;
export const editTransaction = gql`
  mutation editTransaction(
    $id: Int!
    $payeeid: Int!
    $amount: Float!
    $pending: Int!
    $reconciled: Int!
    $debit: Int!
    $dateOfTransaction: String!
    $checkNumber: Int
  ) {
    editTransaction(
      id: $id
      payeeid: $payeeid
      amount: $amount
      pending: $pending
      reconciled: $reconciled
      debit: $debit
      dateOfTransaction: $dateOfTransaction
      checkNumber: $checkNumber
    ) {
      id
      payeeName
      payeeId
      amount
      debit
      deposit
      pending
      dateOfTransaction
      reconciled
      checkNumber
    }
  }
`;
export const addPayee = gql`
  mutation addPayee($payeeName: String!, $locationId: Int) {
    addPayee(payeeName: $payeeName, locationId: $locationId) {
      id
      payeeName
      locationId
    }
  }
`;
export const oneTransactionAllTransactionBudgets = gql`
  query oneTransactionAllTransactionBudgets($transactionId: Int!) {
    oneTransactionAllTransactionBudgets(transactionId: $transactionId) {
      id
      budgetCategoryId
      amount
      budgetCategoryName
    }
  }
`;
export const getOneUser = gql`
  {
    oneUser(id: 10) {
      id
      firstName
      lastName
      username
      isAdmin
    }
  }
`;
export const allAccounts = gql`
  {
    allAccounts {
      id
      accountName
    }
  }
`;

export const oneAccount = gql`
  query oneaccount($id: Int!) {
    oneAccount(id: $id) {
      id
      beginingBalance
      accountName
      bankBalance
      actualBalance
    }
  }
`;
export const checkNumbers = gql`
  query checkNumbers($accountId: Int!) {
    checkNumbers(accountId: $accountId) {
      checkNumber
    }
  }
`;
export const allTransactionsOneAccount = gql`
  query allTransactionsOneAccount($accountId: Int!, $cursor: Int) {
    allTransactionsOneAccount(accountId: $accountId, cursor: $cursor) {
      id
      dateOfTransaction
      amount
      checkNumber
      pending
      reconciled
      debit
      deposit
      payeeName
      payeeId
      budgetTotal
    }
  }
`;
export const optionPayees = gql`
  {
    optionPayees {
      value
      label
    }
  }
`;
export const listBudgetCategories = gql`
  {
    listBudgetCategories {
      value
      label
    }
  }
`;
export const payeeList = gql`
  query payeeList($payeeNameString: String) {
    payeeList(payeeNameString: $payeeNameString) {
      id
      payeeName
    }
  }
`;
export const locationList = gql`
  {
    locationList {
      label
      value
    }
  }
`;
export const optionAsyncPayees = gql`
  query optionAsyncPayees($payeeNameString: String!) {
    optionAsyncPayees(payeeNameString: $payeeNameString) {
      value
      label
    }
  }
`;
export const UPDATE_MODAL_OPEN = gql`
  mutation updateModal($isOpen: Boolean) {
    updateModal(isOpen: $isOpen) @client
  }
`;
