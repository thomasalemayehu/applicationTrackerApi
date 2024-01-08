import { faker } from "@faker-js/faker";
import JobApplication from "../src/models/JobApplication.js";
import mongoose from "mongoose";
import User from "../src/models/User.js";
const uri = "mongodb://localhost:27017/JobTracker";

// Connect to MongoDB
await mongoose.connect(uri, { autoIndex: false });
console.log("Successfully Connected to mongodb...");

const users = [
  {
    fullName: "Thomas Mechessa",
    email: "thomas2alexmech@gmail.com",
    password: "StrongPass@@1234",
  },
  {
    fullName: "Jane Doe",
    email: "janedoe@gmail.com",
    password: "StrongPass@@123",
  },
  {
    fullName: "John Doe",
    email: "johndoe@gmail.com",
    password: "StrongPass@@12345",
  },
];

function capitalizeString(str) {
  if (!str) return str; // Check if the string is not empty or undefined
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function getStatus(val) {
  const mapper = {
    1: "Tracking",
    2: "Applied",
    3: "Phone Screen",
    4: "Interview",
    5: "Offer",
    6: "Accepted",
    7: "Rejected",
  };

  return mapper[val];
}
function getFollowUp(val) {
  const mapper = {
    1: "None",
    2: "Research",
    3: "Website Follow Up",
    4: "Linkedin Follow Up",
    5: "Email",
    6: "Multiple Emails",
    7: "Phone",
  };

  return mapper[val];
}
const generateApplication = () => {
  const statusInt = faker.number.int({
    min: 1,
    max: 7,
  });

  const followUpInt = faker.number.int({
    min: 1,
    max: 7,
  });
  return {
    company: capitalizeString(faker.company.buzzNoun()),
    position: faker.person.jobTitle(),
    payRange: `${faker.number.int({
      min: 120,
      max: 170,
    })}K - ${faker.number.int({
      min: 170,
      max: 220,
    })}K`,
    location: `${faker.location.city()},${faker.location.state()}`,
    jobDescription: faker.lorem.paragraph({ min: 5, max: 16 }),
    remark: faker.lorem.sentence(2),
    status: getStatus(statusInt),
    followUp: getFollowUp(followUpInt),
  };
};

const populateDatabase = async (numberOfApplications) => {
  console.log("Adding Applications...");
  for (let i = 0; i < users.length; i++) {
    const userInfo = await User.create(users[i]);

    for (let i = 0; i < numberOfApplications; i++) {
      const applicationInfo = generateApplication();
      await JobApplication.create({ ...applicationInfo, userId: userInfo._id });
    }
    console.log(
      `${numberOfApplications} applications have been added to the database.`
    );
  }
};

populateDatabase(100)
  .then(() => {
    console.log("Complete");
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => mongoose.disconnect());
