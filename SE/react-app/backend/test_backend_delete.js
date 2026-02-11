const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:5000/api';

async function testDelete() {
    let log = '';
    const logMsg = (msg) => {
        console.log(msg);
        log += msg + '\n';
    };

    try {
        logMsg('--- Starting Delete Test ---');

        // 1. Login
        logMsg('1. Logging in as admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        const token = loginRes.data.token;
        logMsg('   Login successful. Token received.');

        // 2. Create Dummy Course
        const dummyId = 'test_course_' + Date.now();
        logMsg(`2. Creating dummy course with ID: ${dummyId}...`);
        const createRes = await axios.post(`${API_URL}/courses`, {
            id: dummyId,
            title: 'Delete Me',
            description: 'Test course for deletion',
            totalModules: 1
        }, {
            headers: { 'x-auth-token': token }
        });
        logMsg('   Course created successfully.');
        const createdCourseId = createRes.data.id;
        // Note: backend returns the course object. createRes.data.id should be the custom string ID or ._id depending on what we saved.
        // Our schema has 'id' field, so it should be there.
        logMsg(`   Created Course custom ID: ${createdCourseId}`);

        // 3. Delete Course
        logMsg(`3. Deleting course with ID: ${createdCourseId}...`);
        try {
            const deleteRes = await axios.delete(`${API_URL}/courses/${createdCourseId}`, {
                headers: { 'x-auth-token': token }
            });
            logMsg(`   Delete response status: ${deleteRes.status}`);
            logMsg(`   Delete response data: ${JSON.stringify(deleteRes.data)}`);
        } catch (delErr) {
            logMsg(`   !!! Delete request failed: ${delErr.message}`);
            if (delErr.response) {
                logMsg(`   Status: ${delErr.response.status}`);
                logMsg(`   Data: ${JSON.stringify(delErr.response.data)}`);
            }
        }

        logMsg('--- Test Complete ---');
        fs.writeFileSync('backend_test.log', log);

    } catch (err) {
        logMsg(`!!! Test Failed: ${err.message}`);
        if (err.response) {
            logMsg(`   Status: ${err.response.status}`);
            logMsg(`   Data: ${JSON.stringify(err.response.data)}`);
        }
        fs.writeFileSync('backend_test.log', log);
    }
}

testDelete();
