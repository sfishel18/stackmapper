exports.transform = (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    if (req.method === "HEAD") {
      res.status(200).send();
      return;
    }
    res.status(200).send({ message: 'Hello!' });
}
