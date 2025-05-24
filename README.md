# Angelina Software

**Angelina Software** es un sistema de gestión desarrollado a medida para la empresa **Angelina**, utilizado actualmente para organizar y automatizar tareas clave del negocio.

Este software de escritorio fue creado con **Python** y **Flask**, y está orientado a la **gestión integral de stock, recetas, ventas y generación de reportes**. Su diseño modular y su interfaz intuitiva lo convierten en una herramienta efectiva para empresas que buscan profesionalizar su operativa diaria sin depender de soluciones genéricas o costosas.

---

## Características principales

- Gestión de stock de insumos.
- Administración de recetas y descomposición de productos.
- Registro de ventas y control de caja.
- Generación de reportes dinámicos por fecha, categoría y más.
- Pensado para comercios gastronómicos o similares.

---

## ¿Cómo funciona?

El software fue empaquetado con **PyInstaller** para ejecutarse como una app de escritorio, sin necesidad de abrir manualmente un navegador ni instalar servidores.

> Si se desea **probar el sistema en vivo desde el código fuente**, se deberá ejecutar localmente un servidor Flask.

### Pasos básicos:
1. Clonar el repositorio.
2. Instalar dependencias con `pip install -r requirements.txt`.
3. Correr `app.py` para iniciar el servidor local.
4. Ingresar en el navegador a `http://localhost:5000`.

---

## Demo del software

Si preferís **ver una demostración del funcionamiento** sin instalar ni configurar nada, podés acceder a un **video corto explicativo** en mi página web personal:

[Ver demo del software](https://drive.google.com/file/d/1BAjrWwqhsJg4C0QXRa4fWVRnUyvk43xW/view?usp=sharing)  

---

## Estructura del proyecto

AngelinaSoftware/


├── app.py # Archivo principal de Flask

├── bbdd / sistema_ventas.db # Base de datos SQLite

├── templates/ # Archivo HTML 

├── static/ # CSS, JS

├── backups/ # Carpeta autogenerada con copias de seguridad

├── README.md # Este archivo



---

## Notas

- El sistema está optimizado para uso local y no está desplegado en un servidor web por decisión técnica, ya que fue pensado como app instalable.
- El código y la lógica fueron desarrollados 100% desde cero, incluyendo diseño, base de datos, backups automáticos y funcionalidades específicas de negocio.

---

## Tecnologías utilizadas

- Python 
- Flask
- SQLite
- HTML5, CSS3, JavaScript
- PyInstaller (para distribución como app de escritorio)

---

## Contacto

Si querés saber más sobre este proyecto o estás interesado en soluciones similares, podés escribirme a gonza.bondar@gmail.com o visitar mi [sitio web personal](https://gbondar.github.io/Portfolio/).

---



