const tbody = document.querySelector("tbody");

async function fetchData() {
    try {
        const todosResponse = await fetch("https://jsonplaceholder.typicode.com/todos");
        const usersResponse = await fetch("https://jsonplaceholder.typicode.com/users");

        const todos = await todosResponse.json();
        const users = await usersResponse.json();
        const usersMap = createUsers(users);

        tbody.innerHTML = '';
        const uniqueEmails = new Set();

        todos.forEach(todo => {
            const user = usersMap[todo.userId];
            if (!uniqueEmails.has(user.email)) {
                uniqueEmails.add(user.email);
                const row = createTableRow(todo, user);
                tbody.appendChild(row);
            }
        });

        tbody.addEventListener("click", rowDelete);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function createUsers(users) {
    return users.reduce((map, user) => {
        map[user.id] = user;
        return map;
    }, {});
}

function createTableRow(todo, user) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="checkbox"></td>
        <td><div class="avatar"></div></td>
        <td>${todo.title}</td>
        <td>${user.email}</td>
        <td>${user.address.street}, ${user.address.city}</td>
        <td>${user.address.zipcode}</td>
        <td><span class="status ${todo.completed}">${todo.completed}</span></td>
        <td><span class="action">x</span></td>
    `;
    return row;
}

function rowDelete(e) {
    if (e.target.classList.contains("action")) {
        const row = e.target.closest("tr");
        if (row) {
            tbody.removeChild(row);
        }
    }
}

fetchData();