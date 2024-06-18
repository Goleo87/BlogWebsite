const globalErrorHandler = (err, req, res, next) => {
  console.log("Error handler is running...");
  res.status(err.status || 400).send({
    error: {
      message: err.message,
      status: err.status
    }
  })
}

export default globalErrorHandler;