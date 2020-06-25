exports.isAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect("/login");
}

exports.isAdmin = (req,res,next) => {
    if(req.isAuthenticated() && req.user.isAdmin){
        return next();
    }
    return res.redirect("/");
}