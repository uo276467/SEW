class Noticias{
    constructor(){
        this.button = document.querySelector("button")
        this.input = document.querySelector("input:first-of-type")
        if (window.File && window.FileReader && window.FileList && window.Blob) {  
            //El navegador soporta el API File
            console.log("Este navegador soporta el API File")
            this.addEventListeners()
        }else{
            console.log("¡¡¡Este navegador NO soporta el API File!!!");
            $("section").append("<p>¡¡¡Este navegador NO soporta el API File!!!</p>")
        }
    }
    addEventListeners(){
        this.button.addEventListener("click", () => this.addNews())
        this.input.addEventListener("change", () => this.readInputFile())
    }
    readInputFile(){
        var archivo = document.querySelector("input").files[0];
        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            this.showInputFile(archivo)
        }   
    }
    showInputFile(archivo){
        var lector = new FileReader();
        lector.readAsText(archivo)
        lector.onload = function (archivo) {
            var noticias = lector.result.split("\n")

            noticias.forEach(noticia => {
                var lineas = noticia.split("_")
                var stringHtml = "<article>"
                stringHtml += "<h3>" + lineas[0] + "</h3>"
                stringHtml += "<p>" + lineas[1] + "</p>"
                stringHtml += "<p>" + lineas[2] + "</p></article>"

                $("section").append(stringHtml);
            });
        }    
    }
    addNews(){
        var titular = document.querySelector("input[placeholder='Titular']").value
        var contenido = document.querySelector("input[placeholder='Contenido']").value
        var autor = document.querySelector("input[placeholder='Autor']").value
        
        var stringHtml = "<article>"
                stringHtml += "<h3>" + titular + "</h3></article>"
                stringHtml += "<p>" + contenido + "</p>"
                stringHtml += "<p>" + autor + "</p></article>"

                $("section").append(stringHtml);
    }
}
const noticias = new Noticias()