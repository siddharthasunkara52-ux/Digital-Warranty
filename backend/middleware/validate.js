import { ApiError } from "./errorHandler.js";


export const validate = (schema) => (req, _res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value === undefined || value === null) continue;

    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be a ${rules.type}`);
    }

    if (rules.minLength && typeof value === "string" && value.length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters`);
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors.join(", "));
  }

  next();
};


export const addProductSchema = {
  productName: { required: true, type: "string", minLength: 1 },
  purchaseDate: { required: true, type: "string" },
  warrantyPeriod: { required: true },
};

export const signupSchema = {
  name: { required: true, type: "string", minLength: 1 },
  email: { required: true, type: "string" },
  password: { required: true, type: "string", minLength: 6 },
};

export const loginSchema = {
  email: { required: true, type: "string" },
  password: { required: true, type: "string" },
};
