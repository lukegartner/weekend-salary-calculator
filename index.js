// Global Employeees Data
const employees = [];

// DOM variables
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const idInput = document.querySelector("#id-number");
const jobTitleInput = document.querySelector("#job-title");
const annualSalaryInput = document.querySelector("#annual-salary");
const tableBody = document.querySelector("tbody");

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

  displayData();
};

const displayData = () => {
  // display form
  tableBody.innerHTML = employees
    .map(({ firstName, lastName, id, jobTitle, annualSalary }, index) => {
      return `
          <tr class=${index % 2 !== 0 ? "row-light" : ""}>
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${id}</td>
            <td>${jobTitle}</td>
            <td>$${annualSalary}</td>
            <td>x</td>
          </tr>
`;
    })
    .join("");

  firstNameInput.value = "";
  lastNameInput.value = "";
  idInput.value = "";
  jobTitleInput.value = "";
  annualSalaryInput.value = "";
};
