const mongoose = require('mongoose');
const { MONGO_URI, MONGO_ID, MONGO_PW } = process.env;

export default async () => {
  await mongoose.connect(MONGO_URI, {
    authSource: 'admin',
    user: MONGO_ID,
    pass: MONGO_PW,
    useNewUrlParser: true,
  });
};
