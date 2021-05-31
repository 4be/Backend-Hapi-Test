const successed = ({ responseMessage = "", responseData = {} }) => ({
  status: "success",
  message: responseMessage,
  data: responseData,
});

const failed = ({ responseMessage = "", responseData = {} }) => {
  if (failed === true) {
    return {
      status: "fail",
      message: responseMessage,
      data: responseData,
    };
  }
  return {
    status: "fail",
    message: responseMessage,
  };
};

const errormsg = (responseMessage = "") => ({
  status: "error",
  message: responseMessage,
});

module.exports = { successed, failed, errormsg };
