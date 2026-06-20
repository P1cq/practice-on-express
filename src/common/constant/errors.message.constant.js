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
    unverifiedEmail: `Fail To Created ${name} `,
    failToLogin: `${name} invalid credentials`,
    successSendOtp: `${name} success send otp`,
    failSendOtp: `${name} invalid send otp`,
    otpIsExp: ` The ${name} code has expired. Please request a new code.`,
    otpNotVerify: ` Invalid  ${name} code. Please check and re-enter.`,
    otpValid: `A valid ${name} has already been sent. Please wait before requesting a new one`,
    blackList: `${name} user has been removed`,
    sucssesToLogin: `${name} login sucessfully`,
    UnsupportedFile: ` The uploaded ${name} format is not supported. Please upload an`,
    UnauthorizedToken: ` Your session has expired. Please log in again`,
    tokenRequired: `Authentication ${name} is required to access this resource`,
    NotAuthenticated: `${name} Authentication required. Please log in to access this resource`,
  };
};

export const SYS_ERRORS_MESSAGES = {
  user: errorsMessages("user"),
  otp: errorsMessages("otp"),
  file: errorsMessages("file"),
  token: errorsMessages("token"),
};
