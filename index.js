// Global Employeees Data
const employees = localStorage.getItem("employees")
  ? JSON.parse(localStorage.getItem("employees"))
  : [];

// Monthly Budget
let monthlyBudget = localStorage.getItem("monthlyBudget")
  ? JSON.parse(localStorage.getItem("monthlyBudget"))
  : 20000;

// Edit variables
let isEditing = false;
let editIndex = NaN;

// DOM variables
let employeeInputs;
const monthlyBudgetInput = document.querySelector("#monthly-budget");
const tableBody = document.querySelector("tbody");
const totalMonthlySpan = document.querySelector(".total-monthly-span");
const monthlyBudgetSpan = document.querySelector(".monthly-budget-span");
const submitBtn = document.querySelector(".submit-btn");
let sortSpans = document.querySelectorAll(".sort");
const tableHeaderRow = document.querySelector("#table-header-row");
const inputContainer = document.querySelector(".input-container");

// Handle Submit
const handleSubmit = (e) => {
  e.preventDefault();
  // Construct object containing employee data
  let employee = {};
  for (let input of employeeInputs) {
    employee[input.lastElementChild.dataset.property] =
      input.lastElementChild.value;
  }
  // If not editing add employee object to end of employees array
  if (!isEditing) {
    employees.push(employee);
  } else if (isEditing) {
    // If editing replace employee current data with data from inputs
    employees[editIndex] = employee;
    isEditing = false;
    editIndex = NaN;
    submitBtn.innerHTML = "Submit";
  }
  setLocalStorage();
  displayData(employees);
};

// Display Data
const displayData = (employeesData) => {
  // display form
  tableBody.innerHTML = employeesData
    .map((employee, index) => {
      const employeeColumns = [];
      for (let key in employee) {
        employeeColumns.push(
          `<td>${
            key === "annualSalary" ? formatSalary(employee[key]) : employee[key]
          }</td>`
        );
      }
      return `
          <tr data-id="${index}" class=${index % 2 !== 0 ? "row-light" : ""} >
            ${employeeColumns.join("")}
            <td onClick="removeEmployee(event)" class="delete"><i class="fa-solid fa-delete-left"></i></td>
            <td onClick="editEmployee(event)" class="edit"><i class="fa-solid fa-pen-to-square"></i></td>
          </tr>
`;
    })
    .join("");
  // clear inputs
  for (let input of employeeInputs) {
    input.lastElementChild.value = "";
  }

  totalMonthlySpan.innerHTML = formatSalary(getTotalMonthly());
  totalMonthlySpan.classList = getTotalMonthly() >= monthlyBudget ? "red" : "";
  monthlyBudgetSpan.innerHTML = formatSalary(monthlyBudget);
};

// get total monthly
const getTotalMonthly = () => {
  return employees.reduce((total, current) => {
    return total + current.annualSalary / 12;
  }, 0);
};

// Format Salary
const formatSalary = (salary) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(salary);
};

// remove employee
const removeEmployee = (e) => {
  employees.splice(e.currentTarget.parentElement.dataset.id, 1);
  setLocalStorage();
  displayData(employees);
};

// edit employee
const editEmployee = (e) => {
  const employeeToEdit = employees[e.currentTarget.parentElement.dataset.id];

  for (let input of employeeInputs) {
    input.lastElementChild.value =
      employeeToEdit[input.lastElementChild.dataset.property];
  }

  submitBtn.innerHTML = "Edit";
  isEditing = true;
  editIndex = e.currentTarget.parentElement.dataset.id;
};

// Local Storage
const setLocalStorage = () => {
  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.setItem("monthlyBudget", JSON.stringify(monthlyBudget));
};

// Sort

// // Sort Function
const sort = (unsorted, property, direction, type) => {
  if (type === "number") {
    if (direction === "ascending") {
      return unsorted.sort((a, b) => a[property] - b[property]);
    }
    if (direction === "descending") {
      return unsorted.sort((a, b) => b[property] - a[property]);
    }
  }
  if (type === "text") {
    if (direction === "ascending") {
      return unsorted.sort((a, b) =>
        a[property].toLowerCase() < b[property].toLowerCase() ? -1 : 1
      );
    }
    if (direction === "descending") {
      return unsorted.sort((a, b) =>
        b[property].toLowerCase() > a[property].toLowerCase() ? 1 : -1
      );
    }
  }
};

// Set Monthly Budget
const setMonthlyBudget = (e) => {
  e.preventDefault();
  monthlyBudget = Number(monthlyBudgetInput.value);
  setLocalStorage();
  displayData(employees);
};

// ---------------------------------------------------------------------------------
// Create Fields for inputs and table
window.addEventListener("DOMContentLoaded", () => {
  generateTableHeaders(fieldsData);
  generateInputs(fieldsData);
  // Display employees data when page initially loads
  displayData(employees);
});

// Fields Data
const fieldsData = [
  {
    title: "First Name",
    property: "firstName",
    type: "text",
    id: "first-name",
  },
  { title: "Last Name", property: "lastName", type: "text", id: "last-name" },
  { title: "ID#", property: "id", type: "number", id: "id-number" },
  { title: "Job Title", property: "jobTitle", type: "text", id: "job-title" },
  {
    title: "Annual Salary",
    property: "annualSalary",
    type: "number",
    id: "annual-salary",
  },
  { title: "Comment", property: "comment", type: "text", id: "comment" },
];

// Generate Inputs
const generateInputs = (inputsData) => {
  inputContainer.innerHTML = inputsData
    .map(({ title, property, type, id }) => {
      return `
          <div class="input">
            <label for="${id}">${title}</label>
            <input
              type="${type}"
              name="${id}"
              id="${id}"
              data-property="${property}"
              placeholder="${title}"
            />
          </div>
    `;
    })
    .join("");

  // Assign to variables
  employeeInputs = document.querySelectorAll(".input");
};

// Generate Table Headers
const generateTableHeaders = (headersData) => {
  tableHeaderRow.innerHTML = headersData
    .map(({ title, property, type }) => {
      return `
            <th>
              ${title}
              <span
                class="sort"
                data-property="${property}"
                data-direction="ascending"
                data-type="${type}"
                ><i class="fa-solid fa-caret-up up"></i
              ></span>
              <span
                class="sort"
                data-property="${property}"
                data-direction="descending"
                data-type="${type}"
                ><i class="fa-solid fa-caret-down down"></i
              ></span>
            </th>
    `;
    })
    .concat(["<th></th><th></th>"])
    .join("");

  // Assign spans to sortSpans Variable
  sortSpans = document.querySelectorAll(".sort");

  // // Add Event Listeners to spans
  for (let sortSpan of sortSpans) {
    sortSpan.addEventListener("click", () => {
      displayData(
        sort(
          employees,
          sortSpan.dataset.property,
          sortSpan.dataset.direction,
          sortSpan.dataset.type
        )
      );
      setLocalStorage();
    });
  }
};
