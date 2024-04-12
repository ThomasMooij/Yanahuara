import createError from "@/utils/createError";
import Group from "@/models/groupsModel.js";
import GroupMember from "@/models/groupMembersModel";
import Geolocation from "@/models/geolocationModel";

export const getMemberLocation = async (req, res, next) => {
  try {
    const { groupId, requestedMemberId } = req.params;

    if (!req.isVerified || !req.userId) {
      return next(createError(403, "Verify your account"));
    }
    const isCoordinator = await GroupMember.findOne({
      userId: req.userId,
      groupId,
      role: 'Coordinator'
    });

    if (!isCoordinator) {
      return next(createError(403, "You are not authorized to view member locations"));
    }

  } catch (error) {
    next(createError(500, "Server error while fetching member locations"));
  }
};
