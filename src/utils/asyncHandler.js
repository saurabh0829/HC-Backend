// Creating a wrapper function to connect/talk to db

// by using promise
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
    .catch((err) => next(err));
  };
};

export { asyncHandler };

// by using async await
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false, // its a type of flag for the understanding of the frontend guy for the success of the api
//       message: err.message,
//     });
//   }
// };
