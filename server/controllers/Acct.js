const AcctPage = (req, res) => {
  res.render('acct', { csrfToken: req.csrfToken() });
};

module.exports.AcctPage = AcctPage;