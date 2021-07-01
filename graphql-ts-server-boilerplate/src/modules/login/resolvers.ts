import * as bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";

const errorResponse = [
  {
    path: "email",
    message: "invalid login"
  }
];

export const resolvers: ResolverMap = {
  Query: {
    hi2: () => "hi"
  },
  Mutation: {
    login: async (_, { email, password }: GQL.ILoginOnMutationArguments) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [
          {
            path: "email",
            message: "please confirm your email"
          }
        ];
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return errorResponse;
      }

      return null;
    }
  }
};
