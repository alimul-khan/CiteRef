document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("data-table");
    const tbody = table.querySelector("tbody");
    const addRowButton = document.getElementById("add-row");
    const inputFieldsDiv = document.getElementById("input-fields");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const infoInput = document.getElementById("info-input");
    const keywordsInput = document.getElementById("keywords-input");
    const paperTitleInput = document.getElementById("paper-title-input");
    const authorInput = document.getElementById("author-input");
    const yearInput = document.getElementById("year-input");
    const publishersInput = document.getElementById("publishers-input");
    const saveButton = document.getElementById("save-button");
    let rowCount = 1;

    // Load data from localStorage on page load
    loadFromLocalStorage();

    addRowButton.addEventListener("click", function () {
        // Display input fields
        inputFieldsDiv.style.display = "block";
    });

    searchButton.addEventListener("click", function () {
        const searchText = searchInput.value.toLowerCase();
        if (searchText.trim() !== "") {
            searchTable(searchText);
        }
    });

    saveButton.addEventListener("click", function () {
        const info = infoInput.value;
        const keywords = keywordsInput.value;
        const paperTitle = paperTitleInput.value;
        const author = authorInput.value;
        const year = yearInput.value;
        const publishers = publishersInput.value;

        if (info && keywords && paperTitle && author && year && publishers) {
            const selectedRow = getSelectedRow(); // Check if a row is selected

            if (selectedRow) {
                // Edit the selected row
                editRow(selectedRow, info, keywords, paperTitle, author, year, publishers);
            } else {
                // Create a new table row
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${rowCount}</td>
                    <td>${info}</td>
                    <td>${keywords}</td>
                    <td>${paperTitle}</td>
                    <td>${author}</td>
                    <td>${year}</td>
                    <td>${publishers}</td>
                    <td><button class="edit-button">Edit</button></td>
                    <td><button class="delete-button">Delete</button></td>
                `;

                // Append the new row to the table
                tbody.appendChild(newRow);

                rowCount++;
            }

            // Clear input fields and hide them
            infoInput.value = "";
            keywordsInput.value = "";
            paperTitleInput.value = "";
            authorInput.value = "";
            yearInput.value = "";
            publishersInput.value = "";
            inputFieldsDiv.style.display = "none";

            // Update row numbers
            updateRowNumbers();

            // Save data to localStorage
            saveToLocalStorage();
        } else {
            alert("Please fill in all fields.");
        }
    });

    tbody.addEventListener("click", function (event) {
        const target = event.target;
        if (target.classList.contains("edit-button")) {
            editRow(target.closest("tr"));
        } else if (target.classList.contains("delete-button")) {
            deleteRow(target.closest("tr"));
        }
    });

    function getSelectedRow() {
        const selectedRow = tbody.querySelector(".selected");
        return selectedRow;
    }

    function editRow(row, info, keywords, paperTitle, author, year, publishers) {
        row.cells[1].textContent = info;
        row.cells[2].textContent = keywords;
        row.cells[3].textContent = paperTitle;
        row.cells[4].textContent = author;
        row.cells[5].textContent = year;
        row.cells[6].textContent = publishers;
    }

    function deleteRow(row) {
        row.remove();
        // Update row numbers
        updateRowNumbers();
        saveToLocalStorage();
    }

    function updateRowNumbers() {
        const rows = tbody.querySelectorAll("tr");
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    }

    function searchTable(searchText) {
        const rows = tbody.querySelectorAll("tr");
        rows.forEach((row) => {
            const infoCell = row.cells[1].textContent.toLowerCase();
            const keywordsCell = row.cells[2].textContent.toLowerCase();
            const paperTitleCell = row.cells[3].textContent.toLowerCase();
            const authorCell = row.cells[4].textContent.toLowerCase();
            const yearCell = row.cells[5].textContent.toLowerCase();
            const publishersCell = row.cells[6].textContent.toLowerCase();
            
            // Check if any cell contains the search text
            if (
                infoCell.includes(searchText) ||
                keywordsCell.includes(searchText) ||
                paperTitleCell.includes(searchText) ||
                authorCell.includes(searchText) ||
                yearCell.includes(searchText) ||
                publishersCell.includes(searchText)
            ) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    function saveToLocalStorage() {
        const data = [];
        const rows = tbody.querySelectorAll("tr");
        rows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            data.push({
                row: cells[0].textContent,
                info: cells[1].textContent,
                keywords: cells[2].textContent,
                paperTitle: cells[3].textContent,
                author: cells[4].textContent,
                year: cells[5].textContent,
                publishers: cells[6].textContent,
            });
        });

        localStorage.setItem("tableData", JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const storedData = localStorage.getItem("tableData");
        if (storedData) {
            const data = JSON.parse(storedData);
            data.forEach((item) => {
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${item.row}</td>
                    <td>${item.info}</td>
                    <td>${item.keywords}</td>
                    <td>${item.paperTitle}</td>
                    <td>${item.author}</td>
                    <td>${item.year}</td>
                    <td>${item.publishers}</td>
                    <td><button class="edit-button">Edit</button></td>
                    <td><button class="delete-button">Delete</button></td>
                `;
                tbody.appendChild(newRow);
                rowCount++;
            });
        }
    }
});
