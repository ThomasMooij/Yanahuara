import createError from "../utils/createError.js";
import Group from "../models/groupsModel.js";
import { getVersionedTitle } from "../utils/versioning.js";
import GroupMember from "../models/groupMembersModel.js";
import mongoose from "mongoose";

export const getAllGroupsByUserId = async (req, res, next) => {
  try {
    if (!req.isVerified || !req.userId)
      return next(createError(403, "Verifique  su cuenta"));
  } catch (error) {}
};

export const getGroupById = async (req, res, next) => {

  const {id, name, email, role, verified} = req.user

  try {
    if (!verified || !id)
      return next(createError(403, "Verifique  su cuenta"));
  } catch (error) {}
};

export const addUserToGroup = async (req, res, next) => {


  const {id, name, email, verified} = req.user
  try {

    if (!verified || !id) return next(createError(403, "Verifique  su cuenta"));

    const { groupId, newUserId } = req.body;

    let role = req.body.role

    if(!newUserId) return next(createError(403, "Falta de valor"));
    role = ['Member', 'Coordinator'].includes(role) ? role : 'Member';

    const roleCheck = await GroupMember.findOne({
      userId: id,
      groupId,
      role: "Coordinator",
    });
    if (!roleCheck) return next(createError(403, "Acceso denegado"));

    const isAlreadyMember = await GroupMember.findOne({
      userId: newUserId,
      groupId,
    });
    if (isAlreadyMember) {
      return next(createError(400, "El usuario ya es miembro del grupo"));
    }

    const newGroupMember = new GroupMember({
      userId: newUserId,
      groupId,
      role,
    });

    await newGroupMember.save();

    res.status(201).json(newGroupMember);
  } catch (error) {}
};


export const assignUserRole = async (req, res, next) => {
  try {
    if (!req.isVerified || !req.userId)
      return next(createError(403, "Verifique  su cuenta"));
  } catch (error) {}
};

export const createGroup = async (req, res, next) => {
  try {
    const { id, email, verified } = req.user;
    if (!verified || !id) return next(createError(403, "Verify your account"));

    const userGroups = await Group.find({ creatorId: id });

    if (userGroups.length > 5)
      return next(createError(429, "You are only allowed to create 5 groups"));

    const name = req.body.name;
    // IK WIL VERSIONING MAAR WERKT NIET 
    // console.log(Group)
    // const versionedGroupName = await getVersionedTitle(name, Group);
    // console.log(versionedGroupName)

    // console.log(id)

    //Creert nieuwe groep
    const newGroup = new Group({
      name: name,
      creatorId: id,
    });
    await newGroup.save();

    const newMember = new GroupMember({
      userId: id,
      groupId: newGroup._id,
      role: "Coordinator",
    });

    await newMember.save();

    res.status(201).json(newGroup);
  } catch (error) {

  }
};

export const getGroupMembers = async (req, res, next) => {
  try {

    const {id, verified } = req.user; 
   
    if (!verified || !id) return next(createError(403, "Verifique  su cuenta"));

    const groupId = req.params.id;

    const isUserInGroup = await GroupMember.findOne({
      groupId,
      id
    });
    if (!isUserInGroup) {
      return next(createError(403, "Usted no esta en este grupo"));
    }

    const members = await GroupMember
    .find({ groupId })
    .populate('userId', 'firstName lastName email') 
    .exec();

    const userNames = members.map(member => ({
      name: `${member.userId.firstName} ${member.userId.lastName}`,
      email: member.userId.email,
    }));

    const totalMembers = members.length;

    res.status(200).json({ totalMembers, members: userNames });

  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {

    //delete ook uit alle andere documenten. 

  } catch (error) {}
};
