import os
import shutil

# Cambia aquí la carpeta que quieres revertir
FOLDER_TO_REVERT = "12-grua-con-contenedor-para-chatarra"
PRODUCTS_PATH = r"c:\projects\angular\carrocerias-rms\src\assets\images\products"
TARGET_PATH = os.path.join(PRODUCTS_PATH, FOLDER_TO_REVERT)

def revert_nested_folders(path):
    for root, dirs, files in os.walk(path, topdown=False):
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)
            # Buscar subcarpetas con el mismo nombre
            for sub_root, sub_dirs, sub_files in os.walk(dir_path):
                for sub_dir in sub_dirs:
                    sub_dir_path = os.path.join(sub_root, sub_dir)
                    # Si el nombre coincide, mover los archivos al primer nivel
                    if sub_dir == dir_name:
                        for file in os.listdir(sub_dir_path):
                            src = os.path.join(sub_dir_path, file)
                            dst = os.path.join(dir_path, file)
                            if os.path.isfile(src):
                                shutil.move(src, dst)
                        # Eliminar la subcarpeta vacía
                        try:
                            os.rmdir(sub_dir_path)
                        except Exception:
                            pass

if __name__ == "__main__":
    revert_nested_folders(TARGET_PATH)
    print("Reversión completada.")