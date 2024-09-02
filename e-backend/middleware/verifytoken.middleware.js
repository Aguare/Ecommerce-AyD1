const controller = {};

controller.verifyToken = (req, res, next) => {
    next();
};

module.exports = controller;