document.body.classList.add("animation");
function creationFormulaire(){
    document.getElementById('formulaire').style.display = 'block';
    document.getElementById('demande').style.display = 'none';
}
function creationSpecimen(){
    document.getElementById('specimen').style.display = 'block';
    document.getElementById('demande').style.display = 'none';
    document.getElementById('checkbox').style.display = 'none';
}
function placerChamps(){
    document.getElementById('checkbox').style.display = 'block';
}
function collerAuSpecimen(){
    document.getElementById('afficher').style.display = 'block';
    document.getElementById('formulaire').style.display = 'none';   
}

const inputImage = document.getElementById('profile');
const image = document.getElementById('imageInput');

inputImage.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
            // On sauvegarde l’image dans localStorage dès qu’elle est chargée
            localStorage.setItem("specimenImage", e.target.result);
        };
        reader.readAsDataURL(file);
    } 
});
// === TA FONCTION PLACER (inchangée, sauf id unique)
function placer() {
    var forme = document.getElementById("imageContainer");
    var all = document.querySelectorAll("#checkbox input[type=checkbox]:checked");
    all.forEach(function(ligne, index) {
        var champ = document.createElement('div');
        champ.textContent = ligne.value;
        champ.id = "champ_" + index;
        champ.style.position = "absolute";
        champ.style.left = '20px';
        champ.style.top = (20 + index * 30) + "px";
        champ.style.fontSize = "40px";
        champ.style.cursor = "move";
        champ.style.padding = '20px 50px';
        forme.appendChild(champ);

        makeDraggable(champ);
    });
}
function makeDraggable(el) {
    let offsetX = 0, offsetY = 0, isDragging = false;

    // Début du drag
    el.addEventListener('mousedown', startDrag);
    el.addEventListener('touchstart', startDrag, {passive: false});

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;

        if (e.type === 'mousedown') {
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        } else if (e.type === 'touchstart') {
            offsetX = e.touches[0].clientX - el.offsetLeft;
            offsetY = e.touches[0].clientY - el.offsetTop;
            document.addEventListener('touchmove', drag, {passive: false});
            document.addEventListener('touchend', stopDrag);
        }
    }

    function drag(e) {
        e.preventDefault();
        if (!isDragging) return;

        let x = 0, y = 0;
        if (e.type === 'mousemove') {
            x = e.clientX - offsetX;
            y = e.clientY - offsetY;
        } else if (e.type === 'touchmove') {
            x = e.touches[0].clientX - offsetX;
            y = e.touches[0].clientY - offsetY;
        }
        console.log(`Le drag commence : offsetX = ${x}, offsetY = ${y}`);
        el.style.left = x + 'px';
        el.style.top = y + 'px';
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', stopDrag);
    }
}
// === SAUVEGARDER ===
function sauvegarder() {
    const divs = document.querySelectorAll("#imageContainer div");
    const imageSrc = localStorage.getItem("specimenImage") || document.getElementById("imageInput").src;

    const specimen = {
        id: Date.now(), // identifiant unique (timestamp)
        nom: prompt("Entre un nom pour ce specimen :"), // demander un nom à l’utilisateur
        imageSrc: imageSrc,
        champs: []
    };

    divs.forEach(div => {
        specimen.champs.push({
            id: div.id,
            text: div.textContent,
            left: div.style.left,
            top: div.style.top
        });
    });

    // 🔹 On récupère les anciens specimens (ou tableau vide si aucun)
    let allSpecimens = JSON.parse(localStorage.getItem("allSpecimens")) || [];

    // 🔹 On ajoute le nouveau specimen au tableau
    allSpecimens.push(specimen);

    // 🔹 On réenregistre tout
    localStorage.setItem("allSpecimens", JSON.stringify(allSpecimens));

    alert("Spécimen '" + specimen.nom + "' sauvegardé avec succès !");
}


