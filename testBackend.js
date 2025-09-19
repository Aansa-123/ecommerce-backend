import axios from "axios";

const BASE = "http://localhost:3000";

async function testAPI() {
  try {
    // Root
    let res = await axios.get(`${BASE}/`);
    console.log("Root:", res.data);

    // Test brands
    res = await axios.get(`${BASE}/brands`);
    console.log("Brands:", res.data);

    // Test signup
    res = await axios.post(`${BASE}/auth/signup`, {
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });
    console.log("Signup:", res.data);

    // Test login
    res = await axios.post(`${BASE}/auth/login`, {
      email: "test@example.com",
      password: "123456",
    });
    console.log("Login:", res.data);

    // Test products
    res = await axios.get(`${BASE}/products`);
    console.log("Products:", res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

testAPI();
