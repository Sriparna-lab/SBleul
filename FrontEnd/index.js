const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

//Call the API to dynamically retrive the projects
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}
getWorks();   

//Display the gallery
async function addWorks() {
    gallery.innerHTML ="";
    const works = await getWorks();
    works.forEach((work) => {
        createWorks(work);
    });
}
addWorks();

function createWorks(work) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = work.imageUrl;
        figcaption.textContent = work.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
}

// Retrive the category
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}
getCategories();

async function displayCategoriesButtons() {
    const categories = await getCategories();
    categories.forEach((category) => {
      const btn = document.createElement("button");
      btn.textContent = category.name;
      btn.id = category.id;
      filters.appendChild(btn);
    });
  }
displayCategoriesButtons();


//Filter on click on button by category
async function filterCategory() {
    const category = await getWorks();
    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          btnId = e.target.id;
          gallery.innerHTML = "";
          buttons.forEach(btn => btn.classList.remove("selected")); 
          button.classList.add("selected");
          if (btnId !== "0") {
            const designSortCategory = category.filter((work) => {
              return work.categoryId == btnId;
            });
            designSortCategory.forEach((work) => {
              createWorks(work);
            });
          } else {
            addWorks();
          }
        });
      });
    }
    //The selected fiter stays selected and changes when another filter is choosen
    document.getElementById("0").classList.add("selected");
    const buttons = document.querySelectorAll(".filters button");
      document.addEventListener("click", (event) => {
        if (!event.target.closest(".filters")) {
        const selectedButton = document.querySelector(".filters button.selected");
        if (selectedButton) {
          buttons.forEach(btn => btn.classList.remove("selected"));
          selectedButton.classList.add("selected");
        }
     }
    });
filterCategory();

//Admin mode
async  function admin() {
  if (sessionStorage.getItem("token")) {
    const body = document.querySelector("body");
    const editBar = document.createElement("div");
    const modalMode = document.createElement("p");
      editBar.className = "editBar";
      modalMode.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Mode édition`;
      body.insertAdjacentElement("afterbegin", editBar);
      editBar.append(modalMode);
      const modifier = `<i class="fa-regular fa-pen-to-square"></i>`;
      document.getElementById("edit").innerText = "modifier";
      document.querySelector("#portfolio h2").insertAdjacentHTML("afterend", modifier);
      document.querySelector(".filters").style.display = "none";
//Turning the login button to logout 
      document.getElementById("logoutButton").innerText = "logout";
//If the user is connected 
    logoutButton.addEventListener("click",(e) =>{
        e.preventDefault();
        sessionStorage.clear();
        window.location.href = "./index.html";
      });
    }
  }
admin() 

//Displaying the  gallery in the modal    
async function displayModalContent() {
  const modalContent = document.querySelector(".modalContent")
  modalContent.innerHTML ="";
  const works = await getWorks();
    works.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const span = document.createElement("span");
      const trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash-can");
      trash.id = work.id;
      img.src = work.imageUrl;
      span.appendChild(trash);
      figure.appendChild(span);
      figure.appendChild(img);
      modalContent.appendChild(figure);
    });
    deleatingWorks()
  };
displayModalContent()  

function shutDown() {
  const containerModal = document.querySelector(".containerModal"); 
  const xmark = document.querySelector(".fa-xmark"); 
  edit.addEventListener("click", () => {
   containerModal.style.display = "flex";
  });
//manage the closing of the model on the cross
  xmark.addEventListener("click", () => {
  containerModal.style.display = "none";
});
//manage the closing of the model by clicking outside it
containerModal.addEventListener("click", (e) => {   
  if (e.target.className == "containerModal") {
  containerModal.style.display = "none";
}
  });
}
shutDown()

//Deleting the works in the modal
async function deleatingWorks() {
  const trashCan = document.querySelectorAll(".fa-trash-can");
  let token = sessionStorage.getItem("token");
  trashCan.forEach(trash => {
    trash.addEventListener("click", () => {
      const id = trash.id
       fetch(
        `http://localhost:5678/api/works/${id}`,
        {
          method: "DELETE",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
        if(!response.ok); {
        }
        return response.json;
      })
      .then(()=>{
      alert("L'entrée de la base de données a été supprimée");
      displayModalContent()
      addWorks()
    })
  });
});
} 
deleatingWorks()

//Appearence of the modal when clicked on "Ajouter un photo"
 const addPictureBtn = document.querySelector(".addPictureBtn");
 const modal = document.querySelector(".modal");
 const containerModal = document.querySelector(".containerModal");
 const header = document.querySelector(".header .fa-xmark");
 const left = document.querySelector(".header .fa-arrow-left");
 async function appearenceWindow() {
  addPictureBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    containerModal.style.display = "none";
  })
  header.addEventListener("click", () => {
    modal.style.display = "none";
  })
  left.addEventListener("click", () => {
    containerModal.style.display = "flex";
    modal.style.display = "none";
 })
 modal.addEventListener("click", (e) => {   
  if (e.target.className == "modal") {
  modal.style.display = "none";
}
  });
}
appearenceWindow()

//Listen to the changes in the input file
const img = document.querySelector(".addImage img");
const inputFile = document.querySelector(".modal input");
const labelFile = document.querySelector(".modal label");
const iconFile = document.querySelector(".addPhoto .fa-image");
const pFile = document.querySelector(".addPhoto p");
inputFile.addEventListener ("change",()=>{
  const file =inputFile.files[0]
  if (file){
    const reader = new FileReader();
    reader.onload = function (e) {
    img.src = e.target.result
    img.style.display = "flex";
    labelFile.style.display = "none";
    iconFile.style.display = "none";
    pFile.style.display = "none";
    }
    reader.readAsDataURL(file);
  }
})

//Create a list of categories on the input select
async function displayModalCategory (){
  const select = document.querySelector("select#categorySelection");
  const categories = await getCategories();
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
displayModalCategory()

//Adding images 
const form = document.querySelector(".modal form");
form.addEventListener("submit", async (e) => {
e.preventDefault();
const title = document.getElementById("title");
const fileInput = document.getElementById("file");
const category = document.getElementById("categorySelection");
  const formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", category.value);
    formData.append("image", fileInput.files[0]);
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
    })
    .then(response => {
        if (!response.ok) {
          throw new error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert("Nouveau travail ajouté", data);
        addWorks();
        displayModalContent();
        //Closing the modal automatically when the form is validated
       document.querySelector(".modal").style.display = "none";
       //Resting the form
       form.reset();
       document.querySelector(".addImage img").style.display = "none";
       document.querySelector(".modal label").style.display = "flex";
       document.querySelector(".addPhoto .fa-image").style.display = "flex";
       document.querySelector(".addPhoto p").style.display = "flex";
     })
    .catch(error => console.log("voici l'error", error));
})

//The submit button color changes to green when the form is filled correctly
const title = document.getElementById("title");
const file = document.getElementById("file");
const select = document.getElementById("categorySelection");
const valider = document.getElementById("valider");
function changeSubmitBtnColor() {
  if (title.value !== "" && file.files[0] !== undefined && select.value !== "") {
      valider.style.backgroundColor = "#1D6154";
  } else {
      valider.style.backgroundColor = ""; 
  }
}
document.getElementById("title").addEventListener("input", changeSubmitBtnColor);
document.getElementById("file").addEventListener("change", changeSubmitBtnColor);
document.getElementById("categorySelection").addEventListener("change", changeSubmitBtnColor);





  
 
  



