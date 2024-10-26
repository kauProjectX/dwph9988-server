const response = ({ isSuccess, message }, result) => {
  return {
    isSuccess: isSuccess,
    message: message,
    result: result || null,
  };
};

const errResponse = ({ isSuccess, message }) => {
  return {
    isSuccess: isSuccess,
    message: message,
  };
};

module.exports = { response, errResponse };
