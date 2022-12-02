const Joi = require("joi");

const schema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net"],
      },
    })
    .required(),
  name: Joi.string().alphanum().min(3).max(30).required(),
  phone: Joi.string().min(7),
  favorite: Joi.boolean(),
  token: Joi.string(),
});

const schemaContactFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemaAuth = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net"],
      },
    })
    .required(),
  password: Joi.string().required(),
});

module.exports = { schema, schemaContactFavorite, schemaAuth };
