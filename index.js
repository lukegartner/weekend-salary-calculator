// Global Employeees Data
const employees = localStorage.getItem("employees")
  ? JSON.parse(localStorage.getItem("employees"))
  : [];

// Edit variables
let isEditing = false;
let editIndex = NaN;

// DOM variables
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const idInput = document.querySelector("#id-number");
const jobTitleInput = document.querySelector("#job-title");
const annualSalaryInput = document.querySelector("#annual-salary");
const tableBody = document.querySelector("tbody");
const totalMonthlySpan = document.querySelector(".total-monthly-span");
const submitBtn = document.querySelector(".submit-btn");
const sortSpans = document.querySelectorAll(".sort");

// Handle Submit
const handleSubmit = (e) => {
  e.preventDefault();
  const employee = {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    id: idInput.value,
    jobTitle: jobTitleInput.value,
    annualSalary: annualSalaryInput.value,
  };
  if (!isEditing) {
    employees.push(employee);
  } else if (isEditing) {
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
    .map(({ firstName, lastName, id, jobTitle, annualSalary }, index) => {
      return `
          <tr data-id="${index}" class=${index % 2 !== 0 ? "row-light" : ""} >
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${id}</td>
            <td>${jobTitle}</td>
            <td>${formatSalary(annualSalary)}</td>
            <td onClick="removeEmployee(event)" class="delete"><i class="fa-solid fa-delete-left"></i></td>
            <td onClick="editEmployee(event)" class="edit"><i class="fa-solid fa-pen-to-square"></i></td>
          </tr>
`;
    })
    .join("");
  // clear inputs
  firstNameInput.value = "";
  lastNameInput.value = "";
  idInput.value = "";
  jobTitleInput.value = "";
  annualSalaryInput.value = "";

  totalMonthlySpan.innerHTML = formatSalary(getTotalMonthly());
  totalMonthlySpan.classList = getTotalMonthly() >= 20000 ? "red" : "";
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

// Display employees data when page initially loads
displayData(employees);

// remove employee
const removeEmployee = (e) => {
  employees.splice(e.target.parentElement.dataset.id, 1);
  setLocalStorage();
  displayData(employees);
};

// edit employee
const editEmployee = (e) => {
  const { firstName, lastName, id, jobTitle, annualSalary } =
    employees[e.currentTarget.parentElement.dataset.id];

  firstNameInput.value = firstName;
  lastNameInput.value = lastName;
  idInput.value = id;
  jobTitleInput.value = jobTitle;
  annualSalaryInput.value = annualSalary;

  submitBtn.innerHTML = "Edit";
  isEditing = true;
  editIndex = e.currentTarget.parentElement.dataset.id;
};

// Local Storage
const setLocalStorage = () => {
  localStorage.setItem("employees", JSON.stringify(employees));
};

// Sort
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
  if (type === "string") {
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
