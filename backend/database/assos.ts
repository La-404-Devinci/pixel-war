const data = [
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/iimpact/logos/Logo-Monochrome-avec-NOUVELLE-ecriture-630fc58ce8a48.png",
        label: "IIMPACT",
        value: "iimpact",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/3v/logos/LogoFullColor-MaelleLemaignen-61191bd85b6f7.png",
        label: "3V",
        value: "3v",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/vincisquad/logos/1-Logo-Couleurs-631c4239386ae.png",
        label: "Vinci Squad",
        value: "vincisquad",
    },
    {
        image: "https://cdn.helloasso.com/img/logos/croppedimage-543af697657c4bfa9d135f19cf6a4aa6.png?resize=fill:140:140",
        label: "CELEST",
        value: "celest",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/ada/logos/Logo-ADA-9b3e57-631097c715baf.png",
        label: "ADA",
        value: "ada",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/devinci-durable/logos/deVincvalueurable-ICONEpng-630f6da6f101f.png",
        label: "DeVinci Durable",
        value: "devinci-durable",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/esn-devinci/logos/Logo-ESN-6319f0e2b9440.png",
        label: "ESN DeVinci",
        value: "esn-devinci",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leoandco/logos/4104fb90-61191add21f8f.png",
        label: "Léo&Co",
        value: "leoandco",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leolearning/logos/LogoLeoLearning-Leo-Learning-1-611d736ba40b5.png",
        label: "LéoLearning",
        value: "leolearning",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/safe/logos/Logo-Couleurs-SAFE-630f20f0992f0.png",
        label: "SAFE",
        value: "safe",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/club-entrepreneur/logos/4d3ea699-61264eb0705fa.png",
        label: "Club entrepreneurs",
        value: "club-entrepreneur",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/devinci-junior/logos/DEVINCI-JUNIOR-logo-6310a7a0baa6b.png",
        label: "DeVinci Junior",
        value: "devinci-junior",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/devinci-partners/logos/baseline-base-63190321c7147.png",
        label: "DeVinci Partners",
        value: "devinci-partners",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/kryptosphere/logos/KSDEVINCI-WHITE-01-2-62fd205dc7ae6.png",
        label: "KRYPTOSPHERE DEVINCI",
        value: "kryptosphere",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/vinci-investment/logos/Sans-titre-630a36b1566e4.jpg",
        label: "Vinci Investments",
        value: "vinci-investment",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/comedia-da-vinci/logos/73b80262-611679e324910.png",
        label: "Comedia da Vinci",
        value: "comedia-da-vinci",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/devincitrip/logos/77a796e1-61265272d69ef.png",
        label: "DeVinciTrip",
        value: "devincitrip",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/games-of-devinci/logos/4389c8c5-61167a524789e.png",
        label: "Games Of Devinci",
        value: "games-of-devinci",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/la-joute-de-vinci/logos/LJDV-logo-officiel-1-631efb3c8cf52.png",
        label: "La Joute De Vinci",
        value: "la-joute-de-vinci",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/la-plume-de-vinci/logos/telechargement-63037e780b910.png",
        label: "La Plume De Vinci",
        value: "la-plume-de-vinci",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leocook/logos/Logo-Sweat-630f7a05248a1.png",
        label: "LéoCook",
        value: "leocook",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leonart/logos/Logo-Leonart-6322ee5a6e9c3.png",
        label: "Leon'Art",
        value: "leonart",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leoublon/logos/Logo-fond-vert-630fa38c1b2a5.png",
        label: "Leoublon",
        value: "leoublon",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/musiquemix/logos/logo-mmix-final-sans-titre-63101ad325a85.png",
        label: "MusiqueMix",
        value: "musiquemix",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/tedxpulv/logos/TEDXPLV2022-110-1200x700-631a2cf0badbc.jpg",
        label: "TEDxPLV",
        value: "tedxpulv",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/devinci-lumiere/logos/logo-64f1aa23e9ccb.png",
        label: "Devinci Lumière",
        value: "devinci-lumiere",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/davincibot/logos/Logo-DVB-Transparant-Wim-Poignon-611d7898cf02b.png",
        label: "DaVinciBot",
        value: "davincibot",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/davincicode/logos/40C4E6C2-4D67-4556-BB87-F82141931954-62fd1e682dc6c.png",
        label: "DaVinciCode",
        value: "davincicode",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/devinci-fablab/logos/0c4e1b4f-612650f2472ab.png",
        label: "DeVinci FabLab",
        value: "devinci-fablab",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/digiteam-devinci/logos/Logo-V1-The-Flizziard-611d7adbe8e4f.png",
        label: "DigiTeam",
        value: "digiteam-devinci",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/hydrovinci/logos/4c619502-6126550d9514b.png",
        label: "HydroVinci",
        value: "hydrovinci",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/la-404-devinci/logos/730f147f-6126571771b87.png",
        label: "La 404 Devinci",
        value: "la-404-devinci",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leofly/logos/LeoFly-blanc-fond-bleu-carre-62fdf91488a93.png",
        label: "LéoFly",
        value: "leofly",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/vinci-eco-drive/logos/VED-blanc-rouge-Sny-Drive-611d7e19488a8.png",
        label: "Vinci Eco Drive",
        value: "vinci-eco-drive",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/ldv-esport/logos/LDV-logo-E-fond-noir-Guillaume-Prexl-1-61363560f1955.png",
        label: "LDV ESPORT",
        value: "ldv-esport",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leoindiegames/logos/Leo-Indie-Games-62fed80c65865.png",
        label: "LéoIndieGames",
        value: "leoindiegames",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/poletech/logos/Blanc-Titre-sur-fond-Bleu-copie-62fd54ffd8545.jpg",
        label: "Poletech",
        value: "poletech",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/amma/logos/Logo-AMMA-marbre-630bad70eb243.jpg",
        label: "AMMA",
        value: "amma",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/aviron-devinci/logos/ADV-Logo2-FondRose-512-630fcd651c962.png",
        label: "Aviron Devinci",
        value: "aviron-devinci",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/eagles/logos/270244306-4552765181509542-3287116723628975959-n-630fd0ffc544f.png",
        label: "Eagles",
        value: "eagles",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/etoile-de-vinci/logos/51442638-1928048097317520-8536080237593624576-n-Hugo-Paszynski-1-611d805cc0ac3.jpg",
        label: "Etoile de Vinci",
        value: "etoile-de-vinci",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leo-kings-walker/logos/af8b126f-612659863b0d4.png",
        label: "Léo King's Walker",
        value: "leo-kings-walker",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leo-running-club/logos/image0-6303517a0dcad.png",
        label: "LéoRunning Club",
        value: "leo-running-club",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leobasket/logos/Logo-verso-6315c6fda9da5.png",
        label: "LeoBasket",
        value: "leobasket",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leoclimb/logos/LOGO-LEOCLIMB-BLANC-2-631b216e9e5b7.png",
        label: "LéoClimb",
        value: "leoclimb",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leofive/logos/Leo-Five-Logo-Vector-Official-630352f087b96.png",
        label: "Léofive",
        value: "leofive",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leopompom/logos/leopompom.png",
        label: "LeoPompom",
        value: "leopompom",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leorugby/logos/Logo-detoure-62fe050fc6693.png",
        label: "LéoRugby",
        value: "leorugby",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leosph%C3%A8re/logos/leosphere-6138b34bad566.png",
        label: "LéoSphère",
        value: "leosph%C3%A8re",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leostunt/logos/logostuntcolor-631248debf6a2.jpg",
        label: "LeoStunt",
        value: "leostunt",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leosurvival/logos/Logo-LeoSurvival2022-blanc-630f9cdb2f079.png",
        label: "LeoSurvival",
        value: "leosurvival",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leovoile/logos/leovoile-LEOVOILE-PULV-1-612be425c586d.png",
        label: "Leovoile",
        value: "leovoile",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leovolley/logos/logo-blanc-fond-vert-630fce1aa8d57.png",
        label: "Leovolley",
        value: "leovolley",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leoworkout/logos/logo-LW-630bba9f2f465.png",
        label: "LéoWorkout",
        value: "leoworkout",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/vinci-racing-team/logos/506828c8-611687a183663.png",
        label: "Vinci Racing Team",
        value: "vinci-racing-team",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/build/images/default/logo-default.56106bbb.png",
        label: "La Vague de Vinci",
        value: "la-vague-de-vinci",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/leo-tactical/logos/Logo-LT-631250e1d6047.png",
        label: "Leo Tactical",
        value: "leo-tactical",
    },
];

export default data;
