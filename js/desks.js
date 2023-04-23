//GET Data "Desks"
fetch("https://matthiasbaldauf.com/wbdg23/desks")
  .then((response) => response.json())
  .then((data) => {
    const table = document.querySelector(".table tbody");

    function renderData() {
      table.innerHTML = "";

      data.sort((a, b) => {
        const sortHeader = document.querySelector(`[data-sort][aria-sort]`);

        if (sortHeader) {
          const sortKey = sortHeader.getAttribute("data-sort");
          return sortHeader.getAttribute("aria-sort") === "ascending" ? a[sortKey].localeCompare(b[sortKey]) : b[sortKey].localeCompare(a[sortKey]);
        }

        return 0;
      });

      data.forEach((desk) => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = desk.id;
        row.appendChild(idCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = desk.name;
        row.appendChild(nameCell);

        const availableCell = document.createElement("td");
        if (desk.available === "1") {
          const checkIcon = document.createElement("i");
          checkIcon.classList.add("fas", "fa-check", "text-success");
          availableCell.appendChild(checkIcon);
        } else {
          const crossIcon = document.createElement("i");
          crossIcon.classList.add("fas", "fa-times", "text-danger");
          availableCell.appendChild(crossIcon);
        }
        row.appendChild(availableCell);

        const addressCell = document.createElement("td");
        addressCell.textContent = desk.address;
        row.appendChild(addressCell);

        const priceCell = document.createElement("td");
        const roundedPrice = Math.round(desk.price / 0.05) * 0.05;
        priceCell.textContent = "CHF " + roundedPrice.toFixed(2);
        row.appendChild(priceCell);

        const eurCell = document.createElement("td"); // New column for EUR
        fetch("https://api.exchangerate.host/convert?from=CHF&to=EUR&amount=" + roundedPrice)
          .then((response) => response.json())
          .then((data) => {
            const roundedEurPrice = Math.round(data.result * 100) / 100;
            eurCell.textContent = "EUR " + roundedEurPrice.toFixed(2);
          })
          .catch((error) => console.error(error));
        row.appendChild(eurCell); // Add EUR cell to the row

        const latCell = document.createElement("td");
        latCell.textContent = desk.lat;
        row.appendChild(latCell);

        const lonCell = document.createElement("td");
        lonCell.textContent = desk.lon;
        row.appendChild(lonCell);

        const commentCell = document.createElement("td");
        commentCell.textContent = desk.comment;
        row.appendChild(commentCell);

        table.appendChild(row);
      });
    }
    document.querySelectorAll("[data-sort]").forEach((header) => {
      header.addEventListener("click", () => {
        document.querySelectorAll("[data-sort]").forEach((otherHeader) => {
          if (otherHeader !== header) {
            otherHeader.removeAttribute("aria-sort");
          }
        });

        header.setAttribute("aria-sort", header.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending");
        renderData();
      });
    });

    renderData();
  })
  .catch((error) => console.error(error));

//BOOKING WINDOW

//Dropdown-List with all Desks
document.addEventListener("DOMContentLoaded", function () {
  const deskDropdown = document.getElementById("desk");

  fetch("https://matthiasbaldauf.com/wbdg23/desks")
    .then((response) => response.json())
    .then((desks) => {
      desks.forEach((desk) => {
        const option = document.createElement("option");
        option.value = desk.name;
        option.text = `${desk.name} - ${desk.address}`;
        deskDropdown.appendChild(option);
      });
    });
});

// Calculate Duration in hours
window.addEventListener("load", function () {
  var startTimeField = document.getElementById("start-time");
  var endTimeField = document.getElementById("end-time");
  var durationField = document.getElementById("duration");

  startTimeField.addEventListener("change", updateDuration);
  endTimeField.addEventListener("change", updateDuration);

  function updateDuration() {
    var startTime = startTimeField.valueAsNumber;
    var endTime = endTimeField.valueAsNumber;

    if (startTime && endTime && startTime < endTime) {
      var duration = Math.floor((endTime - startTime) / (60 * 60 * 1000));
      durationField.value = duration;
    } else {
      durationField.value = "";
    }
  }
});

//Calculate the Total Price of the selected Desk
document.addEventListener("DOMContentLoaded", function () {
  const calculateBtn = document.querySelector("#calculate-btn");

  calculateBtn.addEventListener("click", function () {
    const duration = document.querySelector("#duration").value;
    const deskId = document.querySelector("#desk").value;

    // Look up the price for the selected desk ID from a data object or API
    const price = getPriceForDeskId(deskId);

    const totalPriceCHF = duration * price;
    const roundedTotalPriceCHF = Math.round(totalPriceCHF / 0.05) * 0.05;
    document.querySelector("#total-chf").value = roundedTotalPriceCHF;

    fetch("https://api.exchangerate.host/latest?base=CHF&symbols=EUR")
      .then((response) => response.json())
      .then((data) => {
        const exchangeRate = data.rates.EUR;
        const totalPriceEUR = totalPriceCHF * exchangeRate;
        const roundedTotalPriceEUR = Math.round(totalPriceEUR / 0.05) * 0.05;
        document.querySelector("#total-eur").value = roundedTotalPriceEUR;
      });
  });

  function getPriceForDeskId(deskId) {
    // Desk Prices (manually)
    const deskPrices = {
      "D2-1": 34.4,
      "D2-2": 34.4,
      "D2-3": 34.4,
      "D2-4": 34.4,
      "D6-1": 42,
      "D7-3": 78.5,
      "D7-4": 65.2,
      "D8-1": 65.2,
      "D8-2": 65.2,
      "Werft31-D1": 67.5,
      "Werft31-D2": 67.5,
    };

    return deskPrices[deskId];
  }
});

//Reset all Inputs when the "Close-Btn" is pressed
document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.querySelector("#close-btn");

  closeBtn.addEventListener("click", function () {
    document.querySelector("#name").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#start-time").value = "";
    document.querySelector("#end-time").value = "";
    document.querySelector("#duration").value = "";
    document.querySelector("#desk").value = "";
    document.querySelector("#total-chf").value = "";
    document.querySelector("#total-eur").value = "";
  });
});

