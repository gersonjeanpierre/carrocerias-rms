import os
from PIL import Image

def convert_to_webp(input_folder):
    print(f'Buscando imágenes en: {input_folder}')
    total = 0
    convertidos = 0
    errores = 0
    for root, _, files in os.walk(input_folder):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                total += 1
                img_path = os.path.join(root, file)
                webp_path = os.path.splitext(img_path)[0] + '.webp'
                print(f'Procesando: {img_path}')
                try:
                    img = Image.open(img_path).convert('RGB')
                    img.save(webp_path, 'webp', quality=80)
                    print(f'  ✔ Convertido: {webp_path}')
                    convertidos += 1
                except Exception as e:
                    print(f'  ✗ Error con {img_path}: {e}')
                    errores += 1
    print(f'---\nTotal imágenes encontradas: {total}')
    print(f'Convertidas correctamente: {convertidos}')
    print(f'Errores: {errores}')
    if total == 0:
        print('No se encontraron imágenes JPG, JPEG o PNG en la ruta indicada.')

def eliminar_imagenes_originales(input_folder):
    print(f'Eliminando archivos .jpg, .jpeg y .png en: {input_folder}')
    eliminados = 0
    for root, dirs, files in os.walk(input_folder):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                img_path = os.path.join(root, file)
                try:
                    os.remove(img_path)
                    print(f'  🗑️ Eliminado: {img_path}')
                    eliminados += 1
                except Exception as e:
                    print(f'  ✗ Error al eliminar {img_path}: {e}')
    print(f'Total eliminados: {eliminados}')
    if eliminados == 0:
        print('No se encontraron archivos para eliminar en ninguna subcarpeta.')

if __name__ == "__main__":
    carpeta = input("Ruta de la carpeta a convertir (ej: src/assets/images): ")
    convert_to_webp(carpeta)
    eliminar = input("¿Eliminar archivos originales JPG/PNG? (s/n): ").strip().lower()
    if eliminar == 's':
        eliminar_imagenes_originales(carpeta)
