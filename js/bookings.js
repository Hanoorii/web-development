//GET Data "Bookings"
fetch("https://matthiasbaldauf.com/wbdg23/bookings")
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


//Check Button Inputs
const bookButton = document.querySelector("#bookDeskModal .modal-footer button.btn-primary");
const emailInput = document.querySelector("#bookDeskModal input#email");
const dateInput = document.querySelector("#bookDeskModal input#date");

bookButton.addEventListener("click", function () {
  // Check email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(emailInput.value)) {
    alert("Please enter a valid email address");
    return;
  }

  // Check date
  const today = new Date();
  const selectedDate = new Date(dateInput.value);
  if (selectedDate < today) {
    alert("Please select a date in the future");
    return;
  }

  // If validation passes, proceed with booking
  // Add your booking code here
});
