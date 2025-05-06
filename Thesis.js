
// Sample bus schedule data (could be replaced with API integration)

// Function to render the bus schedule
function renderBusSchedule() {
    const scheduleContainer = document.getElementById("bus-schedule");

    if (busSchedule.length === 0) {
        scheduleContainer.innerHTML = `<p>No buses available at the moment.</p>`;
        return;
    }

    const table = document.createElement("table");
    table.className = "schedule-table";

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Route</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Status</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    busSchedule.forEach((bus) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${bus.route}</td>
            <td>${bus.departure}</td>
            <td>${bus.arrival}</td>
            <td class="${getStatusClass(bus.status)}">${bus.status}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    scheduleContainer.innerHTML = "";
    scheduleContainer.appendChild(table);
}

function getStatusClass(status) {
    switch (status) {
        case "On Time":
            return "status-on-time";
        case "Delayed":
            return "status-delayed";
        case "Cancelled":
            return "status-cancelled";
        default:
            return "";
    }
}

function enableSmoothScroll() {
    const links = document.querySelectorAll("nav ul li a");

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

function validateContactForm() {
    const form = document.querySelector(".contact-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            alert("Please fill in all the fields.");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        alert("Thank you for your message! We will get back to you soon.");
        form.reset();
    });
}

// Güncellenmiş otobüs ve durak verisi
