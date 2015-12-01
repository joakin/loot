exports.handleError = (res, e) => {
  res.statusCode = 500
  res.end(JSON.stringify({
    error: {
      message: e.message
    }
  }))
}
