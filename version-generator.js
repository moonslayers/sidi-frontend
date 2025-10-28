const { writeFileSync, readFileSync } = require('fs');
const { version } = require('./package.json');
const { execSync } = require('child_process');

const versionFilePath = './src/app/version.ts';
const content = `export const APP_VERSION = '${version}';\n`;

// 1. Leer el contenido actual del archivo (si existe)
let oldContent = '';
try {
    oldContent = readFileSync(versionFilePath, 'utf8').trim();
} catch (err) {
    // Si el archivo no existe, lo crearemos desde cero
    console.log(`ℹ️  El archivo ${versionFilePath} no existía. Se creará.`);
}

// 2. Verificar si ya está actualizado (evitar escritura innecesaria)
if (oldContent === content.trim()) {
    console.log(`ℹ️  La versión ${version} ya está actualizada en ${versionFilePath}. No se modificó.`);
}

// 3. VALIDACIÓN CRÍTICA: ¿Hay cambios pendientes en Git?
try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim() !== '') {
        throw new Error(
            '❌ ¡No se puede actualizar la versión porque hay cambios pendientes en Git!\n' +
            'Por favor, haz commit o stash de tus cambios antes de continuar.\n\n' +
            'Cambios pendientes:\n' + status
        );
    }
} catch (error) {
    if (error.message.includes('not a git repository')) {
        console.warn('⚠️  No estás en un repositorio Git. Saltando validación de cambios.');
    } else {
        // Si es otro error (como cambios pendientes), lo lanzamos
        console.error(error.message);
        process.exit(1); // Detenemos la ejecución
    }
}

// 4. Escribir el nuevo contenido
writeFileSync(versionFilePath, content);
console.log(`✓ Versión ${version} generada en ${versionFilePath}`);

// 5. Si no hay cambios pendientes Y la versión cambió, hacemos commit
if (oldContent !== content.trim()) {
    try {
        execSync('git add ' + versionFilePath, { stdio: 'inherit' });
        execSync(`git commit -m "chore: actualizar versión a ${version}"`, { stdio: 'inherit' });
        console.log(`✓ Commit realizado con la versión ${version}`);
    } catch (commitError) {
        console.error('❌ Error al hacer commit:', commitError.message);
        process.exit(1);
    }
} else {
    console.log('ℹ️  No hubo cambios en la versión. No se hizo commit.');
}