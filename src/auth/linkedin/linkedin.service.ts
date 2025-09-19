import { UserEntity, UserProvider } from "@src/entities/user.entity";
import log from "@src/utils/logger";
import { EntityManager } from "typeorm";
import { LinkedInProfile } from "./linkedin.interface";

export class LinkedInAuthService {
  async authenticateOrCreateUser(
    profileData: LinkedInProfile,
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
          provider: UserProvider.LINKEDIN,
          profile_completed: false,
        });
        await tx.save(user);
        log.info("New user registered via LinkedIn");
      } else {
        log.info("Existing user logged in via LinkedIn");
      }

      return user;
    });
  }
}
