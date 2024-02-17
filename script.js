function calculateCost() {
    const weight = parseFloat(document.getElementById('weight').value);
    const hours = parseFloat(document.getElementById('hours').value);
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
    const plaCostPerGram = parseFloat(document.getElementById('plaCostPerGram').value);
    const electricityCostPerKWh = parseFloat(document.getElementById('electricityCostPerKWh').value);
    const printerPowerKW = parseFloat(document.getElementById('printerPowerKW').value);

        // Vérifier si tous les champs sont remplis
    if (!weight || !hours || !hourlyRate || !plaCostPerGram || !electricityCostPerKWh || !printerPowerKW) {
        showModal();
        return;
    }

    const plaCost = plaCostPerGram * weight;
    const electricityCost = electricityCostPerKWh * printerPowerKW * hours;
    const printingCost = hourlyRate * hours;

    const totalCost = plaCost + electricityCost + printingCost;
    document.getElementById('resultText').innerHTML = `Selon les informations saisies, l'impression de la pièce coûterait : <span class="result-price">${totalCost.toFixed(2)}€</span>`;
    showResultModal();
}

function loadPrinters() {
    fetch('printers.json')
        .then(response => response.json())
        .then(data => {
            const printerSelect = document.getElementById('printerModel');
            data.forEach(printer => {
                let option = new Option(printer.name, printer.name);
                printerSelect.add(option);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des imprimantes:', error));
}

function loadMaterials() {
    fetch('materials.json')
        .then(response => response.json())
        .then(data => {
            const materialSelect = document.getElementById('materialType');
            data.forEach(material => {
                let option = new Option(material.type, material.type);
                materialSelect.add(option);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des matériaux:', error));
}

// Fonction pour mettre à jour les informations de l'imprimante sélectionnée
function updatePrinterInfo(selectedPrinterName) {
    fetch('printers.json')
      .then(response => response.json())
      .then(printers => {
        const printer = printers.find(p => p.name === selectedPrinterName);
        if (printer) {
          document.getElementById('printerInfo').innerText = `Consommation électrique de l'imprimante : ${printer.powerKW} kW`;
        }
      })
      .catch(error => console.error('Erreur lors de la mise à jour des infos de l\'imprimante:', error));
}

// Fonction pour mettre à jour les informations du matériau sélectionné
function updateMaterialInfo(selectedMaterialType) {
    fetch('materials.json')
        .then(response => response.json())
        .then(materials => {
        const material = materials.find(m => m.type === selectedMaterialType);
        if (material) {
            document.getElementById('materialInfo').innerText = `Coût par gramme du matériau : ${material.costPerGram} €`;
        }
        })
        .catch(error => console.error('Erreur lors de la mise à jour des infos du matériau:', error));
}
  

document.getElementById('printerModel').addEventListener('change', function() {
    updatePrinterInfo(this.value);
});
  
document.getElementById('materialType').addEventListener('change', function() {
    updateMaterialInfo(this.value);
});
  

function showModal() {
    const modal = document.getElementById('validationModal');
    const span = document.getElementsByClassName("close-button")[0];

    modal.style.display = "block";

    // Lorsque l'utilisateur clique sur (x), fermer la modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Lorsque l'utilisateur clique n'importe où hors de la modal, la fermer
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function saveConfiguration() {
    const configuration = {
        weight: document.getElementById('weight').value,
        hours: document.getElementById('hours').value,
        hourlyRate: document.getElementById('hourlyRate').value,
        plaCostPerGram: document.getElementById('plaCostPerGram').value,
        electricityCostPerKWh: document.getElementById('electricityCostPerKWh').value,
        printerPowerKW: document.getElementById('printerPowerKW').value
    };
    
    // Sauvegarde de la configuration dans le stockage local
    localStorage.setItem('3DPrintCalcConfiguration', JSON.stringify(configuration));
    alert('Configuration sauvegardée avec succès!');
}

function loadConfiguration() {
    // Chargement de la configuration depuis le stockage local
    const savedConfiguration = JSON.parse(localStorage.getItem('3DPrintCalcConfiguration'));
    
    if (savedConfiguration) {
        document.getElementById('weight').value = savedConfiguration.weight;
        document.getElementById('hours').value = savedConfiguration.hours;
        document.getElementById('hourlyRate').value = savedConfiguration.hourlyRate;
        document.getElementById('plaCostPerGram').value = savedConfiguration.plaCostPerGram;
        document.getElementById('electricityCostPerKWh').value = savedConfiguration.electricityCostPerKWh;
        document.getElementById('printerPowerKW').value = savedConfiguration.printerPowerKW;
        
        alert('Configuration chargée avec succès!');
    } else {
        alert('Aucune configuration sauvegardée trouvée.');
    }
}

function showResultModal() {
    const modal = document.getElementById('resultModal');
    modal.style.display = "block";
}

function closeResultModal() {
    const modal = document.getElementById('resultModal');
    modal.style.display = "none";
}
  

// Ajoutez le code pour fermer la modal lorsque l'utilisateur clique en dehors de celle-ci
window.onclick = function(event) {
    const modal = document.getElementById('resultModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadPrinters();
    loadMaterials();
    updatePrinterInfo();
    updateMaterialInfo();
});