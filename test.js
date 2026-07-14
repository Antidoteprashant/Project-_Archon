let usersData = {};
let email = "test@test.com";
usersData[email] = { dashboard: { balance: "$100" } };

let currentUserEmail = email;
let userData = usersData[currentUserEmail];

if (!userData.trades) userData.trades = [];
userData.trades.unshift({ id: 1, status: 'Active' });

usersData[currentUserEmail] = userData;
let json = JSON.stringify(usersData);
console.log(json);
