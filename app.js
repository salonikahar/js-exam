
const usersDB = 'usersDB';
const resultsDB = 'resultsDB';

let loggedInUser = null;

function showSignupPage() {
    document.getElementById('signupPage').style.display = 'block';
    document.getElementById('loginPage').style.display = 'none';
}

function showLoginPage() {
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
}

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    if (username && password) {
        const users = JSON.parse(localStorage.getItem(usersDB)) || [];
        const newUser = { username, password }; // In production, hash the password
        users.push(newUser);
        localStorage.setItem(usersDB, JSON.stringify(users));
        alert('Signup successful');
        showLoginPage();
    } else {
        alert('Please fill all fields');
    }
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem(usersDB)) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        loggedInUser = user;
        showScoreboardPage();
    } else {
        alert('Invalid credentials');
    }
});

function showScoreboardPage() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('scoreboardPage').style.display = 'block';
    loadResults();
}

function logout() {
    loggedInUser = null;
    document.getElementById('scoreboardPage').style.display = 'none';
    showLoginPage();
}

document.getElementById('resultForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const studentName = document.getElementById('studentName').value;
    const subject = document.getElementById('subject').value;
    const score = document.getElementById('score').value;
    const date = document.getElementById('date').value;

    if (studentName && subject && score && date) {
        const results = JSON.parse(localStorage.getItem(resultsDB)) || [];
        const newResult = { studentName, subject, score, date, username: loggedInUser.username };
        results.push(newResult);
        localStorage.setItem(resultsDB, JSON.stringify(results));
        loadResults();
    } else {
        alert('Please fill all fields');
    }
});

function loadResults() {
    const results = JSON.parse(localStorage.getItem(resultsDB)) || [];
    const filteredResults = results.filter(result => result.username === loggedInUser.username);
    displayResults(filteredResults);
}

function displayResults(results) {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = ''; 

    results.forEach(result => {
        
        const row = document.createElement('tr');
        
        const studentNameCell = document.createElement('td');
        studentNameCell.textContent = result.studentName;
        
        const subjectCell = document.createElement('td');
        subjectCell.textContent = result.subject;

        const scoreCell = document.createElement('td');
        scoreCell.textContent = result.score;

        const dateCell = document.createElement('td');
        dateCell.textContent = result.date;

        row.appendChild(studentNameCell);
        row.appendChild(subjectCell);
        row.appendChild(scoreCell);
        row.appendChild(dateCell);

        resultsList.appendChild(row);
    });
}

function searchResults() {
    const query = document.getElementById('searchField').value.toLowerCase();
    const results = JSON.parse(localStorage.getItem(resultsDB)) || [];
    const filteredResults = results.filter(result => 
        result.username === loggedInUser.username && 
        (result.studentName.toLowerCase().includes(query) || result.subject.toLowerCase().includes(query))
    );
    displayResults(filteredResults);
}


function filterResults() {
    const selectedSubject = document.getElementById('filterSubject').value;
    const results = JSON.parse(localStorage.getItem(resultsDB)) || [];
    const filteredResults = results.filter(result => 
        result.username === loggedInUser.username && 
        (selectedSubject === '' || result.subject === selectedSubject)
    );
    displayResults(filteredResults);
}

function sortResults(order) {
    const results = JSON.parse(localStorage.getItem(resultsDB)) || [];
    const filteredResults = results.filter(result => result.username === loggedInUser.username);
    filteredResults.sort((a, b) => order === 'asc' ? a.score - b.score : b.score - a.score);
    displayResults(filteredResults);
}


