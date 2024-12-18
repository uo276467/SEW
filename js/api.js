class Notas {
    constructor() {
      this.inputFile = document.querySelector("input");
      this.article = document.querySelector("article");
      this.section = document.querySelector("section");
      this.button = document.querySelector("button");
      
      this.initEventListeners();
    }
  
    initEventListeners() {
      this.inputFile.addEventListener("change", () => this.seleccionarArchivo());
      this.article.addEventListener("drop", (e) => this.soltarNota(e));
      this.article.addEventListener("dragover", (e) => e.preventDefault());
      this.button.addEventListener("click", () => this.alternarFullscreen());
    }
  
    seleccionarArchivo() {
      const archivo = this.inputFile.files[0];
      const tipoTexto = /text.*/;
      if (archivo.type.match(tipoTexto)) {
        this.añadirNotas(archivo);
      }
      this.inputFile.value = "";
    }
  
    añadirNotas(archivo) {
      const lector = new FileReader();
      lector.readAsText(archivo);
      lector.onload = () => {
        const notas = lector.result.split("\n");
        notas.forEach(nota => {
          const lineas = nota.split("_");
          const aside = document.createElement("aside");
          aside.draggable = true;
  
          const h4 = document.createElement("h5");
          h4.textContent = lineas[0];
          const p = document.createElement("p");
          p.textContent = lineas[1];
  
          aside.appendChild(h4);
          aside.appendChild(p);
  
          this.article.appendChild(aside);
  
          this.agregarDragAndDrop(aside);
        });
      };
    }
  
    agregarDragAndDrop(aside) {
      aside.addEventListener("dragstart", (e) => this.empezarDrag(e));
    }
  
    empezarDrag(e) {
      const rect = e.target.getBoundingClientRect();
      e.dataTransfer.setData("offsetX", e.clientX - rect.left);
      e.dataTransfer.setData("offsetY", e.clientY - rect.top);
      e.dataTransfer.effectAllowed = "move";
    }
  
    soltarNota(e) {
      e.preventDefault();
      const offsetX = parseFloat(e.dataTransfer.getData("offsetX"));
      const offsetY = parseFloat(e.dataTransfer.getData("offsetY"));
      const aside = document.querySelector('[draggable="true"]:hover');
      if (aside) {
        const rect = this.article.getBoundingClientRect();
        aside.style.position = "absolute";
        aside.style.left = `${e.clientX - rect.left - offsetX}px`;
        aside.style.top = `${e.clientY - rect.top - offsetY}px`;
      }
    }
  
    alternarFullscreen() {
      if (!document.fullscreenElement) {
        if (this.section.requestFullscreen) {
          this.section.requestFullscreen();
        } else if (this.section.webkitRequestFullscreen) {
          this.section.webkitRequestFullscreen();
        } else if (this.section.msRequestFullscreen) {
          this.section.msRequestFullscreen();
        }
        this.button.textContent = "Salir de Pantalla Completa";
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.button.textContent = "Pantalla Completa";
      }
    }
}
const notas = new Notas()