import User from '../models/usersModel.js'

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

  export const getCurrentUser = async (req,res) => {
    try{
      
      const {id} = req.user

      const currentUser = await User.find(id);

      res.status(201).json(currentUser)

    }catch({message}){
      throw new Error('Error getting users by id:' + message)
    }
  };

  export const deleteUser = async (req,res) => {

    const idToBeDeleted = req.params.id

  }