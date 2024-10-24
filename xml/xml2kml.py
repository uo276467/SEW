import xml.etree.ElementTree as ET

class Kml(object):
    """
    Genera archivo KML con puntos y líneas
    """
    def __init__(self):
        """
        Crea el elemento raíz y el espacio de nombres
        """
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz,'Document')

    def addPlacemark(self,nombre,descripcion,long,lat,alt, modoAltitud):
        """
        Añade un elemento <Placemark> con puntos <Point>
        """
        pm = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(pm,'name').text = '\n' + nombre + '\n'
        ET.SubElement(pm,'description').text = '\n' + descripcion + '\n'
        punto = ET.SubElement(pm,'Point')
        ET.SubElement(punto,'coordinates').text = '\n{},{},{}\n'.format(long,lat,alt)
        ET.SubElement(punto,'altitudeMode').text = '\n' + modoAltitud + '\n'

    def escribir(self,nombreArchivoKML):
        """
        Escribe el archivo KML con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

    def ver(self):
        """
        Muestra el archivo KML. Se utiliza para depurar
        """
        print("\nElemento raiz = ", self.raiz.tag)

        if self.raiz.text != None:
            print("Contenido = "    , self.raiz.text.strip('\n')) #strip() elimina los '\n' del string
        else:
            print("Contenido = "    , self.raiz.text)
        
        print("Atributos = "    , self.raiz.attrib)

        # Recorrido de los elementos del árbol
        for hijo in self.raiz.findall('.//'): # Expresión XPath
            print("\nElemento = " , hijo.tag)
            if hijo.text != None:
                print("Contenido = ", hijo.text.strip('\n')) #strip() elimina los '\n' del string
            else:
                print("Contenido = ", hijo.text)    
            print("Atributos = ", hijo.attrib)


def procesar_xml_a_kml(xml_file, kml_file):
    """
    Procesa el archivo XML y convierte los puntos del circuito a KML
    """
    # Parsear el archivo XML
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Crear instancia del objeto Kml
    kml = Kml()

    # Extraer la información de los tramos y sus coordenadas
    puntos = root.find('puntos')
    if puntos is not None:
        tramos = puntos.findall('tramo')
        for tramo in tramos:
            distancia = tramo.find('distancia').attrib['valor'] + " " + tramo.find('distancia').attrib['unidades']
            coordenadas = tramo.find('coordenadas')
            longitud = coordenadas.attrib.get('longitud')
            latitud = coordenadas.attrib.get('latitud')
            altitud = coordenadas.attrib.get('altitud', '0').replace('m', '')
            sector = tramo.find('sector').text

            # Añadir un placemark por cada tramo
            kml.addPlacemark(f"Tramo Sector {sector}",
                             f"Distancia: {distancia}",
                             longitud, latitud, altitud,
                             'relativeToGround')

    # Guardar el archivo KML
    kml.escribir(kml_file)
    kml.ver()

def main():
    # Nombre del archivo XML y del archivo KML de salida    
    xml_file = "circuitoEsquema.xml"
    kml_file = "circuito.kml"

    # Procesar el XML y generar el archivo KML
    procesar_xml_a_kml(xml_file, kml_file)

    print(f"Archivo KML creado: {kml_file}")

if __name__ == "__main__":
    main()
