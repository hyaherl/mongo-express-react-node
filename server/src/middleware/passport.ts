import { User } from '../model/User';

const passport = require('passport');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');
const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const LocalStrategy = require('passport-local').Strategy;
const SECRET = process.env.SECRET;

// login
const LocalStrategyOption = {
  usernameField: 'email',
  passwordField: 'password',
};
const localVerify = async (email, password, done) => {
  try {
    const user = await User.findUserByEmail(email);
    if (!user) return done(null, false, { message: `This Id doesn't exist.` });

    const checkPassword = await bcrypt.compareSync(password, user.password);
    if (!checkPassword) return done(null, false, { message: 'The Password is wrong.' });

    return done(null, user);
  } catch (e) {
    console.error(e);
    return done(e);
  }
};

// jwt
const jwtStrategyOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};
const jwtVerift = async (payload, done) => {
  try {
    const user = await User.findUserByEmail(payload.email);
    if (!user) return done(null, false);

    return done(null, user);
  } catch (e) {
    console.error(e);
    return done(e);
  }
};

module.exports = () => {
  passport.use(new LocalStrategy(LocalStrategyOption, localVerify));
  passport.use(new JWTStrategy(jwtStrategyOption, jwtVerift));
};
