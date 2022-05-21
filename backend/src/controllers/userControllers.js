const User = require("../models/User");

const userController = {
    getAllUser: async(req,res) => {
        try { 
            const user = await User.find();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
            
        }
    },

    //Delete user
    deleteUser: async(req,res,next) => {
        try {
            User.findByIdAndDelete(req.params.id)
			.then(() => res.redirect("back"))
			.catch(next);
            res.status(200).json("Delete successfully")
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = userController;