function charger() {
    const data = localStorage.getItem("allSpecimens");
    if (!data) {
        alert("Aucun spécimen sauvegardé !");
        return;
    }

    const allSpecimens = JSON.parse(data);
    if (allSpecimens.length === 0) {
        alert("Aucun spécimen sauvegardé !");
        return;
    }

    // 🔹 Afficher la liste pour choisir
    let liste = "Choisis un numéro :\n";
    allSpecimens.forEach((specimen, i) => {
        liste += `${i + 1}. ${specimen.nom}\n`;
    });

    const choix = parseInt(prompt(liste)) - 1;
    if (choix < 0 || choix >= allSpecimens.length) {
        alert("Choix invalide !");
        return;
    }

    const specimen = allSpecimens[choix];
    const container = document.getElementById("imageContainer");
    container.innerHTML = "";

    // 🔹 Charger l'image
    const image = document.createElement("img");
    image.id = "imageInput";
    image.src = specimen.imageSrc;
    image.style.width = "50%";
    image.style.objectFit = "cover";
    container.appendChild(image);

    // 🔹 Charger les champs
    specimen.champs.forEach(item => {
        const champ = document.createElement("div");
        champ.id = item.id;
        champ.textContent = item.text;
        champ.style.position = "absolute";
        champ.style.left = item.left;
        champ.style.top = item.top;
        champ.style.fontSize = "40px";
        champ.style.cursor = "move";
        champ.style.padding = "20px 50px";
        container.appendChild(champ);
        makeDraggable(champ);
    });

    alert(`Spécimen "${specimen.nom}" chargé !`);
}


let totalFormulaires = 0;

function genererFormulaires() {
    const container = document.getElementById("formulairesContainer");
    container.innerHTML = "";

    totalFormulaires = parseInt(prompt("Combien de formulaires veux-tu générer ?"));
    if (isNaN(totalFormulaires) || totalFormulaires <= 0) {
        alert("Entre un nombre valide !");
        return;
    }

    for (let i = 1; i <= totalFormulaires; i++) {
        const bloc = document.createElement("div");
        bloc.className = "formulaire";
        bloc.style.border = "1px solid #aaa";
        bloc.style.margin = "10px 0";
        bloc.style.padding = "10px";
        bloc.style.borderRadius = "10px";

        // 🔹 Phrase Formulaire X sur Y
        const phrase = document.createElement("p");
        phrase.textContent = `Formulaire ${i} sur ${totalFormulaires}`;
        phrase.style.fontWeight = "bold";
        bloc.appendChild(phrase);

        // 🔹 Formulaire
        const form = document.createElement("form");
        form.innerHTML = `
            <label>Profile: <input type="file" name="profile_${i}" id="profile_${i}"></label><br>
            <label>Nom: <input type="text" name="nom_${i}" id="nom_${i}"></label><br>
            <label>Prénom: <input type="text" name="prenom_${i}" id="prenom_${i}"></label><br>
            <label>Adresse: <input type="text" name="adresse_${i}" id="adresse_${i}"></label><br>
            <label>Téléphone: <input type="text" name="telephone_${i}" id="telephone_${i}"></label><br>
            <label>Matricule: <input type="text" name="matricule_${i}" id="matricule_${i}"></label><br>
            <label>Classe: <input type="text" name="classe_${i}" id="classe_${i}"></label><br>
            
        `;
        bloc.appendChild(form);
        container.appendChild(bloc);
    }

    // 🔹 Bouton global “Coller au Specimen”
    const btnColler = document.createElement("button");
    btnColler.textContent = "Coller au Specimen";
    btnColler.onclick = () => {
        choisirSpecimenEtColler();
        return false; // éviter le reload
    };
    container.appendChild(btnColler);
}


// 🔹 Fonction pour coller les formulaires dans un specimen
function choisirSpecimenEtColler() {
    const data = JSON.parse(localStorage.getItem("allSpecimens")) || [];
    if (data.length === 0) {
        alert("Aucun specimen disponible !");
        return;
    }

    let liste = "Choisis un specimen (numéro) :\n";
    data.forEach((s, i) => { liste += `${i + 1}. ${s.nom}\n`; });

    const choix = parseInt(prompt(liste)) - 1;
    if (choix < 0 || choix >= data.length) { alert("Choix invalide !"); return; }

    const specimen = data[choix];

    if (totalFormulaires <= 0) { alert("Aucun formulaire à coller !"); return; }

    async function processFormulaires() {
        for (let i = 1; i <= totalFormulaires; i++) {
            const profileFile = document.getElementById(`profile_${i}`).files[0];
            let profileData = "";

            if (profileFile) {
                profileData = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(profileFile);
                });
            }

            const nom = document.getElementById(`nom_${i}`).value.trim();
            const prenom = document.getElementById(`prenom_${i}`).value.trim();
            const adresse = document.getElementById(`adresse_${i}`).value.trim();
            const telephone = document.getElementById(`telephone_${i}`).value.trim();
            const matricule = document.getElementById(`matricule_${i}`).value.trim();
            const classe = document.getElementById(`classe_${i}`).value.trim();

            if (!nom && !prenom) continue;

            const formColle = {
                profile: profileData,
                nom,
                prenom,
                adresse,
                telephone,
                matricule,
                classe
            };

            if (!specimen.formulairesColles) specimen.formulairesColles = [];
            specimen.formulairesColles.push(formColle);
        }

        data[choix] = specimen;
        localStorage.setItem("allSpecimens", JSON.stringify(data));

        alert(`${totalFormulaires} formulaire(s) collé(s) au specimen "${specimen.nom}" !`);
        afficherCartesGenerées(choix);
    }

    processFormulaires();
}


