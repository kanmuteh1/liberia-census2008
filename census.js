// data variables
let population_data;
let households_data;
// charts containers variables
const counties_chart = document.getElementById("counties-bar-chart").getContext('2d');
const male_and_female_doughnut_chart = document.getElementById("male-and-female-doughnut-chart").getContext('2d');
let district_population_chart = document.getElementById("population-per-district-chat").getContext('2d');
let household_population_chart = document.getElementById("population-per-household-chat").getContext('2d');
// district's chart
let district_chart = new Chart(district_population_chart, {
    type:'bar',
    data:{
        labels: [],
        datasets:[{
            label:'Male population per district',
            data: []
        },
        {
            label:'Female population per district',
            data: []
        }]
    },
    options:{}
})
// household's chart
let household_chart = new Chart(household_population_chart, {
    type:'bar',
    data:{
        labels: [],
        datasets:[{
            label:'Male population per household',
            data: []
        },
        {
            label:'Female population per household',
            data: []
        },
        {
            label:'Household number',
            data: []
        }]
    },
    options:{}
})

let district_selected_county;
let household_selected_county;

// get data from json file
fetch('census.json')
.then(res => res.json())
.then(data => {
    // calculate the total number of female and female than find the total population
    population_data = data.population;
    households_data = data.households
    // counties population data preparation
    const male = accumulateMalePopulation(population_data);
    const female = accumulateFemalePopulation(population_data)
    const total_population = accumulatePopulation(female, male)
    // out put population count downs totals  
    displayAccumulatedCountyData(male,female,total_population);

    const all_counties = getCounties(population_data);
    const male_population_per_county = accumulateMalePopulationPerCounty(population_data,all_counties);
    const female_population_per_county = accumulateFemalePopulationPerCounty(population_data,all_counties);
    const county_total_population = accumulatePopulationPerCounty(male_population_per_county,female_population_per_county);
    // counties population bar chart
    let counties_population_chart = new Chart(counties_chart, {
        type:'bar',
        data:{
            labels: all_counties,
            datasets:[{
                label:'population',
                data:county_total_population,
                backgroundColor: "#519872",
                borderRadius: 25
            }
        ]
        },
        options:{}
    })
    // male and female doughnut chart
    let male_and_female_doughnut_chart_percent = new Chart(male_and_female_doughnut_chart, {
        type:'doughnut',
        data:{
            datasets:[{
                label:'population',
                data:[
                    female,
                    male,
                ],
                backgroundColor: ["#F0F2EF","#B1D2C2"]
            }],
            labels:['Female','Male'],
        },
        options:{}
    })

    createCountiesDistrictOptions(all_counties);
    createCountiesHouseholdOptions(all_counties)
    setUpDistrictChart();
    setUpHouseholdChart();
})

// get the population data and returns the total male population
function accumulateMalePopulation(population_arr)
{
    const total_male = population_arr.reduce((acc, curr) => acc + curr.male, 0);
    return total_male;
}
// get the population data and returns the total female population
function accumulateFemalePopulation(population_arr)
{
    const female = population_arr.reduce((acc, curr) => acc + curr.female, 0);
    return female;
}
// get the population data and returns the total population
function accumulatePopulation(total_female, total_male)
{
    let total_population = total_female + total_male;
    return total_population;
}

