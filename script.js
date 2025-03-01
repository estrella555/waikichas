document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.getElementById("menu-container");
  const filtersContainer = document.getElementById("filters-container");
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
    filtersContainer.innerHTML = ""; // Limpia filtros previos

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
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category-section");

      const categoryTitle = document.createElement("h2");
      categoryTitle.textContent = category.category;
      categoryTitle.classList.add("category-title");
      categoryDiv.appendChild(categoryTitle);

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

      categoryDiv.appendChild(itemsContainer);
      menuContainer.appendChild(categoryDiv);
    });
  }

  function filterMenu(category) {
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach((btn) => btn.classList.remove("active"));

    const activeButton = [...filterButtons].find((btn) => btn.dataset.category === category);
    if (activeButton) activeButton.classList.add("active");

    if (category === "all") {
      renderMenu(menuData);
    } else {
      const filteredData = menuData.filter(cat => cat.category === category);
      renderMenu(filteredData);
    }
  }

  function openModal(imageSrc) {
    modalImage.src = imageSrc;
    modal.classList.add("open");
  }

  function closeModal() {
    modal.classList.remove("open");
    modalImage.src = "";
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
});
