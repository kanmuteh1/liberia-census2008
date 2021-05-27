let total_population_area = document.querySelector("#total-population b");
let total_female_area = document.querySelector("#total-female b");
let total_male_area = document.querySelector("#total-male b");

fetch('census.json')
.then(res => res.json())
.then(data => {
    /*
    calculate the total number of female and female than find the total population
    */
    let population = data.population;
    let initialValue = 0
    // calculate total female
    let total_female = population.reduce(
    (accumulator, currentValue) => accumulator + currentValue.female
    , initialValue
    )
    // calculate total male
    let total_male = population.reduce(
    (accumulator, currentValue) => accumulator + currentValue.male
    , initialValue
    )

    let total_population = total_female + total_male;
    // out put populatio count downs totals
    total_population_area.innerHTML = total_population;
    total_female_area.innerHTML = total_female;  
    total_male_area.innerHTML = total_male;   
})