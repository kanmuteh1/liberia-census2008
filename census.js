// population calculation variables
let total_population_area = document.querySelector("#total-population b");
let total_female_area = document.querySelector("#total-female b");
let total_male_area = document.querySelector("#total-male b");
// charts variables
let counties_chat = document.getElementById("counties-bar-chat").getContext('2d');
let male_and_female_doughnut_chat = document.getElementById("male-and-female-doughnut-chat").getContext('2d');
let district_population_chat = document.getElementById("population-per-district-chat").getContext('2d');
let household_population_chat = document.getElementById("population-per-household-chat").getContext('2d');

// get data from json file
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
// counties population bar chart
let counties_population_chat = new Chart(counties_chat, {
    type:'bar',
    data:{
        labels:['Bomi','Bong','Gbarpolu','Grand Bassa','Grand Cape Mount','Grand Gedeh','Grand Kru','Lofa','Margibi','Maryland','Montserrado','Nimba','River Cess','River Gee','Sinoe'],
        datasets:[{
            label:'population',
            data:[
                6850,
                4765,
                2749,
                7464,
                84743 
            ]
        }]
    },
    options:{}
})

// mape and female doughnut chart
let male_and_female_doughnut_chat_percent = new Chart(male_and_female_doughnut_chat, {
    type:'doughnut',
    data:{
        datasets:[{
            label:'population',
            data:[
                6850,
                4765, 
            ]
        }],
        labels:['Male','Female'],
    },
    options:{}
})

// district poipulation chart
let population_district_chat = new Chart(district_population_chat, {
    type:'bar',
    data:{
        labels:['Grand Geadeh', 'Maryland','Nimba','Grand Kru','Grand Bassa'],
        datasets:[{
            label:'none',
            data:[
                6850,
                4765,
                2749,
                7464,
                84743 
            ]
        }]
    },
    options:{}
})

let population_household_chat = new Chart(household_population_chat, {
    type:'bar',
    data:{
        labels:['Grand Geadeh', 'Maryland','Nimba','Grand Kru','Grand Bassa'],
        datasets:[{
            label:'population',
            data:[
                6850,
                4765,
                2749,
                7464,
                84743 
            ]
        }]
    },
    options:{}
})