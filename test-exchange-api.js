import fetch from 'node-fetch';

async function testFrankfurter() {
  const targetCurrency = 'USD'; // ← change ici pour tester d’autres, ex: 'MAD', 'AED', etc.

  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=EUR&to=${targetCurrency}`);
    const data = await response.json();

    if (data && data.rates && data.rates[targetCurrency]) {
      console.log(`✅ Taux EUR → ${targetCurrency} :`, data.rates[targetCurrency]);
    } else {
      console.warn(`⚠️ Pas de taux trouvé pour ${targetCurrency}`);
      console.log('Réponse brute :', data);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du taux :', error);
  }
}

testFrankfurter();