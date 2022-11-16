const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  nickname: { type: String, required: true, maxlength: 100 },
});

userSchema.statics.create = function (email: string, password: string, nickname: string) {
  const user = new User({ email, password, nickname });
  return user.save();
};

userSchema.statics.findUserByEmail = function (email: string) {
  return this.findOne({ email });
};

const User = mongoose.model('User', userSchema);

export { User };
