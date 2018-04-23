const premiumPage = (req, res) => {
  res.render('premium', { csrfToken: req.csrfToken() });
};

module.exports.premiumPage = premiumPage;