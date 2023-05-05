// Global Employeees Data
const employees = [];

// DOM variables
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const idInput = document.querySelector("#id-number");
const jobTitleInput = document.querySelector("#job-title");
const annualSalaryInput = document.querySelector("#annual-salary");

// Handle Submit
const handleSubmit = (e) => {
  e.preventDefault();
  employees.push({
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    id: idInput.value,
    jobTitle: jobTitleInput.value,
    annualSalary: annualSalaryInput.value,
  });
  console.log(employees);
};
