function autoComplete(input, latitude, longitude) {
    if(!input) { return; }

    const dropdown = new google.maps.places.Autocomplete(input);
    dropdown.addListener("place_changed", () => {
        const place = dropdown.getPlace();

        latitude.value = place.geometry.location.lat();
        longitude.value = place.geometry.location.lng();
    })

    input.on("keydown", (event) => {
        if(event.keyCode === 13) {
            event.preventDefault();
        }
    })
}

export default autoComplete;