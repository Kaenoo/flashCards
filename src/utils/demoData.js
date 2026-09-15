import { makeId } from './cards'

export const demoDatasets = () => [
  {
    id: makeId(),
    name: 'Anglais — Vocabulaire courant',
    cards: [
      { key: 'chat', value: 'cat' },
      { key: 'chien', value: 'dog' },
      { key: 'maison', value: 'house' },
      { key: 'voiture', value: 'car' },
      { key: 'nourriture', value: 'food' },
      { key: 'eau', value: 'water' },
      { key: 'livre', value: 'book' },
      { key: 'école', value: 'school' },
      { key: 'ami', value: 'friend' },
      { key: 'famille', value: 'family' },
      { key: 'travail', value: 'work' },
      { key: 'temps', value: 'weather' },
      { key: 'voyage', value: 'travel' },
      { key: 'argent', value: 'money' },
      { key: 'bonheur', value: 'happiness' }
    ]
  },
  {
    id: makeId(),
    name: 'Espagnol — Salutations',
    cards: [
      { key: 'Bonjour', value: 'Hola' },
      { key: 'Au revoir', value: 'Adiós' },
      { key: 'Merci', value: 'Gracias' },
      { key: "S'il vous plaît", value: 'Por favor' },
      { key: 'Comment vas-tu ?', value: '¿Cómo estás?' },
      { key: 'Je vais bien', value: 'Estoy bien' },
      { key: 'Bonne nuit', value: 'Buenas noches' },
      { key: 'À bientôt', value: 'Hasta pronto' },
      { key: 'Enchanté', value: 'Mucho gusto' },
      { key: 'Pardon / Excusez-moi', value: 'Perdón' },
      { key: 'Oui', value: 'Sí' },
      { key: 'Non', value: 'No' }
    ]
  },
  {
    id: makeId(),
    name: 'Capitales du monde',
    cards: [
      { key: 'France', value: 'Paris' },
      { key: 'Espagne', value: 'Madrid' },
      { key: 'Allemagne', value: 'Berlin' },
      { key: 'Italie', value: 'Rome' },
      { key: 'Royaume-Uni', value: 'Londres' },
      { key: 'Japon', value: 'Tokyo' },
      { key: 'États-Unis', value: 'Washington D.C.' },
      { key: 'Canada', value: 'Ottawa' },
      { key: 'Brésil', value: 'Brasilia' },
      { key: 'Argentine', value: 'Buenos Aires' },
      { key: 'Australie', value: 'Canberra' },
      { key: 'Égypte', value: 'Le Caire' },
      { key: 'Maroc', value: 'Rabat' },
      { key: 'Chine', value: 'Pékin' },
      { key: 'Inde', value: 'New Delhi' }
    ]
  },
  {
    id: makeId(),
    name: 'Anatomie humaine',
    cards: [
      { key: 'Le plus grand organe du corps', value: 'La peau' },
      { key: 'Pompe du système sanguin', value: 'Le cœur' },
      { key: 'Organe qui filtre le sang', value: 'Le rein' },
      { key: 'Organe de la respiration', value: 'Le poumon' },
      { key: 'Os le plus long du corps', value: 'Le fémur' },
      { key: 'Membrane qui protège le cerveau', value: 'La boîte crânienne' },
      { key: 'Petit os du genou', value: 'La rotule' },
      { key: 'Vaisseau qui transporte le sang vers le cœur', value: 'La veine' },
      { key: 'Vaisseau qui transporte le sang hors du cœur', value: 'L’artère' },
      { key: 'Organe qui produit la bile', value: 'Le foie' },
      { key: 'Cellule du système nerveux', value: 'Le neurone' },
      { key: 'Liquide qui transporte l’oxygène', value: 'Le sang' }
    ]
  },
  {
    id: makeId(),
    name: 'Développement web',
    cards: [
      { key: 'HTML', value: 'Langage de balisage structurant le contenu' },
      { key: 'CSS', value: 'Langage de style qui met en forme la page' },
      { key: 'JavaScript', value: 'Langage de programmation du navigateur' },
      { key: 'Vue.js', value: 'Framework JavaScript orienté interface' },
      { key: 'API', value: 'Interface de communication entre logiciels' },
      { key: 'FRONT-END', value: 'Partie visible par l’utilisateur' },
      { key: 'BACK-END', value: 'Partie côté serveur, invisible pour l’utilisateur' },
      { key: 'DOM', value: 'Représentation arborescente de la page HTML' },
      { key: 'Responsive', value: 'S’adapte à toutes les tailles d’écran' },
      { key: 'PWA', value: 'Application web installable et hors ligne' },
      { key: 'Versioning', value: 'Historisation des modifications de code' },
      { key: 'localStorage', value: 'Stockage persistant côté navigateur' },
      { key: 'Module', value: 'Fichier réutilisable exposant des fonctions' },
      { key: 'Compiler', value: 'Transformer le code source en code exécutable' },
      { key: 'Déployer', value: 'Mettre en ligne une application' }
    ]
  }
]