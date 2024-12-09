// Simulating a database
let users = [];
let currentUser = null;

// Helper Functions
const getCurrentUser = () => {
    const user = sessionStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
};

const saveCurrentUser = (user) => {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
};

const updateUserTasks = () => {
    const userIndex = users.findIndex(user => user.username === currentUser.username);
    if (userIndex >= 0) {
        users[userIndex] = currentUser;
    }
};

// User Authentication
function registerUser(username, password, userType) {
    if (users.find(user => user.username === username)) {
        swal("Error", "User already exists!", "error");
        return;
    }
    const newUser = { username, password, userType, tasks: [] };
    users.push(newUser);
    swal("Success", "Registration successful!", "success");
}

function loginUser(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        swal("Error", "Invalid credentials!", "error");
        return;
    }
    currentUser = user;
    saveCurrentUser(user);
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("home-section").style.display = "block";
    loadUserData();
    swal("Success", "Login successful!", "success");
}

function logoutUser() {
    sessionStorage.removeItem("currentUser");
    currentUser = null;
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("home-section").style.display = "none";
}

// Load User Data
function loadUserData() {
    document.getElementById("name").textContent = currentUser.username;
    document.getElementById("email").textContent = currentUser.userType.toUpperCase() + " User";
    renderTasks();
}

// Task Management
function addTask() {
    const title = document.getElementById("todo").value;
    const dueDate = document.getElementById("duedate").value;
    const category = document.getElementById("task-category").value;

    if (!title || !dueDate) {
        swal("Error", "Please fill in all task details!", "error");
        return;
    }

    const newTask = {
        title,
        dueDate,
        category,
        completed: false
    };

    currentUser.tasks.push(newTask);
    updateUserTasks();
    saveCurrentUser(currentUser);
    renderTasks();
    swal("Success", "Task added successfully!", "success");
}

function toggleTaskCompletion(index) {
    currentUser.tasks[index].completed = !currentUser.tasks[index].completed;
    updateUserTasks();
    saveCurrentUser(currentUser);
    renderTasks();
}

function deleteTask(index) {
    currentUser.tasks.splice(index, 1);
    updateUserTasks();
    saveCurrentUser(currentUser);
    renderTasks();
}

function renderTasks(filter = "all") {
    const taskContainer = document.getElementById("TaskContainer");
    taskContainer.innerHTML = "";

    let tasksToShow = currentUser.tasks;

    if (filter === "completed") {
        tasksToShow = tasksToShow.filter(task => task.completed);
    } else if (filter === "uncompleted") {
        tasksToShow = tasksToShow.filter(task => !task.completed);
    }

    tasksToShow.forEach((task, index) => {
        const taskCard = document.createElement("div");
        taskCard.className = "card align";
        taskCard.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskCompletion(${index})">
            <div class="marker">
                <span>${task.title}</span>
                <p class="date">${task.dueDate}</p>
                <p class="category">${task.category}</p>
            </div>
            <i class="bx bx-trash-alt" onclick="deleteTask(${index})"></i>
        `;
        taskContainer.appendChild(taskCard);
    });
}

// Filters
function filterTasks(filter) {
    renderTasks(filter);
}

// Dashboard
function showDashboard() {
    const completedTasks = currentUser.tasks.filter(task => task.completed).length;
    const upcomingTasks = currentUser.tasks.filter(task => !task.completed).length;

    document.getElementById("dashboard-section").style.display = "block";
    document.getElementById("home-section").style.display = "none";
    document.getElementById("completed-tasks").textContent = `Completed Tasks: ${completedTasks}`;
    document.getElementById("upcoming-tasks").textContent = `Upcoming Tasks: ${upcomingTasks}`;
}

function hideDashboard() {
    document.getElementById("dashboard-section").style.display = "none";
    document.getElementById("home-section").style.display = "block";
}

// Event Listeners
document.getElementById("register-btn").addEventListener("click", () => {
    const username = document.getElementById("auth-username").value;
    const password = document.getElementById("auth-password").value;
    const userType = document.getElementById("auth-user-type").value;

    registerUser(username, password, userType);
});

document.getElementById("login-btn").addEventListener("click", () => {
    const username = document.getElementById("auth-username").value;
    const password = document.getElementById("auth-password").value;

    loginUser(username, password);
});

// Initialize App
window.addEventListener("load", () => {
    currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById("auth-section").style.display = "none";
        document.getElementById("home-section").style.display = "block";
        loadUserData();
    }
});
