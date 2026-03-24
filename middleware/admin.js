module.exports = (req, res, next) => {
if (!req.utilisateur?.is_admin) {
return res.status(403).json({ message: 'Acces refuse - Admin requis' });
}
next();
};