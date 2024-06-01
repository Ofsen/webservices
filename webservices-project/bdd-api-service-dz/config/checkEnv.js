exports.check = () => {
  // get env APP keys
  const keys = Object.keys(process.env);
  const appKeys = keys.filter((key) => key.includes("DZ_APP_"));

  // check if all keys are defined
  if (appKeys.length === 0) {
    console.error("No APP keys found in .env file");
    process.exitCode = 1;
    process.exit();
  }

  // check if all keys have values
  appKeys.forEach((key) => {
    if (!process.env[key]) {
      console.error(key + " is not defined in .env file");
      process.exitCode = 1;
      process.exit();
    }
  });
};
