const BASE = "https://fsa-puppy-bowl.herokuapp.com/api/";
const COHORT = "2504-FTB-ET-WEB-PT";
//const RESOURCE = "/players";
const API = BASE + COHORT;

const rosterContainer = document.getElementById("roster");
const detailsContainer = document.getElementById("puppy-details");
const noSelection = document.getElementById("no-selection");

let selectedPuppy = null;

function fetchPuppies() {
  fetch(`${API}/players`)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      console.log(data.data); // debugging
      displayPuppies(data.data);
    })
    .catch((error) => console.error("Error fetching puppies:", error));
}

function displayPuppies(puppies) {
  rosterContainer.innerHTML = "";
  puppies.forEach((puppy) => {
    const puppyLi = document.createElement("li");
    puppyLi.className = "puppy";
    const imageUrl =
      puppy.imageUrl || "https://via.placeholder.com/150?text=No+Image";
    puppyLi.innerHTML = `
      <h3>${puppy.name}</h3>
      <img src="${imageUrl}" alt="${puppy.name}" width="150" />
    `;
    puppyLi.addEventListener("click", () => displayPuppyDetails(puppy));
    rosterContainer.appendChild(puppyLi);
  });
}
function displayPuppyDetails(puppy) {
  selectedPuppy = puppy;

  document.querySelectorAll(".puppy").forEach((div) => {
    div.classList.remove("selected");
  });

  const selectedDiv = [...rosterContainer.children].find((child) =>
    child.textContent.includes(puppy.name)
  );
  if (selectedDiv) selectedDiv.classList.add("selected");

  noSelection.style.display = "none";
  detailsContainer.innerHTML = `
    <h3><strong>Name</strong> ${puppy.name}</h3>
    <p><strong>ID</strong> ${puppy.id}</p>
    <p><strong>Breed</strong> ${puppy.breed}</p>
    <p><strong>Team</strong> ${puppy.team?.name || "Unassigned"}</p>
    <p><strong>Status</strong> ${puppy.status}</p>
    <img src="${puppy.imageUrl}" alt="${puppy.name}" />
    <button id="remove-button">Remove from roster</button>
  `;
  document
    .getElementById("remove-button")
    .addEventListener("click", removePuppy);
  const imageUrl =
    puppy.imageUrl || "https://via.placeholder.com/150?text=No+Image";
  detailsContainer.innerHTML = `
  ...
  <img src="${imageUrl}" alt="${puppy.name}" />
  ...
`;
}

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const breed = document.getElementById("breed").value;
  const status = document.getElementById("status").value;

  fetch(`${API}/players`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      breed,
      status,
    }),
  })
    .then((res) => res.json())
    .then(() => {
      addForm.reset();
      fetchPuppies();
    })
    .catch((err) => console.error("Error adding puppy:", err));
});

function removePuppy() {
  if (!selectedPuppy) return;

  fetch(`${API}/players/${selectedPuppy.id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => {
      fetchPuppies();
      clearSelection();
    })
    .catch((error) => console.error("Error removing puppy:", error));
}

function clearSelection() {
  selectedPuppy = null;
  noSelection.style.display = "block";
  detailsContainer.innerHTML = "";
}

const addForm = document.getElementById("add-puppy-form");

document.addEventListener("DOMContentLoaded", () => {
  fetchPuppies();
});
