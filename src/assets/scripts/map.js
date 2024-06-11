function initMap() {
    console.log("Initialisation de la carte...");

    var laiterieLocation = {lat: 44.83075, lng: -0.566653};
    console.log("Coordonnées de la laiterie : ", laiterieLocation);

    var mapOptions = {
        zoom: 15,
        center: laiterieLocation,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    console.log("Options de la carte : ", mapOptions);

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    if (map) {
        console.log("La carte a été chargée avec succès.");
    } else {
        console.log("Erreur lors du chargement de la carte.");
    }

    var marker = new google.maps.Marker({
        position: laiterieLocation,
        map: map,
        title: 'Laiterie Burdigala'
    });

    if (marker) {
        console.log("Marqueur placé à l'emplacement de la laiterie.");
    }
}
