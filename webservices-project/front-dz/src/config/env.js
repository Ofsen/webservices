const env = import.meta.env;

export default {
  auth: env.VITE_AUTH_URL,
  crud: env.VITE_CRUD_URL + "/api",
  ai: env.VITE_AI_URL,
  stripeMS: env.VITE_STRIPE_MS_URL,
};
