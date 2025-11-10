import { comparePassword } from "../../helpers/bcrypt.helper";
import { AppError } from "../../helpers/errors.helper";
import { signToken } from "../../helpers/jwt.helper";
import { User } from "../../models";

export class UserService {
  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    };

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    };

    const token = signToken({ userId: user._id, role: user.role });
    return { token, user };
  }
}