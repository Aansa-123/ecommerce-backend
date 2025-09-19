import User from "../models/User.js";

const users = [
  {
    _id: "68b7e3f4d4a66563a442fc15",
    name: "Aansa Rani",
    email: "aansarana786@gmail.com",
    password:'Aansa.123',
    isVerified: true,
    isAdmin: true,
    isSuperAdmin: true,
    __v: 0,
  },
  {
    _id: "65c2526fdcd9253acfbaa731",
    name: "rishibakshi",
    email: "demo2@gmail.com",
    password: '$2a$10$tosjkprqtomSah0VJNyKi.TIv1JU65pl1i1IJ6wUttjYw.ENF99jG',
    isVerified: true,
    isAdmin: false,
    __v: 0,
  },
];


export const seedUser = async () => {
  try {
    await User.insertMany(users);
    console.log("User seeded successfully");
  } catch (error) {
    console.log(error);
  }
};