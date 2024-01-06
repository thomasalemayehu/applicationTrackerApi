const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required to register"],
    },
    userName: {
      type: String,
      unique: [true, "Username already in use"],
      required: [true, "username is required to register"],
      validate: /^[a-zA-Z]{3,}$/,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already in use"],
      validate: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    },
  },
  {
    timestamps: true,
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();

        delete ret._id;
        delete ret.password;
        delete ret.__v;

        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
