module.exports = (req, res, next) => {
    
    const emailTrue = (email) => {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let regexTrue = regex.test(email)
        regexTrue ?
        next() : 
        res.status(200).json({ 
            type:"error", 
            message: 'Ce mail n\'est pas valide' });
    }
    emailTrue(req.body.email)
};