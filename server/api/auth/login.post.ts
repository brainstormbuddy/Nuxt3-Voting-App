import { ValidatePassword } from "~~/server/utils/bcrypt";
import { GenerateToken } from "~~/server/utils/jwt";
import { getUserData } from "../../db/user";
import { H3Event } from "h3";
export default defineEventHandler(async (event) => {
  // get data from req.body
  const { userName, passWord } = await readBody(event);
  try {
    // get user data
    const user = await getUserData(userName);
    // does the user exist
    if (user) {
      // check if the password is correct
      const Validated = await ValidatePassword(passWord, user.password);
      if (Validated) {
        // create token
        const token = GenerateToken(user.id, user.name);
        const { id, name, email } = user;
        return {
          user: {
            id,
            name,
            email,
          },
          token,
        };
      }
      // the pasword isnt correct
      return sendError(
        event,
        createError({ statusCode: 401, statusMessage: "wrong password" })
      );
    }
    // user doesnt exist
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "user doesnt exist" })
    );
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "sth went wrong" })
    );
  }
});
