exports.handleError = (res, e) => {
  res.statusCode = e.code || 500
  res.end(JSON.stringify({
    error: {
      message: e.message
    }
  }))
}
