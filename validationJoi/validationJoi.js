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
  phone: Joi.string().min(7).required(),
  favorite: Joi.boolean(),
});

const schemaContactFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { schema, schemaContactFavorite };
