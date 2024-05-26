const jwt = require("jsonwebtoken")
const utilities = require("../utilities")

const checkAuthority = async (req, res, next) => {
  const token  = req.cookies.jwt || null;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      let nav =  await utilities.getNav()
      if (err) {
        req.flash("notice", "Please log in to continue.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
        })
        return
        }

        const accountType = decoded.account_type;

      if (accountType == 'Client') {
        req.flash("notice", "Sorry, you don't have rigths to see the page. Login with another account!")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
        })
      }
    });
};

module.exports = checkAuthority;
