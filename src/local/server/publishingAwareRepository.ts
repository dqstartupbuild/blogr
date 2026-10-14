import type { LocalWorkspaceRepository } from "../application/LocalWorkspaceRepository";
import { fileLocalWorkspaceRepository } from "./fileLocalWorkspaceRepository";
import { withPublishingAvailability } from "./withPublishingAvailability";

export const publishingAwareRepository: LocalWorkspaceRepository = {
  ...fileLocalWorkspaceRepository,
  read: async () => withPublishingAvailability(await fileLocalWorkspaceRepository.read()),
};
