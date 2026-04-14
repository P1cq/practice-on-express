const errorsMessages = function (name) {
  return {
    alreadyExists: `${name} Already Exists`,
    notFound: `${name} Not Found`,
    userUpdated: `${name} Updated Succefully`,
    userDeleted: `${name} Deleted Succefully`,
    userCreated: `${name} Created Succefully`,
     userGet: `${name} Get Succefully`,
    failToUpdate: `Fail To Updated ${name} `,
    failToDelete: `Fail To Deleted ${name} `,
    failToCreate: `Fail To Created ${name} `,
       failToLogin: `${name} invalid credentials`,
  };
};

export const SYS_ERRORS_MESSAGES = {
  user: errorsMessages("user"),
  product: errorsMessages("product"),
  category: errorsMessages("category"),
  brand: errorsMessages("brand"),
};


