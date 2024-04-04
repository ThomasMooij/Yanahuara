import createError from "../utils/createError.js";
import Group from "../models/groupsModel.js";
import { getVersionedTitle } from "../utils/versioning.js";
import GroupMember from "../models/groupMembersModel.js";
import mongoose from "mongoose";

export const getAllUserGroups = async (req, res, next) => {
  try {
    if (!req.isVerified || !req.userId)
      return next(createError(403, "Verifica su cuenta"));
  } catch (error) {}
};

export const getGroupById = async (req, res, next) => {
  try {
    if (!req.isVerified || !req.userId)
      return next(createError(403, "Verifica su cuenta"));
  } catch (error) {}
};

export const addUserToGroup = async (req, res, next) => {
  try {
    if (!req.isVerified || !req.userId)
      return next(createError(403, "Verifica su cuenta"));

    const { groupId, newUserId, role } = req.body;

    const roleCheck = await GroupMember.findOne({
      userId: req.userId,
      groupId,
      role: "Coordinator",
    });
    if (!roleCheck) return next(createError(403, "Acceso denegado"));

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
      return next(createError(403, "Verifica su cuenta"));
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

    // console.log(Group)
    // const versionedGroupName = await getVersionedTitle(name, Group);
    // console.log(versionedGroupName)

    // console.log(id)

    const newGroup = new Group({
      name: name,
      creatorId: id,
    });

    await newGroup.save();

    console.log(newGroup);

    const newMember = new GroupMember({
      userId: id,
      groupId: newGroup._id,
      role: "Coordinator",
    });

    await newMember.save();

    res.status(201).json(newGroup);
  } catch (error) {}
};
export const getGroupMembers = async (req, res, next) => {
  try {
    if (!req.isVerified || !req.userId)
      return next(createError(403, "Verify your account"));
  } catch (error) {}
};

export const deleteGroup = async (req, res, next) => {
  try {
  } catch (error) {}
};
