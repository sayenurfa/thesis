
// Sample bus schedule data (could be replaced with API integration)
const busSchedule = [
    { route: "301", departure: "08:00", arrival: "08:30", status: "On Time" },
    { route: "302", departure: "09:00", arrival: "09:45", status: "On Time" },
    { route: "303", departure: "10:00", arrival: "10:50", status: "On Time" },
    { route: "304", departure: "11:00", arrival: "11:30", status: "Delayed" },
    { route: "305", departure: "12:00", arrival: "12:40", status: "Cancelled" },
    { route: "306", departure: "13:00", arrival: "13:35", status: "On Time" },
    { route: "307", departure: "14:00", arrival: "14:25", status: "Delayed" },
    { route: "308", departure: "15:00", arrival: "15:45", status: "On Time" },
];

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
const busStops = {
    "301": ["Stop A1", "Stop A2", "Stop A3", "Stop A4", "Stop A5"],
    "302": ["Stop B1", "Stop B2", "Stop B3", "Stop B4", "Stop B5"],
    "303": ["Stop C1", "Stop C2", "Stop C3", "Stop C4", "Stop C5"],
    "304": ["Stop D1", "Stop D2", "Stop D3", "Stop D4", "Stop D5"],
    "305": ["Stop E1", "Stop E2", "Stop E3", "Stop E4", "Stop E5"],
    "306": ["Stop F1", "Stop F2", "Stop F3", "Stop F4", "Stop F5"],
    "307": ["Stop G1", "Stop G2", "Stop G3", "Stop G4", "Stop G5"],
    "308": ["Stop H1", "Stop H2", "Stop H3", "Stop H4", "Stop H5"]
};

document.getElementById("buses").addEventListener("change", function () {
    const selectedBus = this.value;
    const stopSelect = document.getElementById("stops");

    stopSelect.innerHTML = "";

    if (busStops[selectedBus]) {
        busStops[selectedBus].forEach((stop) => {
            const option = document.createElement("option");
            option.value = stop;
            option.textContent = stop;
            stopSelect.appendChild(option);
        });
    }
});

document.getElementById("checkTime").addEventListener("click", () => {
    const selectedBus = document.getElementById("buses").value;
    const selectedStop = document.getElementById("stops").value;

    if (busStops[selectedBus] && busStops[selectedBus].includes(selectedStop)) {
        const stopIndex = busStops[selectedBus].indexOf(selectedStop);
        const arrivalTime = (stopIndex + 1) * 2;
        document.getElementById("result").textContent = `Your bus will arrive at ${selectedStop} in ${arrivalTime} minutes.`;
    } else {
        document.getElementById("result").textContent = "Invalid selection.";
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

window.onload = () => {
    renderBusSchedule();
    enableSmoothScroll();
    validateContactForm();
};
