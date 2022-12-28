function handleError(err, res, statusCode = 500) {
    console.log(`${statusCode}: ${err}`);
    let message = err.message || err;
    res.status(statusCode).send(message);
}

module.exports = handleError;
