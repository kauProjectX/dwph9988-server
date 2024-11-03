export const response = ({ isSuccess, message }, result) => {
  return {
    isSuccess: isSuccess,
    message: message,
    result: result || null,
  };
};

export const errResponse = ({ isSuccess, message }) => {
  return {
    isSuccess: isSuccess,
    message: message,
  };
};
