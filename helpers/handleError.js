/*
 * handleError: defines the default behavior for handling internal exceptions.
 *  arguments:
 *    err: the exception that was thrown.
 *    res: the Node response object, which will be used to return a HTTP response.
 * 
 *  return: sends an HTTP response through the given Node response object.
 */
module.exports = (err, res) => {
  console.log(err)
  res.status(500).send(err.message)
}