//MAP FUNCTIONS
fetch("https://matthiasbaldauf.com/wbdg23/desks")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const map = L.map("map").setView([data[0].lat, data[0].lon], 13);
    const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    const groups = {};
    const deskNames = {};
    data.forEach((desk) => {
      const key = `${desk.lat},${desk.lon}`;
      if (!groups[key]) {
        groups[key] = L.layerGroup().addTo(map);
      }
      const marker = L.marker([desk.lat, desk.lon]).addTo(groups[key]);
      marker.bindPopup(`<b>${desk.name}</b><br>${desk.address}`);
      if (!deskNames[key]) {
        deskNames[key] = [desk.name];
      } else {
        deskNames[key].push(desk.name);
      }
    });
    // add layer control to switch between location groups
    L.control.layers(null, groups).addTo(map);

    // add table rows with the desk names at each location
    Object.keys(groups).forEach((key) => {
      const names = deskNames[key].join(", ");
      const row = `
        <tr>
          <td>${names}</td>
          <td>${data.find((desk) => `${desk.lat},${desk.lon}` === key).address}</td>
          <td>${key.split(",")[0]}</td>
          <td>${key.split(",")[1]}</td>
        </tr>
      `;
      document.querySelector("#map-desks tbody").innerHTML += row;

      // create a marker with a popup for the group of desks
      const groupMarker = L.marker([key.split(",")[0], key.split(",")[1]]).addTo(map);
      groupMarker.bindPopup(`<b>${names}</b><br>${data.find((desk) => `${desk.lat},${desk.lon}` === key).address}`);
    });
    // hide the table
    document.querySelector("#map-desks").style.display = "none";
  });


//BOOK BUTTON
document.addEventListener("DOMContentLoaded", function () {
  const bookBtn = document.querySelector("#book-btn");

  bookBtn.addEventListener("click", function () {
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const date = document.querySelector("#date").value;
    const startTime = document.querySelector("#start-time").value;
    const endTime = document.querySelector("#end-time").value;
    const duration = document.querySelector("#duration").value;
    const deskId = document.querySelector("#desk").value;
    const totalPriceCHF = document.querySelector("#total-chf").value;
    const studId = "2442";

    // Check if all required fields are filled out
    if (!name || !email || !date || !startTime || !endTime || !duration || !deskId) {
      alert("Please fill out all required fields.");
      return;
    }

    // Make a POST request to the server to book the desk
    fetch("https://matthiasbaldauf.com/wbdg23/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deskId: deskId,
        user: name,
        email: email,
        start: date + startTime,
        end: date + endTime,
        studId: studId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to book desk.");
        }
        return response.json();
      })
      .then((data) => {
        // Show a success message
        alert(`Desk ${deskId} has been booked for ${duration} hours.`);

        // Reset all inputs
        document.querySelector("#name").value = "";
        document.querySelector("#email").value = "";
        document.querySelector("#date").value = "";
        document.querySelector("#start-time").value = "";
        document.querySelector("#end-time").value = "";
        document.querySelector("#duration").value = "";
        document.querySelector("#desk").value = "";
        document.querySelector("#total-chf").value = "";
        document.querySelector("#total-eur").value = "";
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while booking the desk.");
      });
  });
});
