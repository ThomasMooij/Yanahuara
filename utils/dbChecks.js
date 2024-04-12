import GroupMember from "../models/groupMembersModel.js";

export const isCoordinator = async (userId, groupId) => {
  const coordinator = await GroupMember.findOne({
    userId,
    groupId,
    role: 'Coordinator'
  });
  return !!coordinator; 
};

export const isInGroup = async (userId, groupId) => {
    const isUserInGroup = await GroupMember.findOne({
            groupId,
            userId
          });
      return !!isUserInGroup;
    };
    