import Address from "../models/Address.js";

const addresses = [
  {
    _id: "65c26398e1e1a2106ac8fbd5",
    user: "65b8e564ea5ce114184ccb96",
    street: "Street No. 11, Model Town",
    city: "Lahore",
    state: "Punjab",
    phoneNumber: "03001234567",
    postalCode: "54000",
    country: "Pakistan",
    type: "Home",
    __v: 0,
  },
  {
    _id: "65c26412e1e1a2106ac8fbd8",
    user: "65b8e564ea5ce114184ccb96",
    street: "Shahrah-e-Faisal, Block A",
    city: "Karachi",
    state: "Sindh",
    phoneNumber: "03111234567",
    postalCode: "75500",
    country: "Pakistan",
    type: "Business",
    __v: 0,
  },
];

export const seedAddress = async () => {
  try {
    await Address.insertMany(addresses);
    console.log("✅ Address seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding addresses:", error);
  }
};
