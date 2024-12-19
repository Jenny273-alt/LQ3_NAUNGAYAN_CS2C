const MAX_CAPACITY = 30;
const BUS_NAMES = ["Cubao", "Baguio", "Pasay"];

// User authentication data 
const users = {
    ticket_person: { username: "admin", passwordHash: "somePassword" } 
};

// Manage class reservation
class Bus {
    constructor(name) {
        this.name = name;
        this.seats = Array(MAX_CAPACITY).fill(null); 
    }

    displayPassengers() {
        console.log(`\nBus Name: ${this.name}`);
        this.seats.forEach((passenger, index) => {
            console.log(`Seat ${index + 1}: ${passenger ? passenger : "AVAILABLE"}`);
        });
    }

    isSeatAvailable(seatNumber) {
        return this.seats[seatNumber] === null;
    }

    addReservation(seatNumber, customerName) {
        if (this.isSeatAvailable(seatNumber)) {
            this.seats[seatNumber] = customerName;
            console.log(`Reservation successful for ${customerName} at Seat ${seatNumber + 1}.`);
            return true; // Indicate success
        } else {
            console.log("Seat is already taken!");
            return false; // Indicate failure
        }
    }

    removeReservation(seatNumber) {
        if (!this.isSeatAvailable(seatNumber)) {
            const customerName = this.seats[seatNumber];
            this.seats[seatNumber] = null;
            console.log(`Reservation for ${customerName} at Seat ${seatNumber + 1} has been removed.`);
            return true; // Indicate success
        } else {
            console.log("No reservation found at this seat!");
            return false; // Indicate failure
        }
    }
}

// Function to authenticate the ticket person 
function authenticate() {
    const username = prompt("Enter username: ");
    const password = prompt("Enter password: ");
    return users.ticket_person.username === username && users.ticket_person.passwordHash === password; //This is a placeholder
}

// Ticket person operations 
function ticketPersonOperations(buses) {
    while (true) {
        const choice = prompt("Choose an option: LOGOUT, VIEW, MANAGE").toUpperCase();
        switch (choice){
            case "LOGOUT": return; 
            case "VIEW": buses.forEach(bus => bus.displayPassengers()); prompt("Press Enter to continue..."); break;
            case "MANAGE": manageBuses(buses); break;
            default: console.log("Invalid Option!");
        }
    }
}

// Manage bus reservations 
function manageBuses(buses) {
    while (true) {

        const busChoice = parseInt(prompt("Select a bus to manage (1-3): ")) - 1;
        if (busChoice < 0 || busChoice >= buses.length) {
            console.log("Invalid bus selection!");
            continue;
        }

        const bus = buses[busChoice];
        while (true) {
            const action = prompt("\nOptions: ADD, REMOVE, CANCEL").toUpperCase();
            if (action === "CANCEL") break;
            if (action === "ADD") addReservation(bus);
            else if (action === "REMOVE") removeReservation(bus);
            else console.log("Invalid option!");
        }
    }
}

// Add a reservation 
function addReservation(bus) {
    bus.displayPassengers();
    const seatNumber = parseInt(prompt("Enter seat number to reserve (1-30): ")) - 1;
    if (seatNumber < 0 || seatNumber >= MAX_CAPACITY) {
        console.log("Invalid seat number!");
        return;
    }

    const customerName = prompt("Enter customer name: ");
    bus.addReservation(seatNumber, customerName);
}

// Remove a reservation 
function removeReservation(bus) {
    bus.displayPassengers();
    const seatNumber = parseInt(prompt("Enter seat number to remove reservation (1-30): ")) - 1;

    if (seatNumber < 0 || seatNumber >= MAX_CAPACITY) {
        console.log("Invalid seat number!");
        return;
    }

    if (bus.removeReservation(seatNumber)) { 
    }
}

// Customer operations 
function customerOperations(buses) {
    while (true) {
        const action = prompt("Choose an option: RESERVE, CANCEL RESERVATION, CANCEL: ").toUpperCase();
        switch (action) {
            case "CANCEL": return; //Exit function
            case "RESERVE": reserveSeat(buses); break;
            case "CANCEL RESERVATION": cancelReservation(buses); break;
            default: console.log("Invalid option!");
        }
    }
}

// Reserve a seat as a customer 
function reserveSeat(buses) {
    const busChoice = parseInt(prompt("Select a bus (1-3): ")) - 1;
    if (busChoice < 0 || busChoice >= buses.length) {
        console.log("Invalid bus selection!");
        return;
    }

    const bus = buses[busChoice];

    if (bus.seats.every(seat => seat !== null)) {
        console.log("Bus is fully booked!");
        return;
    }

    bus.displayPassengers();
    const seatNumber = parseInt(prompt("Enter seat number to reserve (1-30): ")) - 1;

    if (seatNumber < 0 || seatNumber >= MAX_CAPACITY || !bus.isSeatAvailable(seatNumber)) {
        console.log("Invalid or occupied seat!");
        return;
    }

    const customerName = prompt("Enter your name: ");
    bus.addReservation(seatNumber, customerName);
}

// Cancel a customer's reservation 
function cancelReservation(buses) {
    const customerName = prompt("Enter your name: ");
    for (const bus of buses) {
        const seatIndex = bus.seats.indexOf(customerName);
        if (seatIndex !== -1) {
            if(confirm(`Are you sure you want to cancel your reservation at Seat ${seatIndex + 1} on Bus ${bus.name}?`)){
                bus.removeReservation(seatIndex);
                return;
            } else {
                return; 
            }
        }
    }
    console.log("Reservation not found.");
}

// Main function to run the program
function main() {
    const buses = BUS_NAMES.map(name => new Bus(name));
    while (true) {
        const userType = prompt("\nAre you a TICKET PERSON or CUSTOMER? ").toUpperCase();
        if (userType === "TICKET PERSON") {
            if (authenticate()) {
                ticketPersonOperations(buses);
            } else {
                console.log("Authentication failed!");
            }
        } else if (userType === "CUSTOMER") {
            customerOperations(buses);
        } else {
            console.log("Invalid user type!");
        }
    }
}

main();