const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function run() {
  try {
    console.log("🚀 Starting WorkSync Tests\n");

    // Signup Ayush
    await axios.post(`${BASE_URL}/signup`, {
      username: "ayush",
      password: "123"
    });
    console.log("✅ Ayush Signup");

    // Signup Rahul
    await axios.post(`${BASE_URL}/signup`, {
      username: "rahul",
      password: "123"
    });
    console.log("✅ Rahul Signup");

    // Signin Ayush
    const signinRes = await axios.post(`${BASE_URL}/signin`, {
      username: "ayush",
      password: "123"
    });

    const token = signinRes.data.token;
    console.log("✅ Ayush Signin");

    const headers = {
      token
    };

    // Create Organisation
    const orgRes = await axios.post(
      `${BASE_URL}/organisation`,
      {
        title: "Zomato",
        description: "Food Delivery"
      },
      { headers }
    );

    const organisationId = orgRes.data.id;
    console.log("✅ Organisation Created");

    // Add Rahul
    await axios.post(
      `${BASE_URL}/add-member-to-organisation`,
      {
        organisationId,
        memberUserUsername: "rahul"
      },
      { headers }
    );

    console.log("✅ Member Added");

    // Create Board
    const boardRes = await axios.post(
      `${BASE_URL}/board`,
      {
        organisationId,
        title: "Frontend"
      },
      { headers }
    );

    const boardId = boardRes.data.id;
    console.log("✅ Board Created");

    // Create Issue
    await axios.post(
      `${BASE_URL}/issues`,
      {
        boardId,
        title: "Dark Mode",
        description: "Implement dark mode",
        status: "todo"
      },
      { headers }
    );

    console.log("✅ Issue Created");

    // Get Boards
    const boards = await axios.get(
      `${BASE_URL}/boards?organisationId=${organisationId}`,
      { headers }
    );

    console.log("✅ Boards Fetched");
    console.log(boards.data);

    // Get Issues
    const issues = await axios.get(
      `${BASE_URL}/issues?boardId=${boardId}`,
      { headers }
    );

    console.log("✅ Issues Fetched");
    console.log(issues.data);

    // Get Members
    const members = await axios.get(
      `${BASE_URL}/members?organisationId=${organisationId}`,
      { headers }
    );

    console.log("✅ Members Fetched");
    console.log(members.data);

    // Update Issue
    await axios.put(
      `${BASE_URL}/issues`,
      {
        issueId: 1,
        status: "done"
      },
      { headers }
    );

    console.log("✅ Issue Updated");

    console.log("\n🎉 ALL TESTS PASSED");
  } catch (err) {
    console.error("\n❌ TEST FAILED");
    console.error(
      err.response?.data || err.message
    );
  }
}

run();