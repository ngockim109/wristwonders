const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    return next();
  } catch (err) {
    const error_message = JSON.parse(err.message);
    return res.status(400).json({
      status: "Bad Request!",
      path: error_message[0].path[1],
      message: error_message[0].message,
    });
  }
};

export default validate;
