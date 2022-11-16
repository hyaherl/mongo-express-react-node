import { NextFunction, Request, Response, Router } from 'express';
import { User } from '../model/User';

const router = Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

router.post('/signUp', async (req: Request, res: Response, next: NextFunction) => {
  console.log('post: /api/user/signUp', req.params, req.query, req.body);
  try {
    const { email, password, nickname } = req.body;

    const saltRounds = 10;
    const encryptPassword: string = bcrypt.hashSync(password, saltRounds);

    const isExist = await User.findUserByEmail(email);
    if (isExist) return res.status(400).json({ success: false, message: 'Email is already exists.' });

    const user = await User.create(email, encryptPassword, nickname);

    return res.status(200).json({ success: true, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/login', async (req: any, res: Response, next: NextFunction) => {
  console.log('post: /api/user/login', req.params, req.query, req.body);
  try {
    passport.authenticate('local', { session: false }, (err, user, done) => {
      if (err || !user) {
        console.log(done.message);
        return res.status(401).json({ success: false, message: done.message }).end();
      }
      req.login(user, { session: false }, err => {
        if (err) {
          console.log(err);
          return next(err);
        }
        const token = jwt.sign(
          {
            email: user.email,
          },
          SECRET,
          { expiresIn: '7d' }, // The token expiration time.
        );
        console.log(user.nickname + ' is Logged In !!');
        return res.status(200).json({ success: true, token: 'Bearer ' + token });
      });
    })(req, res);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

export default router;
