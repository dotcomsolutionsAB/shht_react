import Joi from "joi";

const ChangePasswordSchema = Joi.object({
  new_password: Joi.string()
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

  new_password_confirmation: Joi.string()
    .trim()
    .valid(Joi.ref("new_password"))
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$`!()%*?&]{8,}$/
    // )
    .messages({
      "any.required": "New Password Confirmation is a required field.",
      "string.empty": "New Password Confirmation must contain value.",
      "any.only": "New Password Confirmation must match New Password.",
      // "string.pattern.base":
      //   "New Password Confirmation must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.",
    })
    .required(),
});

export default ChangePasswordSchema;
