class Circuito {
    constructor() {
      this.inputArchivos = document.querySelector("input")
      this.section = document.querySelector("section")
      this.map = null
      this.initEventListeners()
    }
  
    initEventListeners() {
      this.inputArchivos.addEventListener("change", () => this.seleccionarArchivo())
    }
  
    seleccionarArchivo() {
      const archivos = Array.from(this.inputArchivos.files)
      archivos.forEach(archivo => {
        const extension = archivo.name.split('.').pop().toLowerCase()
        if (extension === 'xml') {
          this.leerArchivoXML(archivo)
        } else if (extension === 'kml') {
          this.leerArchivoKML(archivo)
        } else if (extension === 'svg') {
          this.leerArchivoSVG(archivo)
        }
      })
    }
  
    leerArchivoXML(archivo) {
      const lector = new FileReader()
  
      lector.onload = (e) => {
        const contenidoXML = e.target.result
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(contenidoXML, 'text/xml')
        this.mostrarContenidoXML(xmlDoc)
      }
  
      lector.readAsText(archivo)
    }
  
    mostrarContenidoXML(archivo) {
      const htmlContent = this.recorrerNodos(archivo.documentElement)
      const article = document.createElement("article")
      $(article).append("<h3>Contenido XML</h3>")
      const ul = $("<ul>")
      ul.append(htmlContent)
      $(article).append(ul)
      $(this.section).append(article)
    }
  
    recorrerNodos(nodo) {
      let html = ""
      if (nodo.nodeType === Node.ELEMENT_NODE) {
        html += "<li><strong>" + nodo.nodeName + "</strong>"
  
        if (nodo.nodeName.toLowerCase() === "referencia" && nodo.getAttribute("enlace")) {
          const enlace = nodo.getAttribute("enlace")
          html += "<ul><li><a href=" + enlace +  " target='_blank'>Enlace</a></li></ul>"
        } else if (nodo.nodeName.toLowerCase() === "foto" && nodo.getAttribute("enlace")) {
          const enlace = nodo.getAttribute("enlace")
          html += "<ul><li><img src=" + enlace + " alt='Foto'></li></ul>"
        } else if (nodo.nodeName.toLowerCase() === "vídeo" && nodo.getAttribute("enlace")) {
          const enlace = nodo.getAttribute("enlace")
          html += "<ul><li><video controls=''><source src='" + enlace +  "' type='video/mp4'></video></li></ul>"
        } else if (nodo.attributes && nodo.attributes.length > 0) {
          html += "<ul>"
          Array.from(nodo.attributes).forEach(attr => {
            html += "<li><strong>" + attr.name + ":</strong>" + attr.value + "</li>"
          })
          html += "</ul>"
        }
  
        if (nodo.childNodes && nodo.childNodes.length > 0) {
          html += "<ul>"
          Array.from(nodo.childNodes).forEach(childNode => {
            if (childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() !== "") {
              html += `<li>${childNode.nodeValue.trim()}</li>`
            } else if (childNode.nodeType === Node.ELEMENT_NODE) {
              html += this.recorrerNodos(childNode)
            }
          })
          html += "</ul>"
        }
  
        html += "</li>"
      }
      return html
    }
  
    leerArchivoKML(archivo) {
      const reader = new FileReader()
  
      reader.onload = (event) => {
        const kml = event.target.result
        const parser = new DOMParser()
        const doc = parser.parseFromString(kml, 'text/xml')
  
        const coordenadas = doc.querySelectorAll('coordinates')
        let puntos = []
  
        coordenadas.forEach(coordenada => {
          const coords = coordenada.textContent.trim().split(' ')
          coords.forEach(coord => {
            const [lng, lat] = coord.split(',')
            puntos.push({ lat: parseFloat(lat), lng: parseFloat(lng) })
          })
        })
  
        this.agregarMarcadoresYLínea(puntos)
      }
  
      reader.readAsText(archivo)
    }
  
    initMap() {
      const article = document.createElement("article")
      $(article).append("<h3>Mapa dinámico</h3>")
      const div = document.createElement("div")
      article.append(div)
      div.contentEditable = false
      $(this.section).append(article)
  
      this.map = new google.maps.Map(div, {
        center: { lat: 52.069219, lng: -1.022263 },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      })
    }
  
    agregarMarcadoresYLínea(puntos) {
      const coordenadas = [];
      this.initMap()
      
      puntos.forEach(punto => {
        const marcador = new google.maps.Marker({
          position: punto,
          map: this.map
        });
        coordenadas.push(punto);
      })
  
      const polyline = new google.maps.Polyline({
        path: coordenadas,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      })
  
      polyline.setMap(this.map)
    }
  
    leerArchivoSVG(archivo) {
      const article = document.createElement("article")
      $(article).append("<h3>Altimetría</h3>")
      $(this.section).append(article)
  
      const reader = new FileReader()
      
      reader.onload = (event) => {
        const contenidoSVG = event.target.result
        article.insertAdjacentHTML("beforeend", contenidoSVG)
      }
  
      reader.readAsText(archivo)
    }
}  
const circuito = new Circuito()
  