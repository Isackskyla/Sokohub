// location-selectors.js
import { kenyanCountiesAndTowns } from './data.js';
import { getReadableCountyName } from './utils.js';

export function populateCounties(countySelectId) {
    const countySelect = document.getElementById(countySelectId);
    countySelect.innerHTML = "<option value='all'>Select Your County</option>";

    const sortedCounties = Object.keys(kenyanCountiesAndTowns).sort();
    sortedCounties.forEach(countyKey => {
        let opt = document.createElement("option");
        opt.value = countyKey;
        opt.textContent = getReadableCountyName(countyKey);
        countySelect.appendChild(opt);
    });
}

export function populateTowns(countySelectId, townSelectId, placeSelectId) {
    const countySelect = document.getElementById(countySelectId);
    const townSelect = document.getElementById(townSelectId);
    const placeSelect = document.getElementById(placeSelectId);

    const selectedCounty = countySelect.value;

    townSelect.innerHTML = "<option value='all'>Select Town</option>";
    placeSelect.innerHTML = "<option value='all'>Select Specific Place (Optional)</option>";

    if (selectedCounty !== 'all' && kenyanCountiesAndTowns[selectedCounty]) {
        const towns = kenyanCountiesAndTowns[selectedCounty].sort();
        towns.forEach(town => {
            let opt = document.createElement("option");
            opt.value = town;
            opt.textContent = town;
            townSelect.appendChild(opt);
        });
    }
    populateSpecificPlaces(countySelectId, townSelectId, placeSelectId);
}

export function populateSpecificPlaces(countySelectId, townSelectId, placeSelectId) {
    const countySelect = document.getElementById(countySelectId);
    const townSelect = document.getElementById(townSelectId);
    const placeSelect = document.getElementById(placeSelectId);

    const selectedCounty = countySelect.value;
    const selectedTown = townSelect.value;

    placeSelect.innerHTML = "<option value='all'>Select Specific Place (Optional)</option>";

    if (selectedCounty !== 'all' && selectedTown !== 'all') {
        const genericPlaces = [
            "Town Center", "Main Bus Stop", "Post Office", "Near [Landmark A]", "Opposite [Landmark B]"
        ];
        genericPlaces.forEach(place => {
            let opt = document.createElement("option");
            opt.value = `${selectedTown} - ${place}`;
            opt.textContent = place;
            placeSelect.appendChild(opt);
        });
    }
}

