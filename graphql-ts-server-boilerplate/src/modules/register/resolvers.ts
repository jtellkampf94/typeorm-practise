import * as bcrypt from "bcryptjs";
import * as yup from "yup";

import { createConfirmEmailLink } from "./../../utils/createConfirmEmailLink";
import { formatYupError } from "./../../utils/formatYupError";
import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { sendEmail } from "../../utils/sendEmail";

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3)
    .max(255)
    .email(),
  password: yup
    .string()
    .min(3)
    .max(255)
});

export const resolvers: ResolverMap = {
  Query: {
    hi: () => "hi"
  },
  Mutation: {
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments,
      { redis, url }
    ) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (error) {
        formatYupError(error);
      }
      const { email, password } = args;
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["id"]
      });
      if (userAlreadyExists) {
        return [
          {
            path: "email",
            message: "already taken"
          }
        ];
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword
      });

      await user.save();

      await sendEmail(email, await createConfirmEmailLink(url, user.id, redis));

      return null;
    }
  }
};
