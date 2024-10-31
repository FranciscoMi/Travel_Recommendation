'use strict';

/*
Asyncronous Javascript

*/

document.addEventListener("DOMContentLoaded",()=>{
  //Atributes
  const searchBtn=document.querySelector("#searchBtn");
  const clearBtn=document.querySelector("#clearBtn");
  const findBoxer=document.querySelector("#findBoxer");
  
  //Models
  const url="./assets/json/travel_recommendation_api.json"
  
  //Controllers
  function getCountries(){
    return fetch(url)
    .then (response=>response.json())
    .then (data=>{
      return data;
    })
    .catch(error=>{
      console.log(`Error ${error}:`);
      return[];
    })
  }

  function searchtravels(travel){
    
    getCountries().then(countries=>{

       //Dictionary for the categories's keywords
       const categories ={
        beach: "beaches",
        beaches: "beaches",
        temple: "temples",
        temples: "temples",
        country: "countries",
        countries: "countries"
      };

      //We check these keyword and variations that th user will enter in the search field
      travel=categories[travel.toLowerCase()];
      if (countries[travel] && Array.isArray(countries[travel])) {
        
        // If `travel` is a valid category, then return a new array with name, imageUrl and description
        const searchResult=countries[travel].map(item=>({
          name: item.name,
          imageUrl: item.imageUrl,
          description: item.description
        })); 
        return searchResult;
      }else{
        return[];
      }//end if-else
      // Object.keys(countries).forEach(element => {
      //   if (Array.isArray(countries[element])){
      //     console.log(countries[element]);
      //     countries[element].forEach(item => {
      //       if (item.name.toLowerCase().includes(travel.toLowerCase())) {
      //         console.log(item); 
      //       }//end if
      //     })//end countries
      //   }//end if
      // })//end object
    })
  }

  //Views
  
  //Search Button
  searchBtn.addEventListener("click",()=>{
    const searchInput=document.getElementById("searchInput");
    const findData=searchtravels(searchInput.value);
    console.log(findData);
  });

  //Clear Button
  clearBtn.addEventListener("click",()=>{
    while(findBoxer.firstChild){
      findBoxer.removeChild(findBoxer.firstChild);
    }
  });

});//end DOMContent