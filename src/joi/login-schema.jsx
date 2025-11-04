import Joi from "joi";

const LoginSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .messages({
      "any.required": "Username is a required field.",
      "string.empty": "Username must contain value.",
      "string.min": "Username must be at least 3 characters long.",
      "string.max": "Username must not exceed 100 characters.",
    })
    .required(),

  password: Joi.string()
    .trim()
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$`!()%*?&]{8,}$/
    // )
    .messages({
      "any.required": "Password is a required field.",
      "string.empty": "Password must contain value.",
      // "string.pattern.base":
      //   "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.",
    })
    .required(),
});

export default LoginSchema;
