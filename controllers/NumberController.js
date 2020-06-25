var NumberModel = require('../models/NumberModel.js');

/**
 * NumberController.js
 *
 * @description :: Server-side logic for managing Numbers.
 */
module.exports = {

    /**
     * NumberController.list()
     */
    list: function (req, res) {
        NumberModel.find(function (err, Numbers) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Number.',
                    error: err
                });
            }
            return res.json(Numbers);
        });
    },

    /**
     * NumberController.show()
     */
    show: function (req, res) {
        var number = req.params.number;
        NumberModel.findOne({number: number}, function (err, Number) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Number.',
                    error: err
                });
            }
            if (!Number) {
                return res.status(404).json({
                    message: 'No such Number'
                });
            }
            return res.json(Number);
        });
    },

    /**
     * NumberController.create()
     */
    create: async function (req, res) {
        var digiNum = req.body.number;
        if(digiNum.startsWith("685")){
            digiNum = digiNum.replace(/685[\s]*/g,"");
        }
        var Number = new NumberModel({
			number : digiNum,
			submittedBy : req.user,
			dateAdded : new Date()
        });
        Number.save(async function (err, Number) {
            if (err) {          
                req.flash('msg', err.toString());
                req.flash('status', "danger");
                res.status(401);
                return res.redirect("/");
            }
            req.flash('msg', "Number saved successfully");
            req.flash('status', "success");
            res.status(201);
            return res.redirect("/");
        });
    },


    /**
     * NumberController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        NumberModel.findByIdAndRemove(id, function (err, Number) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Number.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
