import GroupMember from "../models/groupMembersModel.js";

export const isInGroup = async (userId, groupId) => {
const isUserInGroup = await GroupMember.findOne({
        groupId,
        userId
      });
  return !!isUserInGroup;
};
