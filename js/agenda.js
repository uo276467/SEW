class Agenda{
    constructor(){
        this.button = document.querySelector("button")
        this.url = "https://ergast.com/api/f1/current.json"
        this.addEventListeners()
    }
    addEventListeners(){
        this.button.addEventListener("click", () => {
            this.cargarDatos()
            this.button.disabled = true
        })
    }
    cargarDatos(){
        $.ajax({
            dataType: "json",
            url: this.url,
            method: 'GET',
            success: function(datos){
                    $("pre").text(JSON.stringify(datos, null, 2)); //muestra el json en un elemento pre

                    var races = datos.MRData.RaceTable.Races
                    var count = 1
                    races.forEach(race => {
                        var carrera = race.raceName
                        var circuito = race.Circuit.circuitName
                        var lat = race.Circuit.Location.lat
                        var long = race.Circuit.Location.long
                        var fecha = race.date
                        var hora = race.time

                        var stringDatos = "<article><h3>Carrera " + count +"</h3>"
                        stringDatos += "<p>Carrera: " + carrera + "</p>"
                        stringDatos += "<p>Circuito: " + circuito + "</p>"
                        stringDatos += "<p>Coordenadas:</p>"
                        stringDatos += "<ul><li>Latitud: " + lat + "º</li>"
                        stringDatos += "<li>Longitud: " + long + "º</li></ul>"
                        stringDatos += "<p>Fecha: " + fecha + "</p>"
                        stringDatos += "<p>Hora: " + hora.substring(0, 5) + "</p></article>"

                        $("section").append(stringDatos);

                        count++
                    });
                },
            error:function(){
                $("p").html("¡Tenemos problemas! No puedo obtener JSON de <a href='https://ergast.com/mrd/'>Ergast</a>"); 
            }
        });
    }
}
const agenda = new Agenda()