import { User } from "../entities/user";
import { AppDataSource } from "../config/database";

export const findOrCreateGoogleUser = async (profile: any) => {
  const { id, displayName, emails } = profile;

  const userRepo = AppDataSource.getRepository(User);

  let user = await userRepo.findOne({ where: { google_id: id } });
  if (!user) {
    user = userRepo.create({
      google_id: id,
      email: emails[0].value,
      fullname: displayName,
    });
    await userRepo.save(user);
    console.log("Created new user:", user);
  } else {
    console.log("Found existing user:", user);
  }

  return user;
};
