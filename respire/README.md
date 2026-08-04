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

Chaque exercice affiche son **niveau de preuve** et ses sources dans sa fiche (bouton ⓘ).

| Exercice | Rythme | Cycles/min | Preuves | Usage |
|---|---|---|---|---|
| Cohérence cardiaque — Équilibre | 5-5 | 6 | solides | référence de la cohérence cardiaque |
| Soupir physiologique | 3-1-7 | 5,5 | modérées | apaisement rapide, meilleur résultat en comparaison directe |
| Cohérence cardiaque — Relaxation | 4-6 | 6 | modérées | détente, fin de journée |
| Cohérence cardiaque — Dynamique | 6-4 | 6 | modérées | calme et alerte |
| Respiration carrée | 4-4-4-4 | 3,75 | limitées | recentrage sous pression |
| Respiration apaisante | 4-8 | 5 | modérées | anxiété, ruminations |
| Respiration méditative | 6-6 | 5 | solides | séance longue |
| Respiration 4-7-8 | 4-7-8 | 3,2 | limitées | endormissement |
| Respiration 4-4 | 4-4 | 7,5 | modérées | pause express, débutants |
| Respiration 4-4-6-2 | 4-4-6-2 | 3,75 | limitées | variante de confort |
| Respiration stimulante | 6-2 | 3,75 | limitées | réveil — à éviter le soir |

Des exercices personnalisés peuvent être créés avec le bouton **+**
(inspiration / poumons pleins / expiration / poumons vides).

## Réglages mémorisés par exercice

Chaque exercice retient sa durée et ses options de guidage. Régler la cohérence
cardiaque sur 15 minutes sans son continu n'affecte pas le 4-7-8, qui garde ses
propres réglages. La fiche indique « Réglages mémorisés pour cet exercice » une
fois le préréglage enregistré ; Réglages → *Oublier les réglages mémorisés* les
remet tous à zéro. Le volume reste global, car il dépend de l'appareil.

Les interrupteurs du panneau **Réglages** définissent les valeurs de départ des
exercices qui n'ont pas encore été lancés.

## Fondement scientifique

L'écran Réglages → **Que dit la science ?** résume l'état des preuves, et chaque
exercice porte le sien. En résumé :

**Ce qui est solide.** Respirer autour de 5 à 6,5 cycles par minute produit des
effets mesurés et reproduits : forte hausse de la variabilité de la fréquence
cardiaque, baroréflexe plus sensible, bascule parasympathique. À ce rythme la
respiration entre en résonance avec les oscillations de la pression artérielle
(ondes de Mayer, période ~10 s).

**Ce qui l'est moins.** Le passage de cet effet physiologique au mieux-être
ressenti est plus fragile. Dans le plus grand essai disponible — 400
participants, 4 semaines, contre un placebo actif à 12 cycles/min — la cohérence
à 5,5 cycles/min **n'a pas fait mieux** sur le stress subjectif : les deux
groupes se sont améliorés autant. Les méta-analyses trouvent un effet réel mais
modeste du breathwork sur le stress, l'anxiété et l'humeur (g ≈ −0,32 à −0,35),
sur une littérature de qualité inégale.

**Le ratio compte moins que la lenteur.** Sur neuf études comparant les ratios
inspiration/expiration, les auteurs aboutissent à quatre conclusions
différentes. Le choix du ratio relève donc du confort.

**La fréquence optimale est personnelle** (4,5–6,5 cycles/min selon les
individus, et variable dans le temps chez une même personne) : d'où l'intérêt de
comparer 5-5, 6-6 et 4-6.

**En comparaison directe**, le soupir physiologique (deux inspirations puis une
longue expiration) a devancé la respiration carrée, l'hyperventilation cyclique
et la méditation de pleine conscience sur l'humeur et la fréquence
respiratoire, à raison de 5 minutes par jour pendant un mois — avec un bénéfice
croissant avec la régularité. C'est pourquoi il figure en deuxième position dans
la liste.

**Prudence sur la pression artérielle** : l'effet de la respiration lente guidée
disparaît dans les méta-analyses lorsqu'on écarte les essais financés par les
fabricants d'appareils. L'application ne revendique donc aucun effet
antihypertenseur.

### Sources

- [Laborde et al., 2022 — respiration guidée à 6 cycles/min, *Psychophysiology*](https://onlinelibrary.wiley.com/doi/10.1111/psyp.13952)
- [Fincham et al., 2023 — cohérence 5,5/min contre placebo actif, *Scientific Reports*](https://www.nature.com/articles/s41598-023-49279-8)
- [Fincham et al., 2023 — méta-analyse des essais sur le breathwork, *Scientific Reports*](https://www.nature.com/articles/s41598-022-27247-y)
- [Balban et al., 2023 — trois respirations comparées à la méditation (Stanford)](https://med.stanford.edu/news/insights/2023/02/cyclic-sighing-can-help-breathe-away-anxiety.html)
- [Van Diest et al., 2014 — le ratio inspiration/expiration module l'effet](https://link.springer.com/article/10.1007/s10484-014-9253-x)
- [Steffen et al., 2024 — une expiration plus longue augmente-t-elle la VFC ?](https://link.springer.com/article/10.1007/s10484-024-09637-2)
- [La fréquence de résonance est individuelle et instable](https://www.nature.com/articles/s41598-021-87867-8)
- [Gonçalves et al., 2022 — respiration lente et pression artérielle](https://onlinelibrary.wiley.com/doi/full/10.1002/hsr2.636)
- [Effets de la respiration 4-7-8 sur la VFC et la pression artérielle](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9277512/)
- [Origine cérébrale du réflexe de soupir (UCLA / Stanford, *Science* 2017)](https://newsroom.ucla.edu/releases/ucla-and-stanford-researchers-pinpoint-origin-of-sighing-reflex-in-the-brain)

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
