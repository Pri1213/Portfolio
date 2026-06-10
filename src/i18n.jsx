import { createContext, useContext, useEffect, useState } from 'react'

const STRINGS = {
  en: {
    nav: { home: 'Home', f1: 'F1 Live', dj: 'Off the Clock', cv: 'Download CV' },
    hero: {
      status: 'SYSTEMS ONLINE',
      role: 'Analytics Engineer',
      quote: '“I build data infrastructure that businesses rely on.”',
      viewWork: 'View My Work',
      cv: 'Download CV',
      f1: 'F1 Live',
    },
    about: {
      eyebrow: '// about',
      title: "I'm Priyasnee. I build data platforms that businesses depend on.",
      p1: 'Three months into my first proper role, I was handed a broken data landscape and told to fix it. No handover. No roadmap. Just me, a laptop, and a lot of coffee walks.',
      p2a: 'I built the whole thing from scratch. And somewhere in the process, found ',
      p2b: '£600K in missed revenue',
      p2c: ' that nobody knew was missing.',
      p3: "I'm based in London, originally from Mauritius. When I'm not untangling data pipelines, I'm watching F1 races, learning to DJ, or figuring out how to be slightly more serious.",
      p4: '(Still working on that last one.)',
      stat1: 'Revenue recovered',
      stat2: 'dbt models in production',
      stat3: 'Countries served',
      stat4: 'Person doing all of this',
    },
    sections: {
      skills: { eyebrow: '// skills', title: 'The toolkit' },
      experience: { eyebrow: '// experience', title: "Where I've raced" },
      projects: { eyebrow: '// projects', title: 'Side quests' },
      education: { eyebrow: '// education', title: 'Training data' },
      quiz: { eyebrow: '// the paddock quiz', title: 'How well do you know the driver?' },
    },
    contact: {
      eyebrow: '// contact',
      title: "Let's talk.",
      available: 'Available for new opportunities in London.',
      cv: 'Download CV',
    },
    quiz: {
      intro: 'Five questions. Zero stakes. One slightly biased quizmaster.',
      start: 'Lights out — start',
      next: 'Next question',
      finish: 'See my result',
      restart: 'Run it again',
      score: 'Final classification',
      qOf: (i, n) => `Question ${i} of ${n}`,
      questions: [
        {
          q: 'Three months into her first proper role, Priyasnee found something unusual in the data. What was it?',
          options: ['A typo in a column name', '£600K in missed revenue', 'Someone storing dates as text', 'A second, secret database'],
          answer: 1,
          fact: 'Forensic reconciliation of order-vs-invoice discrepancies uncovered £600K — then she fixed the bug, recovered the money, and built a governance process so it never happens again.',
        },
        {
          q: 'Who keeps Priyasnee company during late-night pipeline debugging?',
          options: ['A rubber duck', 'Bobby, a dachshund with strong opinions', 'The on-call rota', 'Nobody. The logs are company enough'],
          answer: 1,
          fact: 'Bobby the dachshund: chief morale officer, zero SQL skills, 100% attendance. Try the paw button in the corner of the screen.',
        },
        {
          q: 'Which of these belts does Priyasnee actually hold?',
          options: ['Conveyor', 'Seat', 'Karate black belt', 'Fan belt'],
          answer: 2,
          fact: 'Competitive karate, black belt. The discipline transfers surprisingly well to code review.',
        },
        {
          q: 'Priyasnee is fully bilingual. In which two languages?',
          options: ['English & French', 'SQL & Python', 'English & Klingon', 'French & dbt Jinja'],
          answer: 0,
          fact: "English and French, both fluent — try the FR toggle in the navbar. (SQL and Python are fluent too, but they don't count as spoken.)",
        },
        {
          q: 'On a Sunday afternoon during race season, Priyasnee is most likely…',
          options: ['Sleeping in', 'Watching F1 with telemetry open in another tab', 'Reorganising her sock drawer', 'Voluntarily writing documentation'],
          answer: 1,
          fact: 'F1 obsession runs deep — race strategy and telemetry data especially. The /f1 page of this site pulls live championship data through her own serverless API.',
        },
      ],
      grades: [
        { min: 5, label: 'P1 — POLE POSITION', text: 'Flawless. You clearly read the whole site. Hiring managers of your calibre are rare.' },
        { min: 4, label: 'P2 — PODIUM', text: 'Strong drive. One small lock-up but the pace was real.' },
        { min: 2, label: 'POINTS FINISH', text: 'Solid midfield performance. The data suggests a second read of the About section.' },
        { min: 0, label: 'PIT LANE START', text: 'Box, box. Scroll up, do one more lap, and try again.' },
      ],
    },
    bobby: {
      tooltip: 'Do not pet the intern (he insists)',
      woof: 'woof. (translation: hire her)',
    },
    footer: 'Built with React, Three.js & too much coffee',
  },

  fr: {
    nav: { home: 'Accueil', f1: 'F1 en direct', dj: 'Hors service', cv: 'Télécharger le CV' },
    hero: {
      status: 'SYSTÈMES EN LIGNE',
      role: 'Analytics Engineer',
      quote: '« Je construis des infrastructures de données sur lesquelles les entreprises peuvent compter. »',
      viewWork: 'Voir mon travail',
      cv: 'Télécharger le CV',
      f1: 'F1 en direct',
    },
    about: {
      eyebrow: '// à propos',
      title: 'Je suis Priyasnee. Je construis des plateformes de données dont les entreprises dépendent.',
      p1: "Trois mois après le début de mon premier vrai poste, on m'a confié un paysage de données en vrac avec mission de tout réparer. Pas de passation. Pas de feuille de route. Juste moi, un ordinateur portable et beaucoup de pauses café.",
      p2a: "J'ai tout reconstruit de zéro. Et en chemin, j'ai découvert ",
      p2b: '600 K£ de revenus manqués',
      p2c: ' dont personne ne soupçonnait la disparition.',
      p3: "Je vis à Londres, originaire de l'île Maurice. Quand je ne démêle pas des pipelines de données, je regarde la F1, j'apprends à mixer, ou j'essaie de devenir un peu plus sérieuse.",
      p4: '(Ce dernier chantier est toujours en cours.)',
      stat1: 'Revenus récupérés',
      stat2: 'modèles dbt en production',
      stat3: 'Pays desservis',
      stat4: 'Personne pour tout faire',
    },
    sections: {
      skills: { eyebrow: '// compétences', title: 'La boîte à outils' },
      experience: { eyebrow: '// expérience', title: "Mes circuits" },
      projects: { eyebrow: '// projets', title: 'Quêtes annexes' },
      education: { eyebrow: '// formation', title: "Données d'entraînement" },
      quiz: { eyebrow: '// le quiz du paddock', title: 'Connaissez-vous bien la pilote ?' },
    },
    contact: {
      eyebrow: '// contact',
      title: 'Parlons-en.',
      available: 'Disponible pour de nouvelles opportunités à Londres.',
      cv: 'Télécharger le CV',
    },
    quiz: {
      intro: 'Cinq questions. Zéro enjeu. Une quizmaster légèrement partiale.',
      start: 'Feux éteints — c\'est parti',
      next: 'Question suivante',
      finish: 'Voir mon résultat',
      restart: 'On refait un tour',
      score: 'Classement final',
      qOf: (i, n) => `Question ${i} sur ${n}`,
      questions: [
        {
          q: "Trois mois après ses débuts, Priyasnee a trouvé quelque chose d'inhabituel dans les données. Quoi donc ?",
          options: ['Une faute de frappe dans un nom de colonne', '600 K£ de revenus manqués', 'Des dates stockées en texte', 'Une seconde base de données secrète'],
          answer: 1,
          fact: "Une réconciliation minutieuse commandes-factures a révélé 600 K£ — puis elle a corrigé le bug, récupéré les montants et mis en place une gouvernance mensuelle pour éviter toute récidive.",
        },
        {
          q: 'Qui tient compagnie à Priyasnee pendant les sessions de debug nocturnes ?',
          options: ['Un canard en plastique', 'Bobby, un teckel aux opinions tranchées', "La rotation d'astreinte", 'Personne. Les logs suffisent'],
          answer: 1,
          fact: "Bobby le teckel : directeur du moral, zéro compétence SQL, 100 % de présence. Essayez le bouton patte en bas de l'écran.",
        },
        {
          q: 'Laquelle de ces ceintures Priyasnee possède-t-elle vraiment ?',
          options: ['De transmission', 'De sécurité', 'Ceinture noire de karaté', 'De ventilateur'],
          answer: 2,
          fact: 'Karaté en compétition, ceinture noire. Une discipline qui se transfère étonnamment bien à la revue de code.',
        },
        {
          q: 'Priyasnee est parfaitement bilingue. Dans quelles langues ?',
          options: ['Anglais & français', 'SQL & Python', 'Anglais & klingon', 'Français & Jinja dbt'],
          answer: 0,
          fact: "Anglais et français, couramment — vous lisez la preuve. (SQL et Python aussi, mais ça ne compte pas comme langues parlées.)",
        },
        {
          q: 'Un dimanche après-midi en saison de F1, Priyasnee est probablement…',
          options: ['En grasse matinée', 'Devant la F1, télémétrie ouverte dans un autre onglet', 'En train de trier ses chaussettes', 'En train d\'écrire de la documentation par plaisir'],
          answer: 1,
          fact: "Passion F1 assumée — stratégie de course et télémétrie surtout. La page /f1 de ce site affiche le championnat en direct via sa propre API serverless.",
        },
      ],
      grades: [
        { min: 5, label: 'P1 — POLE POSITION', text: 'Sans faute. Vous avez clairement lu tout le site. Les recruteurs de votre calibre sont rares.' },
        { min: 4, label: 'P2 — PODIUM', text: 'Belle course. Un petit blocage de roue, mais le rythme était là.' },
        { min: 2, label: 'DANS LES POINTS', text: 'Solide performance de milieu de grille. Les données suggèrent une relecture de la section À propos.' },
        { min: 0, label: 'DÉPART DES STANDS', text: 'Box, box. Remontez la page, faites un tour de plus et réessayez.' },
      ],
    },
    bobby: {
      tooltip: 'Ne pas caresser le stagiaire (il insiste)',
      woof: 'wouf. (traduction : embauchez-la)',
    },
    footer: 'Construit avec React, Three.js et beaucoup trop de café',
  },
}

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: STRINGS.en })

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    return localStorage.getItem('lang') || (navigator.language?.startsWith('fr') ? 'fr' : 'en')
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t: STRINGS[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
