exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie');
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  //res.setHeader('Set-Cookie');
  req.session.isLoggedIn = true;
  res.redirect('/');
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err=>{
    console.log(err);
    res.redirect('/');
  })
};