const withError = async (fn, params) => {
  try {
    const result = await fn(params);
    return result;
  } catch (err) {
    return err;
  }
};

module.exports = withError;
