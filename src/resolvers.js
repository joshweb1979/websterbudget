export const defaults = {
  modalOpen: {
    __typename: "ModalOpen",
    isOpen: false
  },
  navOpen: {
    __typename: "NavOpen",
    isNavOpen: false
  },
  userInfo: {
    __typename: "UserInfo",
    lastName: "Webster",
    firstName: "Josh",
    isAdmin: 0,
    username: "jwebster",
    id: 0
  },
  transInfo: {
    __typename: "TransInfo",
    id: 0,
    dateOfTransaction: "",
    debit: true,
    reconciled: false,
    pending: false,
    checkNumber: "",
    amount: 0,
    payeeId: "",
    accountId: ""
  }
};
export const resolvers = {
  Mutation: {
    updateModalOpen: (_, { isOpen }, { cache }) => {
      cache.writeData({
        data: {
          modalOpen: {
            __typename: "ModalOpen",
            isOpen
          }
        }
      });
      return null;
    },
    updateNavOpen: (_, { isNavOpen }, { cache }) => {
      cache.writeData({
        data: {
          navOpen: {
            __typename: "NavOpen",
            isNavOpen
          }
        }
      });
      return null;
    },
    updateUser: (_, param, { cache }) => {
      //console.log(param);
      const {
        user: { id, lastName, firstName, username, isAdmin }
      } = param;
      cache.writeData({
        data: {
          userInfo: {
            __typename: "UserInfo",
            id,
            lastName,
            firstName,
            username,
            isAdmin
          }
        }
      });
      return null;
    }
  }
};
