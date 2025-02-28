document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.getElementById("menu-container");
  const filtersContainer = document.getElementById("filters-container");
  const filterToggle = document.getElementById("filter-toggle");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const modalClose = document.getElementById("modal-close");

  let menuData = [];

  // Cargar datos desde db.json
  fetch("db.json")
    .then((response) => response.json())
    .then((data) => {
      menuData = data.menu;
      generateFilterButtons(menuData);
      renderMenu(menuData);
    })
    .catch((error) => console.error("Error al cargar los datos:", error));

  function generateFilterButtons(menu) {
    const allButton = document.createElement("button");
    allButton.classList.add("filter-btn");
    allButton.dataset.category = "all";
    allButton.textContent = "Todos";
    allButton.addEventListener("click", () => filterMenu("all"));
    filtersContainer.appendChild(allButton);

    const categories = [...new Set(menu.map((item) => item.category))];
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.classList.add("filter-btn");
      button.dataset.category = category;
      button.textContent = category;
      button.addEventListener("click", () => filterMenu(category));
      filtersContainer.appendChild(button);
    });
  }

  function renderMenu(menu) {
    menuContainer.innerHTML = "";
  
    menu.forEach((category) => {
      // Crear un contenedor para la categoría
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category-section");
  
      // Título de la categoría
      const categoryTitle = document.createElement("h2");
      categoryTitle.textContent = category.category;
      categoryTitle.classList.add("category-title");
      categoryDiv.appendChild(categoryTitle);
  
      // Contenedor de los productos dentro de la categoría
      const itemsContainer = document.createElement("div");
      itemsContainer.classList.add("items-container");
  
      category.items.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("card");
  
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;
        img.addEventListener("click", () => openModal(item.image));
        card.appendChild(img);
  
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("info");
  
        const title = document.createElement("h3");
        title.textContent = item.name;
        infoDiv.appendChild(title);

        const description = document.createElement("p");
        description.textContent = item.description;
        description.classList.add("description");
        infoDiv.appendChild(description);
  
        const priceList = document.createElement("ul");
        priceList.classList.add("price-list");
        
        // Verifica si el precio es un array
        if (Array.isArray(item.price)) {
            item.price.forEach(priceItem => {
                const li = document.createElement("li");
                li.textContent = `Bs. ${priceItem.trim()}`;
                priceList.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = `Bs. ${item.price}`;
            priceList.appendChild(li);
        }
        
        infoDiv.appendChild(priceList);
        
        
  
        card.appendChild(infoDiv);
        itemsContainer.appendChild(card);
      });
  
      // Agregar el contenedor de productos al de la categoría
      categoryDiv.appendChild(itemsContainer);
      menuContainer.appendChild(categoryDiv);
    });
  }
  
  
  document.getElementById("filter-toggle").addEventListener("click", () => {
    const filterOptions = document.getElementById("filter-options");
    filterOptions.classList.toggle("show");
  });
  

    
  // Funcionalidad de los botones de filtros
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");

      // Cambiar estilo activo
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filtrar por categoría
      if (category === "all") {
        renderMenu(menuData);
      } else {
        const filteredData = menuData.filter((item) => item.category === category);
        renderMenu(filteredData);
      }
    });
  });


// Mostrar/Ocultar filtros en pantallas pequeñas
filterToggle.addEventListener("click", () => {
  filtersContainer.style.display =
    filtersContainer.style.display === "flex" ? "none" : "flex";
});


  function openModal(imageSrc) {
    modalImage.src = imageSrc;
    modal.classList.add("open");
  }

  function closeModal() {
    modal.classList.remove("open");
    modalImage.src = "";
    modalDescription.textContent = "";
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function filterMenu(category) {
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Quitar la clase active de todos los botones
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    // Agregar la clase active al botón seleccionado
    const activeButton = [...filterButtons].find(
      (btn) => btn.dataset.category === category
    );
    if (activeButton) activeButton.classList.add("active");

    // Lógica de filtrado
    if (category === "all") {
      renderMenu(menuData);
    } else {
      const filteredData = menuData.filter(
        (cat) => cat.category === category
      );
      renderMenu(filteredData);
    }
  }
});
