import User from '../models/usersModel'

export const getAllUsers = async () => {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new Error('Fout bij het ophalen van gebruikers: ' + error.message);
    }
};

export const getUserById = async (id) => {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw new Error('Fout bij het ophalen van de gebruiker: '+ id + error.message);
    }
};
export const getUsersById = async (id) => {
    try{
      const users = await User.findById({id})
  
    }catch({message}){
      throw new Error('Error getting users by id:' + message)
    }
};
  