function afficherCartesGenerées(indexSpecimen) {
    const data = JSON.parse(localStorage.getItem("allSpecimens")) || [];
    const specimen = data[indexSpecimen];

    if (!specimen || !specimen.formulairesColles || specimen.formulairesColles.length === 0) {
        alert("Aucun formulaire trouvé pour ce specimen !");
        return;
    }
    document.getElementById('afficher').style.display = "block";
    document.getElementById('formulairesContainer').style.display = "none";
    const container = document.getElementById("cartesContainer");
    container.innerHTML = ""; // Efface les anciennes cartes

    specimen.formulairesColles.forEach((formulaire, index) => {
        // 🔹 Wrapper pour la carte + bouton
        const carteWrapper = document.createElement("div");
        carteWrapper.style.display = "inline-block";
        carteWrapper.style.margin = "20px";

        // 🔹 Carte scolaire
        const carte = document.createElement("div");
        carte.classList.add("carte");
        carte.id = `carte_${index}`;

        carte.style.position = "relative";
        carte.style.display = "inline-block";
        carte.style.margin = "0";
        carte.style.border = "1px solid #ccc";
        carte.style.overflow = "hidden";
        carte.style.borderRadius = "10px";
        carte.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
        carte.style.background = "#fff";

        // 🔹 Image du specimen (le fond de carte)
        const img = document.createElement("img");
        img.src = specimen.imageSrc || "";
        img.alt = "Image specimen";
        img.style.objectFit = "cover";
        img.style.borderRadius = "10px";
        carte.appendChild(img);

        // 🔹 Champs du specimen
        if (specimen.champs && specimen.champs.length > 0) {
            specimen.champs.forEach(div => {
                const champ = document.createElement("div");
                champ.style.position = "absolute";
                champ.style.left = div.left;
                champ.style.top = div.top;
                champ.style.fontSize = "30px";
                champ.style.fontWeight = "bold";
                champ.style.color = "#000";

                const champNom = div.textContent || div.text;
                switch (champNom.toLowerCase()) {
                    case "profile":
                        if (formulaire.profile) {
                            const imgProfile = document.createElement("img");
                            imgProfile.classList.add("profileImage");
                            imgProfile.src = formulaire.profile;
                            imgProfile.style.width = "250px";
                            imgProfile.style.height = "300px";
                            imgProfile.style.zIndex = 1000000;
                            imgProfile.style.objectFit = "cover";
                            champ.appendChild(imgProfile);
                        } else {
                            champ.textContent = "Photo manquante";
                        }
                        break;
                    case "nom": champ.textContent = formulaire.nom; break;
                    case "prenom": champ.textContent = formulaire.prenom; break;
                    case "adresse": champ.textContent = formulaire.adresse; break;
                    case "telephone": champ.textContent = formulaire.telephone; break;
                    case "matricule": champ.textContent = formulaire.matricule; break;
                    case "classe": champ.textContent = formulaire.classe; break;
                    default: champ.textContent = champNom;
                }

                carte.appendChild(champ);
            });
        }

        // 🔹 Bouton Télécharger **hors de la carte**
        const btnDownload = document.createElement("button");
        btnDownload.textContent = "Télécharger";
        btnDownload.style.display = "block";
        btnDownload.style.margin = "10px auto";
        btnDownload.style.padding = "8px 16px";
        btnDownload.style.border = "none";
        btnDownload.style.borderRadius = "8px";
        btnDownload.style.backgroundColor = "#007bff";
        btnDownload.style.color = "white";
        btnDownload.style.cursor = "pointer";
        btnDownload.onclick = () => telechargerCarte(`carte_${index}`, `${formulaire.nom}_${formulaire.prenom}.png`);

        // 🔹 Ajout carte + bouton dans le wrapper
        carteWrapper.appendChild(carte);
        carteWrapper.appendChild(btnDownload);
        container.appendChild(carteWrapper);
    });

    alert(`${specimen.formulairesColles.length} carte(s) générée(s) pour "${specimen.nom}" !`);
}

