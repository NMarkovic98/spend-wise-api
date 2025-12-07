import { User } from "../entities/user";
import { AppDataSource } from "../config/database";

const userRepo = AppDataSource.getRepository(User);

export const findOrCreateGoogleUser = async (profile: any) => {
  const { id, displayName, emails } = profile;
  let user = await userRepo.findOne({ where: { google_id: id } });
  if (!user) {
    user = userRepo.create({
      google_id: id,
      email: emails[0].value,
      fullname: displayName,
    });
    await userRepo.save(user);
  }
  return user;
};
