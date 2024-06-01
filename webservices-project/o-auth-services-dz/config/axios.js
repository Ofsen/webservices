const axios = require("axios").default;

exports.setup = () => {
  axios.defaults.headers.common["x-api-key"] = process.env.DZ_APP_JWT_SECRET;
  axios.defaults.withCredentials = true;
};
