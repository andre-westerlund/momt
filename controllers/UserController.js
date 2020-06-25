var UserModel = require('../models/UserModel.js');

/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
module.exports = {

    /**
     * UserController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, Users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            return res.json(Users);
        });
    },

    /**
     * UserController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        UserModel.findOne({_id: id}, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }
            return res.json(User);
        });
    },

    /**
     * UserController.create()
     */
    create: function (req, res) {
        var User = new UserModel({
			firstName : req.body.firstName,
			lastName : req.body.lastName,
            email : req.body.email,
            isAdmin: req.body.isAdmin
        });

        UserModel.register(User, req.body.password, (err, registeredUser) => {
            if(err || !registeredUser){
                res.status(500).json({message:"There was an error creating the User", error: err})
            }else{
                 res.status(200).json(registeredUser._id);
            }
        });
    },

    /**
     * UserController.update()
     */
    update: async function (req, res) {
        var id = req.params.id;
        UserModel.findOne({_id: id}, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User',
                    error: err
                });
            }
            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }

            User.firstName = req.body.firstName ? req.body.firstName : User.firstName;
			User.lastName = req.body.lastName ? req.body.lastName : User.lastName;
            User.email = req.body.email ? req.body.email : User.email;
			
            User.save(function (err, SavedUser) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating User.',
                        error: err
                    });
                }
                if(req.body.password != null && req.body.password != ""){
                    SavedUser.setPassword(req.body.password, function(){
                    SavedUser.save();
                    });
                }

                return res.json(SavedUser);
            });
        });
    },

    /**
     * UserController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        UserModel.findByIdAndRemove(id, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the User.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

     /**
     * UserController.login()
     */
    login: function (req, res,next) {
        res.render("index", { title: "Index"});
    },
         /**
     * UserController.login()
     */
    logout: function (req, res) {
        req.logout();
        res.redirect("/login");
    }
};
