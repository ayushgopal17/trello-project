const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function run() {
    try {
        console.log("🚀 Starting WorkSync Tests...\n");

        const username1 = "ayush_" + Date.now();
        const username2 = "rahul_" + Date.now();

        // Signup Ayush
        await axios.post(`${BASE_URL}/signup`, {
            username: username1,
            password: "123"
        });

        console.log("✅ Ayush Signup");

        // Signup Rahul
        await axios.post(`${BASE_URL}/signup`, {
            username: username2,
            password: "123"
        });

        console.log("✅ Rahul Signup");

        // Signin Ayush
        const signinRes = await axios.post(`${BASE_URL}/signin`, {
            username: username1,
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
                title: "WorkSync",
                description: "Testing Organisation"
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
                memberUserUsername: username2
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
        const issueRes = await axios.post(
            `${BASE_URL}/issues`,
            {
                boardId,
                title: "Dark Mode",
                description: "Implement Dark Mode",
                status: "Todo"
            },
            { headers }
        );

        const issueId = issueRes.data.id;

        console.log("✅ Issue Created");

        // Get Organisation
        const organisation = await axios.get(
            `${BASE_URL}/organisation?organisationId=${organisationId}`,
            { headers }
        );

        console.log("✅ Organisation Fetched");
        console.log(organisation.data);

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
                issueId,
                status: "Done"
            },
            { headers }
        );

        console.log("✅ Issue Updated");

        // Delete Member
        await axios.delete(
            `${BASE_URL}/members`,
            {
                headers,
                data: {
                    organisationId,
                    memberUserUsername: username2
                }
            }
        );

        console.log("✅ Member Deleted");

        console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY 🎉");

    } catch (err) {
        console.log("\n❌ TEST FAILED");

        if (err.response) {
            console.log(err.response.data);
        } else {
            console.log(err.message);
        }
    }
}

run();