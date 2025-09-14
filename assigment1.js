/********************************************************************************
* WEB700 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Luis Marquez Student ID: 12986247 Date: 9/14/2025
*
********************************************************************************/

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

var serverMethods = ["GET", "GET", "GET", "POST", "GET", "POST"]
var serverRoutes = ["/", "/store", "/store-admin", "/register", "/developer", "/login"]
var serverResponses = ["Home", "Main Storefront", "Manage Products", "Registered New User", "Developed by: Luis, 12986247", "User Logged In"]

function proccessRequest(method, route) {
    for (let i = 0; i < serverMethods.length; i++) {
        if (method === serverMethods[i] && route === serverRoutes[i]) {
            return "200: " + serverResponses[i]
        }
    }
    return "404: Unable to process " + method + " request for " + route
}
function testRequests() {
    const testMethods = ["GET", "POST"];
    const testRoutes = ["/", "/store", "/store-admin", "/register", "/developer", "/login", "/notFound1", "/notFound2"];

    function randomRequest() {
        const randMethod = testMethods[getRandomInt(testMethods.length)];
        const randRoute = testRoutes[getRandomInt(testRoutes.length)];
        console.log(proccessRequest(randMethod, randRoute));
    }

    setInterval(randomRequest, 1000);
}

testRequests();

