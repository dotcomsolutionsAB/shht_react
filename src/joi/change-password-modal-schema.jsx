import Joi from "joi";

const ChangePasswordModalSchema = Joi.object({
  user_id: Joi.number().required(),
  password: Joi.string()
    .trim()
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$`!()%*?&]{8,}$/
    // )
    .messages({
      "any.required": "New Password is a required field.",
      "string.empty": "New Password must contain value.",
      // "string.pattern.base":
      //   "New Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.",
    })
    .required(),
  password_confirmation: Joi.string()
    .trim()
    .valid(Joi.ref("password"))
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$`!()%*?&]{8,}$/
    // )
    .messages({
      "any.required": "Re-enter New Password is a required field.",
      "string.empty": "Re-enter New Password must contain value.",
      "any.only": "Re-enter New Password must match New Password.",
      // "string.pattern.base":
      //   "New Password Confirmation must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.",
    })
    .required(),
});

export default ChangePasswordModalSchema;
