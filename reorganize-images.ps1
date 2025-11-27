# Reorganiza todas las imágenes .jpg en carpetas con su mismo nombre, omitiendo una carpeta específica
$productsPath = "c:\projects\angular\carrocerias-rms\src\assets\images\products"
$omitFolder = "brazo-de-izaje-carga-pesada-14-20tn"

function Reorganize-Images {
    param ([string]$Path)
    $currentFolder = Split-Path -Leaf $Path
    if ($currentFolder -eq $omitFolder) { return }

    $jpgFiles = Get-ChildItem -Path $Path -Filter "*.jpg" -File
    foreach ($file in $jpgFiles) {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        $newFolderPath = Join-Path -Path $Path -ChildPath $baseName
        if (-not (Test-Path -Path $newFolderPath)) {
            New-Item -Path $newFolderPath -ItemType Directory | Out-Null
        }
        Move-Item -Path $file.FullName -Destination (Join-Path $newFolderPath $file.Name) -Force
    }
    $subDirs = Get-ChildItem -Path $Path -Directory
    foreach ($dir in $subDirs) {
        Reorganize-Images -Path $dir.FullName
    }
}

Reorganize-Images -Path $productsPath