// 🔹 Fonction pour télécharger une carte
function telechargerCarte(idCarte, nomFichier) {
    html2canvas(document.getElementById(idCarte)).then(canvas => {
        const lien = document.createElement("a");
        lien.href = canvas.toDataURL("image/png");
        lien.download = nomFichier;
        lien.click();
    });
}
// ✅ Fonction pour afficher les cadres
function afficherCadres(){
    document.getElementById('cadreCacher').style.display = 'block';
    document.getElementById('cadre').style.display = 'block';
    document.getElementById('cacher').style.display = 'none';

    const cadres = document.querySelectorAll("#cadreCacher .cadre img");
    cadres.forEach(cadre => {
        cadre.onclick = () => {
            const cadreSrc = cadre.src;
            const cartes = document.querySelectorAll(".carte");
            if (cartes.length === 0) {
                alert("Aucune carte détectée ! Génère d'abord les cartes avant de coller un cadre.");
                return;
            }

            cartes.forEach(carte => {
                // Supprimer ancien cadre s'il y en a
                const oldCadre = carte.querySelector(".cadreOverlay");
                if (oldCadre) oldCadre.remove();

                // Trouver l'image du profil
                const imgProfile = carte.querySelector(".profileImage");
                if (!imgProfile) return;

                const overlay = document.createElement("img");
                overlay.classList.add("cadreOverlay");
                overlay.src = cadreSrc;
                overlay.style.position = "absolute";
                overlay.style.top = "25%";
                overlay.style.left = "3%";
                overlay.style.width = "42%";
                overlay.style.height = "35%";
                overlay.style.zIndex = 1;
                overlay.style.pointerEvents = "none";

                carte.appendChild(overlay);
            });

            document.getElementById("cadreCacher").style.display = "none";
        };
    });
}

function afficherCachers(){
    document.getElementById('cadreCacher').style.display = 'block';
    document.getElementById('cacher').style.display = 'block';
    document.getElementById('cadre').style.display = 'none';

    
    const cachers = document.querySelectorAll("#cadreCacher .cacher img");
    cachers.forEach(cacher => {
        cacher.onclick = () => {
            const cacherSrc = cacher.getAttribute("href") || cacher.src;
            const cartes = document.querySelectorAll(".carte");
            if (cartes.length === 0) {
                alert("Aucune carte détectée ! Génère d'abord les cartes avant de coller un cadre.");
                return;
            }


            cartes.forEach(carte => {
                // Supprimer ancien cacher s'il y en a
                const oldCacher = carte.querySelector(".cacherOverlay");
                if (oldCacher) oldCacher.remove();

                // Trouver l'image du profil
                const imgProfile = carte.querySelector("div img");

                const overlay = document.createElement("img");
                overlay.classList.add("cacherOverlay");
                overlay.src = cacherSrc;
                overlay.style.position = "absolute";
                overlay.style.pointerEvents = "none";

                if (imgProfile) {
                    // Adapter à la largeur de la photo du profil
                    overlay.style.width =  "42%";
                    overlay.style.height = "35%";
                    overlay.style.left = "2%";
                    overlay.style.bottom =  "18%";
                } else {
                    // Si pas de profil trouvé, placer en bas de la carte
                    overlay.style.width = "35%";
                    overlay.style.height = "60px";
                    overlay.style.bottom = "35%";
                    overlay.style.left = "0";
                }

                carte.appendChild(overlay);
            });

            // Masquer la section après le choix
            document.getElementById("cadreCacher").style.display = "none";
        };
    });

}
function viderLocalStorage() {
    if (confirm("Veux-tu vraiment vider toutes les données sauvegardées ?")) {
        localStorage.clear();
        alert("LocalStorage vidé avec succès !");
        // Optionnel : actualiser la page pour repartir à zéro
        // location.reload();
    }
}
