import { faker } from "@faker-js/faker";
import JobApplication from "./src/models/JobApplication.js";
import mongoose from "mongoose";

const uri = "mongodb://localhost:27017/JobTracker";

// Connect to MongoDB
mongoose
  .connect(uri, { autoIndex: false })
  .then(() => {
    console.log("MongoDB connection established");
    populateDatabase(5000)
      .then(() => {
        console.log("Complete");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        mongoose.disconnect();
      });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
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

// Function to populate the database
const populateDatabase = async (numberOfApplications) => {
  console.log("Adding Applications...");
  for (let i = 0; i < numberOfApplications; i++) {
    const applicationInfo = generateApplication();
    await JobApplication.create(applicationInfo);
  }
  console.log(
    `${numberOfApplications} applications have been added to the database.`
  );
};
