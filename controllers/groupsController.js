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

  // De user object die aan de request wordt vast gemaakt komt van de verifyuser middleware. 
  // Als de frontend een request maakt naar deze functie gaat ie eerst langs de verify 
  //user middleware die de token uit de localstorage gebruikt om de gebruiker informatie op te halen
  const {id, name, email, verified} = req.user
  try {
    // check of de verified en id een "truthfull" waarde hebben (verfied moet true zijn en id alles behalve null)
    if (!verified || !id) return next(createError(403, "Verifique  su cuenta"));
    // req.body zijn waardes die meegegeven worden via post request door de frontend (formulier)
    const { groupId, newUserId } = req.body;
    // zet role speficiek in een let variable zodat deze mogelijk aangepast kan worden
    let role = req.body.role
    // Als de frontend geen newUserId heeft meegegeven kunnen we niet verder met het verwerken en wordt error gestuurd
    if(!newUserId) return next(createError(403, "Falta de valor"));
    // Role moet member of coordinator zijn. Als role niks is verschaft nu default naar member.
    role = ['Member', 'Coordinator'].includes(role) ? role : 'Member';
    // Check of de gene die dit verzoek maakt coordinator is van de desbetreffende groep
    // (door de verifyuser middleware hebben we de userId uit de token gehaald)
    const roleCheck = await GroupMember.findOne({
      userId: id,
      groupId,
      role: "Coordinator",
    });
    // als er geen match is gevonden voor een id die en groepsid die de role coordinator heeft krijgen we weer een error
    if (!roleCheck) return next(createError(403, "Acceso denegado"));
    // als de new user Id als in de groupsmember model staat van de desbetreffende groep ook errortje.
    const isAlreadyMember = await GroupMember.findOne({
      userId: newUserId,
      groupId,
    });
    if (isAlreadyMember) {
      return next(createError(400, "El usuario ya es miembro del grupo"));
    }
    // nieuwe member wordt eindelijk gemaakt.
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
    // values van de verifyuser middleware jwz
    const { id, email, verified } = req.user;
    if (!verified || !id) return next(createError(403, "Verify your account"));
    // vind alle groepen van de gebruiker die het verzoek indient(id gekregen via middleware verifyUser)
    const userGroups = await Group.find({ creatorId: id });
    // nu effe checkje of gebruiker niet meer dan 5 groepen heeft aangemaakt (kan weg ligt aan de brander)
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
    //Creert de gebruiker die dit verzoek maakt als groep member en coordinator
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
    // values van de verifyuser middleware jwz
    const {id, verified } = req.user; 
   
    if (!verified || !id) return next(createError(403, "Verifique  su cuenta"));
    // De params van de req object zijn variables die meeworden gegeven in de url.
    // dus in de frontend moet als een gebruiker op een van zijn groepen klikt de groepsId meegegeven worden in de url.
    // Zie routes. De id wordt uit de url gehaald naar hand van wild card bijv: api/groups/:WILDCARD
    const groupId = req.params.id;
    // Check of de aanvragende User id in de desbetreffende group zit
    const isUserInGroup = await GroupMember.findOne({
      groupId,
      id
    });
    if (!isUserInGroup) {
      return next(createError(403, "Usted no esta en este grupo"));
    }
    // De members variable wacht op de resultaat van GroupMember colum, hier in zit groupid, userId en de role. 
    // Via de populate functie worden de waardes van de foreign key userId opgehaald. Daarom in model moet je ref:Users doen voor foreign keys.
    // Nu zit in de members variable de firstName, lastName en email property van users
    const members = await GroupMember
    .find({ groupId })
    .populate('userId', 'firstName lastName email') 
    .exec();
    // Format user gegevens beter for in ons json response
    const userNames = members.map(member => ({
      name: `${member.userId.firstName} ${member.userId.lastName}`,
      email: member.userId.email,
    }));
    // Ook totaal aantal members for als ze dat op de groups pagina willen weergeven.
    const totalMembers = members.length;

    res.status(200).json({ totalMembers, members: userNames });

  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
  } catch (error) {}
};
