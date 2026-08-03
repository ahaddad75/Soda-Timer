# Respire — cohérence cardiaque

Application web (PWA) de respiration guidée et de cohérence cardiaque, en français,
conçue pour continuer à guider **écran éteint / application en arrière-plan**.

## Utilisation

Ouvrir `respire/index.html` (ou l'URL GitHub Pages du dossier `respire/`).
Sur mobile : menu du navigateur → **Ajouter à l'écran d'accueil**, pour lancer
l'appli en plein écran, hors-ligne, comme une application native.

1. Choisir un exercice (par défaut **Cohérence cardiaque 5-5**).
2. Choisir la durée (1 à 30 minutes) et les options de guidage.
3. « Commencer » — 3 secondes de préparation, puis le guidage démarre.
4. L'écran peut être éteint : le son continue et les commandes apparaissent
   sur l'écran de verrouillage.

## Exercices inclus

| Exercice | Rythme | Usage |
|---|---|---|
| Cohérence cardiaque — Équilibre | 5-5 | référence, 6 respirations/min |
| Cohérence cardiaque — Relaxation | 4-6 | détente |
| Cohérence cardiaque — Dynamique | 6-4 | calme et alerte |
| Respiration carrée | 4-4-4-4 | recentrage sous pression |
| Respiration 4-7-8 | 4-7-8 | endormissement |
| Respiration 4-4 | 4-4 | pause express |
| Respiration 4-4-6-2 | 4-4-6-2 | réduction du stress |
| Respiration apaisante | 4-8 | anxiété |
| Respiration stimulante | 6-2 | réveil, énergie |
| Respiration méditative | 6-6 | méditation longue |

Des exercices personnalisés peuvent être créés avec le bouton **+**
(inspiration / poumons pleins / expiration / poumons vides).

## Guidage audio

Trois couches, activables indépendamment :

- **Sons de guidage** — deux notes ascendantes à l'inspiration, deux notes
  descendantes à l'expiration, une note simple sur les rétentions.
- **Son continu guidé** — un bourdon qui monte d'une octave pendant
  l'inspiration et redescend pendant l'expiration : il suffit de suivre le son.
- **Voix française** — « Inspirez », « Retenez », « Expirez », « Poumons vides »
  via la synthèse vocale du système.

Ajout possible : vibration à chaque changement de phase, maintien de l'écran allumé
(Wake Lock), réglage du volume.

## Fonctionnement en arrière-plan

Le point délicat d'une appli de respiration sur le web est que les navigateurs
ralentissent fortement les minuteries (`setTimeout`/`setInterval`) d'un onglet
caché — un guidage basé dessus dérive ou s'arrête dès que l'écran s'éteint.

Ici :

- **Toute la séance est programmée à l'avance sur l'horloge audio**
  (`AudioContext.currentTime`). Le rythme est calculé par le thread audio,
  totalement indépendant des minuteries JavaScript : aucune dérive possible,
  même onglet caché pendant 30 minutes.
- Un **flux audio quasi silencieux en boucle** maintient la page dans l'état
  « lecteur multimédia » du système, ce qui autorise la lecture écran éteint.
- L'**API Media Session** publie le titre de la séance et gère lecture / pause /
  arrêt depuis l'écran de verrouillage et les écouteurs.
- La **pause** utilise `AudioContext.suspend()` : toute la programmation se fige
  et reprend exactement au même point.
- L'affichage (bulle, décompte, anneau de progression) est recalculé à partir de
  l'horloge audio à chaque image, et se resynchronise au retour au premier plan.

La synthèse vocale reste soumise au bon vouloir du système en arrière-plan ;
les sons de guidage, eux, sont garantis. C'est pourquoi les deux sont proposés.

## Données

Tout est stocké dans le `localStorage` du navigateur : favoris, exercices
personnalisés, réglages et historique des séances. Rien n'est envoyé sur un
serveur. L'onglet **Suivi** affiche le nombre de séances, le temps total, la
série de jours consécutifs, les 7 derniers jours et l'historique détaillé.

## Fichiers

- `index.html` — structure des écrans
- `style.css` — thème sombre
- `app.js` — catalogue, moteur audio, moteur de séance, statistiques
- `sw.js` + `manifest.webmanifest` — installation et fonctionnement hors-ligne

## Avertissement

Cette application est un outil de bien-être, pas un dispositif médical.
Les rétentions longues (4-7-8) et la respiration stimulante sont à éviter en cas
de grossesse, de problème cardiaque ou respiratoire, et à arrêter immédiatement
en cas d'étourdissement. En cas de doute, demandez l'avis d'un professionnel de santé.
