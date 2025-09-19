import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('../.env') });
import { seedBrands } from "./Brand.js";
import { seedCategory } from "./Category.js";
import { seedProduct } from "./Product.js";
import { seedUser } from "./User.js";
import { seedAddress } from "./Address.js";
import { seedWishlist } from "./Wishlist.js";
import { seedCart } from "./Cart.js";
import { seedReview } from "./Review.js";
import { seedOrder } from "./Order.js";
import { connectToDB } from "../database/db.js";

const seedData = async () => {
  try {
    await connectToDB();
    console.log("Seed [started] please wait...");

    await seedBrands();
    await seedCategory();
    await seedProduct();
    await seedUser();
    await seedAddress();
    await seedWishlist();
    await seedCart();
    await seedReview();
    await seedOrder();

    console.log("Seed completed ✅");
  } catch (error) {
    console.error("Error during seeding ❌:", error);
  }
};

seedData();
