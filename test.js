const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function run() {
    try {
        console.log("========== WorkSync Backend Test ==========\n");

        const username1 = "ayushgopal_" + Date.now();
        const username2 = "shivamsingh_" + Date.now();

        //----------------------------------------
        // Signup
        //----------------------------------------

        console.log("1. Signup Users");

        await axios.post(`${BASE_URL}/signup`, {
            username: username1,
            password: "12345678"
        });

        await axios.post(`${BASE_URL}/signup`, {
            username: username2,
            password: "123456789"
        });

        console.log("✅ Signup Passed\n");

        //----------------------------------------
        // Signin
        //----------------------------------------

        console.log("2. Signin");

        const signin = await axios.post(`${BASE_URL}/signin`, {
            username: username1,
            password: "12345678"
        });

        const token = signin.data.token;

        if (!token) {
            throw new Error("Token not received");
        }

        const headers = {
            token
        };

        console.log("✅ Signin Passed\n");

        //----------------------------------------
        // Create Organisation
        //----------------------------------------

        console.log("3. Create Organisation");

        const org = await axios.post(
            `${BASE_URL}/organisation`,
            {
                title: "WorkSync",
                description: "Testing Backend"
            },
            { headers }
        );

        const organisationId = org.data.id;

        if (!organisationId) {
            throw new Error("Organisation ID missing");
        }

        console.log("Organisation ID :", organisationId);
        console.log("✅ Organisation Created\n");

        //----------------------------------------
        // Add Member
        //----------------------------------------

        console.log("4. Add Member");

        await axios.post(
            `${BASE_URL}/add-member-to-organisation`,
            {
                organisationId,
                memberUserUsername: username2
            },
            { headers }
        );

        console.log("✅ Member Added\n");

        //----------------------------------------
        // Verify Members
        //----------------------------------------

        console.log("5. Verify Members");

        const members = await axios.get(
            `${BASE_URL}/members?organisationId=${organisationId}`,
            { headers }
        );

        console.log(members.data);

        //----------------------------------------
        // Create Board
        //----------------------------------------

        console.log("\n6. Create Board");

        const board = await axios.post(
            `${BASE_URL}/board`,
            {
                organisationId,
                title: "Frontend"
            },
            { headers }
        );

        const boardId = board.data.id;

        if (!boardId) {
            throw new Error("Board ID missing");
        }

        console.log("Board ID :", boardId);
        console.log("✅ Board Created\n");

        //----------------------------------------
        // Verify Boards
        //----------------------------------------

        console.log("7. Verify Boards");

        const boards = await axios.get(
            `${BASE_URL}/boards?organisationId=${organisationId}`,
            { headers }
        );

        console.log(boards.data);

        //----------------------------------------
        // Create Issue
        //----------------------------------------

        console.log("\n8. Create Issue");

        const issue = await axios.post(
            `${BASE_URL}/issues`,
            {
                boardId,
                title: "Dark Mode",
                description: "Implement Dark Mode",
                status: "Todo"
            },
            { headers }
        );

        const issueId = issue.data.id;

        if (!issueId) {
            throw new Error("Issue ID missing");
        }

        console.log("Issue ID :", issueId);
        console.log("✅ Issue Created\n");

        //----------------------------------------
        // Verify Issues
        //----------------------------------------

        console.log("9. Verify Issues");

        let issues = await axios.get(
            `${BASE_URL}/issues?boardId=${boardId}`,
            { headers }
        );

        console.log(issues.data);

        //----------------------------------------
        // Update Issue
        //----------------------------------------

        console.log("\n10. Update Issue");

        await axios.put(
            `${BASE_URL}/issues`,
            {
                issueId,
                status: "Done"
            },
            { headers }
        );

        console.log("✅ Issue Updated");

        //----------------------------------------
        // Verify Updated Issue
        //----------------------------------------

        console.log("\n11. Verify Issue Status");

        issues = await axios.get(
            `${BASE_URL}/issues?boardId=${boardId}`,
            { headers }
        );

        console.log(issues.data);

        //----------------------------------------
        // Delete Member
        //----------------------------------------

        console.log("\n12. Delete Member");

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

        //----------------------------------------
        // Verify Member Deleted
        //----------------------------------------

        console.log("\n13. Verify Members");

        const membersAfterDelete = await axios.get(
            `${BASE_URL}/members?organisationId=${organisationId}`,
            { headers }
        );

        console.log(membersAfterDelete.data);

        //----------------------------------------
        // Fetch Organisation
        //----------------------------------------

        console.log("\n14. Fetch Organisation");

        const organisation = await axios.get(
            `${BASE_URL}/organisation?organisationId=${organisationId}`,
            { headers }
        );

        console.log(organisation.data);

        console.log("\n=======================================");
        console.log("🎉 ALL API TESTS PASSED SUCCESSFULLY");
        console.log("🚀 Backend is Ready for Frontend");
        console.log("=======================================");

    } catch (err) {

        console.log("\n=======================================");
        console.log("❌ TEST FAILED");
        console.log("=======================================\n");

        if (err.response) {
            console.log("Status :", err.response.status);
            console.log(err.response.data);
        } else {
            console.log(err.message);
        }
    }
}

run();