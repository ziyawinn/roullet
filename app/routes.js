const { db } = require('./models/user');

module.exports = setupRoutes;

const defaultInfo = {
  wins: 0,
  losses: 0,
  casinoBank: 10000
}

function setupRoutes(app, passport) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)

  app.get('/', async (req, res) => {
    const cookie = req.cookies.rouletteUserSessionId;

    if (!cookie) {
      const random = Math.random()
      res.cookie('rouletteUserSessionId', random);
    }

    const info = await db.collection("casinoCollection").findOne({ userSessionId: cookie, })

    console.log(info || defaultInfo)
    res.render('index.ejs', info || defaultInfo);
  });

  app.get('/staff', isLoggedIn, function (req, res) {
    db.collection("casinoCollection").find().toArray()
      .then(result => {
        console.log(result)
        res.render("staff.ejs", {
          casinoCollection: result
        });
      })
  });

  // app.get("/feelings", isLoggedIn, async function (req, res) {
  //   const moodData = req.user.moodData;
  //   res.json(moodData);
  // });

  // GAME ================================
  // app.post("/play", (req, res) => {
  //   const cookie = req.cookies.rouletteUserSessionId;

  //   db.collection("casinoCollection").updateMany(
  //     {
  //       userSessionId: cookie,
  //       wins: req.body.wins,
  //       losses: req.body.losses,
  //       casinoBank: req.body.casinoBank
  //     },
  //     (err, result) => {
  //       if (err) return console.log(err);
  //       console.log("saved to database");
  //       res.redirect("/");
  //     }
  //   );
  // })

  app.put('/play', (req, res) => {
    const cookie = req.cookies.rouletteUserSessionId;

    db.collection("casinoCollection").updateMany(
      { userSessionId: cookie, },
      {
        $set: {
          userSessionId: cookie,
          wins: req.body.wins,
          losses: req.body.losses,
          casinoBank: req.body.casinoBank,
        },
      },
      { upsert: true },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  })

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });


  //  =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/staff', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));



  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/staff', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}
