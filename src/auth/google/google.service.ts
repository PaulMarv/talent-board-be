import { UserEntity, UserProvider } from "@src/entities/user.entity";
import log from "@src/utils/logger";
import { EntityManager } from "typeorm";
import { GoogleProfile } from "./google.interface";

export class GoogleAuthService {
  async authenticateOrCreateUser(
    profileData: GoogleProfile,
    entityManager: EntityManager,
  ): Promise<UserEntity> {
    const { email } = profileData;

    return await entityManager.transaction(async (tx) => {
      let user = await tx.findOne(UserEntity, {
        where: { email },
      });

      if (!user) {
        user = tx.create(UserEntity, {
          ...profileData,
          provider: UserProvider.GOOGLE,
          profile_completed: false,
        });
        await tx.save(user);
        log.info("New user registered via Google");
      } else {
        log.info("Existing user logged in via Google");
      }

      return user;
    });
  }
}
