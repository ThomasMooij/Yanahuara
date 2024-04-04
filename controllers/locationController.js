import createError from "@/utils/createError";
import Group from "@/models/groupsModel.js";
import GroupMember from "@/models/groupMembersModel";
import Geolocation from "@/models/geolocationModel";

export const getMembersLocations = async (req, res, next) => {
  try {
    const { groupId } = req.params;

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

    const members = await GroupMember.find({ groupId }).select('userId -_id');

    const userIds = members.map(member => member.userId);

    const locations = await Geolocation.find({
      'userId': { $in: userIds }
    }).populate('userId', 'firstName lastName'); 

    res.status(200).json(locations);

  } catch (error) {
    next(createError(500, "Server error while fetching member locations"));
  }
};
