"use strict";

document.addEventListener("DOMContentLoaded", () => {
  //Atributes
  const searchBtn = document.querySelector("#searchBtn");
  const clearBtn = document.querySelector("#clearBtn");
  const findBoxer = document.querySelector("#findBoxer");

  
  //Models
  const url = "./assets/json/travel_recommendation_api.json";

  //Dictionary for the categories's keywords
  const categories = {
    beach: "beaches",
    beaches: "beaches",
    temple: "temples",
    temples: "temples",
    country: "countries",
    countries: "countries",
    city: "cities",
    cities: "cities",
  };

  //Controllers
  function clearDates() {
    while (findBoxer.firstChild) {
      findBoxer.removeChild(findBoxer.firstChild);
    }
  }

  function countryDate(zone, element, countryName){
    const options = { timeZone: zone, hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    setInterval(() => {
      const time = new Date().toLocaleTimeString('en-US', options);
      element.textContent = `${countryName} - ${time}`;
    }, 1000);
  }
  
  /*
  Asyncronous Javascript
  */
  function getTravels(search) {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const travel = categories[search.toLowerCase()];
        if (!travel) {
          return [];
        }
        return extractItems(data[travel]);
      })
      .catch((error) => {
        console.log(`Error ${error}:`);
        return [];
      });
  }

  // Function to extract `name`, `imageUrl` and `description`
  function extractItems(data) {
    let results = [];

    if (Array.isArray(data)) {
      data.forEach((item) => {
        // Add the element if exist `name`, `imageUrl`, and `description`
        if (item.name && item.imageUrl && item.description) {
          results.push({
            name: item.name,
            imageUrl: item.imageUrl,
            visitUrl: item.visitUrl,
            description: item.description,
            dateZone: item.zone
          });
        }
        // Search into sub-levels if is an array (for example, `cities`)
        Object.values(item).forEach((value) => {
          if (Array.isArray(value)) {
            results = results.concat(extractItems(value));
          }
        });
      });
    }
    return results;
  }

  //Views

  //Search Button
  searchBtn.addEventListener("click", async () => {
    clearDates();
    const searchInput = document.getElementById("searchInput");
    const findData = await getTravels(searchInput.value);
    const fragment = new DocumentFragment();

    findData.forEach((element) => {
      const div = document.createElement("div");
      div.classList.add("box");

      const img = document.createElement("img");
      img.src = element.imageUrl;
      img.alt = element.name;
      img.style.width = "100%";
      div.appendChild(img);

      const title = document.createElement("h3");
      title.textContent = `${element.name}`;
      div.appendChild(title);

      countryDate(element.dateZone, title, element.name);

      const description = document.createElement("p");
      description.textContent = element.description;
      div.appendChild(description);

      const visitBtn = document.createElement("a");
      visitBtn.classList.add("button", "button--blue");
      visitBtn.textContent = "Visit";
      visitBtn.href = element.visitUrl;
      visitBtn.target = "_blank";
      div.appendChild(visitBtn);

      fragment.appendChild(div);
    });

    const findBoxer = document.getElementById("findBoxer");
    if (findBoxer) findBoxer.appendChild(fragment);
  });

  //Clear Button
  clearBtn.addEventListener("click", () => {
    clearDates();
  });
}); //end DOMContent
