// Global Employeees Data
const employees = [];

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
  displayData();
};

const displayData = () => {
  // display form
  tableBody.innerHTML = employees
    .map(({ firstName, lastName, id, jobTitle, annualSalary }, index) => {
      return `
          <tr data-id="${index}" class=${index % 2 !== 0 ? "row-light" : ""} >
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${id}</td>
            <td>${jobTitle}</td>
            <td>$${annualSalary}</td>
            <td onClick="removeEmployee(event)">x</td>
            <td onClick="editEmployee(event)">edit</td>
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
  displayData();
};

// edit employee
const editEmployee = (e) => {
  const { firstName, lastName, id, jobTitle, annualSalary } =
    employees[e.target.parentElement.dataset.id];

  firstNameInput.value = firstName;
  lastNameInput.value = lastName;
  idInput.value = id;
  jobTitleInput.value = jobTitle;
  annualSalaryInput.value = annualSalary;

  submitBtn.innerHTML = "Edit";
  isEditing = true;
  editIndex = e.target.parentElement.dataset.id;
};
