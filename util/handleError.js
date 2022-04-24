function handleError(err, res) {
    console.log(err);
    res.status(500).send(err.message);
}

module.exports = handleError;
