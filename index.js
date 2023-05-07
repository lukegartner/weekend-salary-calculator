// Global Employeees Data
const employees = localStorage.getItem("employees")
  ? JSON.parse(localStorage.getItem("employees"))
  : [];

// is edit
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
const sortSalaryAscendingBtn = document.querySelector(".sort-salary-ascending");
const sortSalaryDescendingBtn = document.querySelector(
  ".sort-salary-descending"
);
const sortLastNameAscendingBtn = document.querySelector(
  ".sort-last-name-ascending"
);
const sortLastNameDescendingBtn = document.querySelector(
  ".sort-last-name-descending"
);

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
  setLocatStorage();
  displayData(employees);
};

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
            <td>$${annualSalary}</td>
            <td onClick="removeEmployee(event)" class="delete"><i class="fa-solid fa-delete-left"></i></td>
            <td onClick="editEmployee(event)" class="edit"><i class="fa-solid fa-pen-to-square"></i></td>
          </tr>
`;
    })
    .join("");

  firstNameInput.value = "";
  lastNameInput.value = "";
  idInput.value = "";
  jobTitleInput.value = "";
  annualSalaryInput.value = "";

  totalMonthlySpan.innerHTML = getTotalMonthly();
  totalMonthlySpan.classList = getTotalMonthly() >= 20000 ? "red" : "";
};

// get total monthly
const getTotalMonthly = () => {
  return employees.reduce((total, current) => {
    return total + current.annualSalary / 12;
  }, 0);
};

// remove employee
const removeEmployee = (e) => {
  employees.splice(e.target.parentElement.dataset.id, 1);
  setLocatStorage();
  displayData(employees);
};
displayData(employees);

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
const setLocatStorage = () => {
  localStorage.setItem("employees", JSON.stringify(employees));
};

// Sort
sortSalaryAscendingBtn.addEventListener("click", () => {
  displayData(sort(employees, "annualSalary", "ascending"));
  setLocatStorage();
});
sortSalaryDescendingBtn.addEventListener("click", () => {
  displayData(sort(employees, "annualSalary", "descending"));
  setLocatStorage();
});
sortLastNameAscendingBtn.addEventListener("click", () => {
  displayData(sort(employees, "lastName", "ascending"));
  setLocatStorage();
});
sortLastNameDescendingBtn.addEventListener("click", () => {
  displayData(sort(employees, "lastName", "descending"));
  setLocatStorage();
});

const sort = (unsorted, property, direction) => {
  if (property === "annualSalary") {
    if (direction === "ascending") {
      return unsorted.sort((a, b) => a[property] - b[property]);
    }
    if (direction === "descending") {
      return unsorted.sort((a, b) => b[property] - a[property]);
    }
  }
  if (property === "lastName") {
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
