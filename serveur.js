const fs = require('fs');
const path = require('path');

// Définir les groupes de CSS
const cssGroups = {
  // CSS critique (chargé en premier)
  critical: [
    'public/css/reset.css',
    'public/css/style.css',
    'public/css/overview.css'
  ],
  
  // CSS des pages (chargé en différé)
  pages: [
    'public/css/login.css',
    'public/css/signup.css',
    'public/css/reset-password.css',
    'public/css/email.css',
    'public/css/password.css',
    'public/css/profile.css',
    'public/css/settings.css',
    'public/css/incomes.css',
    'public/css/settings-header.css',
    'public/css/admin.css'
  ]
};

// Fonction pour concatener les fichiers CSS
function concatenateCSS(files, outputFile) {
  let combinedCSS = '';
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      combinedCSS += `/* === ${path.basename(file)} === */\n`;
      combinedCSS += content + '\n\n';
    } else {
      console.warn(`⚠️  Fichier non trouvé: ${file}`);
    }
  });
  
  fs.writeFileSync(outputFile, combinedCSS);
  console.log(`✅ Créé: ${outputFile} (${Math.round(combinedCSS.length / 1024)}KB)`);
}

// Créer le dossier build s'il n'existe pas
if (!fs.existsSync('public/build')) {
  fs.mkdirSync('public/build', { recursive: true });
}

// Générer les fichiers concatenés
concatenateCSS(cssGroups.critical, 'public/build/critical.css');
concatenateCSS(cssGroups.pages, 'public/build/pages.css');

console.log('🚀 Build CSS terminé !');