import Order from "../models/Order.js";

const orders = [
  {
    _id: "65c2658db53f820728d0745a",
    user: "65b8e564ea5ce114184ccb96",
    item: [
      {
        _id: "65c26581b53f820728d07456",
        user: "65b8e564ea5ce114184ccb96",
        product: {
          _id: "65a7e45902e12c44f5994454",
          title: "Samsung Galaxy Book",
          description:
            "Samsung Galaxy Book S (2020) Laptop With Intel Lakefield Chip, 8GB of RAM Launched",
          price: 1499,
          discountPercentage: 4.15,
          stockQuantity: 50,
          brand: { _id: "65a7e20102e12c44f59943db", name: "Samsung" },
          category: "65a7e24602e12c44f599442d",
          thumbnail: "https://cdn.dummyjson.com/product-images/7/thumbnail.jpg",
          images: [
            "https://cdn.dummyjson.com/product-images/7/1.jpg",
            "https://cdn.dummyjson.com/product-images/7/2.jpg",
            "https://cdn.dummyjson.com/product-images/7/3.jpg",
            "https://cdn.dummyjson.com/product-images/7/thumbnail.jpg",
          ],
          isDeleted: false,
          updatedAt: "2024-02-05T09:34:30.107Z",
        },
        quantity: 1,
      },
    ],
    address: [
      {
        _id: "65c26398e1e1a2106ac8fbd5",
        user: "65b8e564ea5ce114184ccb96",
        street: "main 11th",
        city: "Indrapuram",
        state: "Uttar Pradesh",
        phoneNumber: "9452571272",
        postalCode: "201012",
        country: "India",
        type: "Home",
        __v: 0,
      },
    ],
    status: "Pending",
    paymentMode: "CARD",
    total: 1509.55,
    createdAt: "2024-02-07T10:36:15.151Z",
  },
  // ... Other orders remain the same
];

export const seedOrder = async () => {
  try {
    await Order.insertMany(orders);
    console.log("Orders seeded successfully ✅");
  } catch (error) {
    console.error("Error seeding orders:", error);
  }
};