// display the accumulated male, female and population per county value
function displayAccumulatedCountyData(total_male,total_female,total_population)
{
    const total_male_area = document.querySelector("#total-male b");
    const total_female_area = document.querySelector("#total-female b");
    const total_population_per_county = document.querySelector("#total-population b");
    total_male_area.innerHTML = total_male;
    total_female_area.innerHTML = total_female;
    total_population_per_county.innerHTML = total_population;
}
// get the population data and returns all the counties in an array 
function getCounties(population_arr)
{
    const counties = [];
    population_arr.forEach(ele => {
        if (!counties.includes(ele.county))
        {
            counties.push(ele.county);
        }
    });
    return counties;
}
// calculate the male population per-county given the population data
function accumulateMalePopulationPerCounty(population_arr,counties_arr)
{
    const male_population_pre_county = [];
    for (let i = 0; i < counties_arr.length; i++)
    {
        let male = 0;
        for (let j = i; j < population_arr.length; j++)
        {
            if (counties_arr[i] === population_arr[j].county)
            {
                male += population_arr[j].male; 
            }
        }
        male_population_pre_county.push(male);
    }
    return male_population_pre_county;
}
// calculate the male population per-county given the population data
function accumulateFemalePopulationPerCounty(population_arr,counties_arr)
{
    const female_population_pre_county = [];
    for (let i = 0; i < counties_arr.length; i++)
    {
        let female = 0;
        for (let j = i; j < population_arr.length; j++)
        {
            if (counties_arr[i] === population_arr[j].county)
            {
                female += population_arr[j].female; 
            }
        }
        female_population_pre_county.push(female);
    }
    return female_population_pre_county;
}
// calculate the population per-county given the population data
function accumulatePopulationPerCounty(male_per_county,female_per_county)
{
    let population_pre_county = [];
    for (let i = 0; i < male_per_county.length; i++)
    {
        population_pre_county.push(male_per_county[i] + female_per_county[i])
    }
    return population_pre_county;
}
// select county to show county district bar chart
function createCountiesDistrictOptions(counties)
{
    let selection_area = document.getElementById("counties-selection-area");
    for (let i = 0; i < counties.length; i++)
    {
        let county_options = `<option value="${counties[i]}">${counties[i]}</option>`
        selection_area.insertAdjacentHTML("beforeend", county_options);
    }
    return selection_area;
}
// get selected county from the county from the selectCounty fnx and pass it to the district graph fnx
function setUpDistrictChart()
{   
    let selection_area = document.getElementById("counties-selection-area");
    district_selected_county = selection_area.options[selection_area.selectedIndex].text;
    let district_data = population_data.filter((population) =>
    {
       if (population.county === district_selected_county)
       {
           return true;
       }
        return false;
    });
    let districts_name = getDistrictName(district_data);
    let male_population_per_district = getMalePopulationPerDistrct(district_data);
    let female_population_per_district = getFemalePopulationPerDistrct(district_data);
    updateDistrictChart(district_chart,districts_name,male_population_per_district,female_population_per_district);
}
// this function takes a district-array of onject and return the districts name in an array
function getDistrictName(district_data)
{
    let districts_name = [];
    for (let i = 0; i < district_data.length; i++)
    {
        districts_name.push(district_data[i].district);
    }
    return districts_name;
}
// this fnx gets the male population per district and return them in an array
function getMalePopulationPerDistrct(district_data)
{
    let male_population_pre_district = [];
    for (let i = 0; i < district_data.length; i++)
    {
        male_population_pre_district.push(district_data[i].male)
    }
    return male_population_pre_district;
}
// this fnx gets the female population per district and return them in an array
function getFemalePopulationPerDistrct(district_data)
{
    let female_population_pre_district = [];
    for (let i = 0; i < district_data.length; i++)
    {
        female_population_pre_district.push(district_data[i].female);
    }
    return female_population_pre_district;
}
// this function updates the district bar chart each time it is call
function updateDistrictChart(district_chart,districts_name,districts_male,districts_female)
{
    district_chart.data.labels = districts_name;
    district_chart.data.datasets = [];

    district_chart.data.datasets.push({
        label:'Male population per district',
        data: districts_male,
        backgroundColor: "#519872",
        borderRadius: 25
    },
    {
        label:'Female population per district',
        data: districts_female,
        backgroundColor: "#B1D2C2",
        borderRadius: 25
    });
    district_chart.update();
}
// select county to show county household bar chart
function createCountiesHouseholdOptions(counties)
{
    let household_selection_area = document.getElementById("counties-household-selection-area");
    for (let i = 0; i < counties.length; i++)
    {
        let county_household_options = `<option value="${counties[i]}">${counties[i]}</option>`
        household_selection_area.insertAdjacentHTML("beforeend", county_household_options);
    }
    return household_selection_area;
}

function setUpHouseholdChart()
{   
    let housedold_selection_area = document.getElementById("counties-household-selection-area");
    household_selected_county = housedold_selection_area[housedold_selection_area.selectedIndex].text;
    let household_data = households_data.filter((household) =>
    {
        console.log(household.county)
       if (household.county === household_selected_county)
       {
           return true;
       }
        return false;
    });
    let settlement_name = getHouseholdSettlementtName(household_data)
    let male_household_population = getMalePopulationPerHousehold(household_data);
    let female_household_population = getFemalePopulationPerHousehold(household_data);
    let household_number = getNumberOfHousehold(household_data);
    updateHouseholdChart(household_chart,settlement_name,male_household_population,female_household_population,household_number);
}

function getHouseholdSettlementtName(household_data)
{
    let household_name = [];
    for (let i = 0; i < household_data.length; i++)
    {
        household_name.push(household_data[i].settlement);
    }
    return household_name;
}
// this fnx sun up the male population per district and return them in an array
function getMalePopulationPerHousehold(household_data)
{
    let male_household_population = [];
    for (let i = 0; i < household_data.length; i++)
    {
        male_household_population.push(household_data[i].male)
    }
    return male_household_population;
}
// this fnx sun up the female population per district and return them in an array
function getFemalePopulationPerHousehold(household_data)
{
    let female_household_population = [];
    for (let i = 0; i < household_data.length; i++)
    {
        female_household_population.push(household_data[i].female);
    }
    return female_household_population;
}
// this fnx sun up the male & female population per district and return them in an array
function getNumberOfHousehold(household_data)
{
    let household_number = [];
    for (let i = 0; i < household_data.length; i++)
    {
        household_number.push(household_data[i].household_number)
    }
    return household_number;
}
// this function updates the district bar chart each time it is call
function updateHouseholdChart(household_chart,settlement_name,male_household_population,female_household_population,household_number)
{
    household_chart.data.labels = settlement_name;
    household_chart.data.datasets = [];
    household_chart.data.datasets.push({
        label:'Male population per household',
        data: male_household_population,
        backgroundColor: "#519872",
        borderRadius: 25
    },
    {
        label:'Female population per household',
        data: female_household_population,
        backgroundColor: "#B1D2C2",
        borderRadius: 25
    },
    {
        label:'Household number',
        data: household_number,
        borderRadius: 25
    });
    household_chart.update();
}


