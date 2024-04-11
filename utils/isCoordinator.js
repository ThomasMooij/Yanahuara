import GroupMember from "../models/groupMembersModel.js";

export const isCoordinator = async (userId, groupId) => {
  const coordinator = await GroupMember.findOne({
    userId,
    groupId,
    role: 'Coordinator'
  });
  return !!coordinator; 
};
