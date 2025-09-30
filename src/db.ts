export const globals = {
  ticketLink:
    "https://www.billetlugen.dk/event/komba-fight-club-k-b-hallen-20505641/",
  nextEventDate: new Date("2025-10-11T17:00:00+02:00"),
};

export const db = {
  fighters: [
    {
      imageSrc: "/fighters/youssef-assouik.jpg",
      title: "WORLD CHAMP",
      firstName: "Youssef",
      lastName: "Assouik",
      weight: "75.0 KG",
    },
    {
      imageSrc: "/fighters/niclas-larsen.jpg",
      title: "ONE FIGHTER",
      firstName: "Niclas",
      lastName: "Larsen",
      weight: "72.5 KG",
    },
    {
      imageSrc: "/fighters/yassine-mahssoun.jpg",
      title: "AFRICAN CHAMP",
      firstName: "Yassine",
      lastName: "Mahssoun",
      weight: "67.0 KG",
    },
    {
      imageSrc: "/fighters/aleksander-bjerrum.jpg",
      title: "DANISH CHAMP",
      firstName: "Aleksander",
      lastName: "Bjerrum",
      weight: "61.0 KG",
    },
    {
      imageSrc: "/fighters/bedirhan-ceran.jpg",
      title: "DANISH CHAMP",
      firstName: "Bedirhan",
      lastName: "Ceran",
      weight: "65.0 KG",
    },
    {
      imageSrc: "/fighters/benjamin-sesay.jpg",
      title: "DANISH CHAMP",
      firstName: "Benjamin",
      lastName: "Sesay",
      weight: "91.0 KG",
    },
    {
      imageSrc: "/fighters/gintare-lapinskiene.jpg",
      title: "LITHUANIAN CHAMP",
      firstName: "Gintare",
      lastName: "Lapinskiene",
      weight: "60.0 KG",
    },
    {
      imageSrc: "/fighters/isaac.jpg",
      title: "",
      firstName: "Isaac",
      lastName: "Andruszkow",
      weight: "63.5 KG",
    },
    {
      imageSrc: "/fighters/jaspar-landal.jpg",
      title: "Danish Champ",
      firstName: "Jaspar",
      lastName: "Landal",
      weight: "57.0 KG",
    },
    {
      imageSrc: "/fighters/kristoffer-bjorkskog.jpg",
      title: "FINISH CHAMP",
      firstName: "Kristoffer",
      lastName: "Björskog",
      weight: "72.5 KG",
    },
    {
      imageSrc: "/fighters/kristoffer-jensen.jpg",
      title: "",
      firstName: "Kristoffer",
      lastName: "Jensen",
      weight: "75.0 KG",
    },
    {
      imageSrc: "/fighters/luca-coker.jpg",
      title: "DANISH CHAMP",
      firstName: "Luca",
      lastName: "Coker",
      weight: "63.5 KG",
    },
    {
      imageSrc: "/fighters/mathilde-kornval.jpg",
      title: "",
      firstName: "Mathilde",
      lastName: "Kornval",
      weight: "60.0 KG",
    },
    {
      imageSrc: "/fighters/mikkel-wenzel.jpg",
      title: "DANISH CHAMP",
      firstName: "Mikkel",
      lastName: "Wenzel",
      weight: "71.0 KG",
    },
    {
      imageSrc: "/fighters/oliver-perezia.jpg",
      title: "",
      firstName: "Oliver",
      lastName: "Perezia",
      weight: "61.0 KG",
    },
    {
      imageSrc: "/fighters/sakir-bakirov.jpg",
      title: "EUROPEAN CHAMP",
      firstName: "Sakir",
      lastName: "Bakirov",
      weight: "67.0 KG",
    },
    {
      imageSrc: "/fighters/younes-sadi.jpg",
      title: "UNITE WORLD CHAMP",
      firstName: "Younes",
      lastName: "Sadi",
      weight: "81.0 KG",
    },
    {
      imageSrc: "/fighters/tais-o-donell.jpg",
      title: "EUROPEAN CHAMP",
      firstName: "Tais",
      lastName: "O'Donnell",
      weight: "58.0 KG",
    },
    {
      imageSrc: "/fighters/youssef-bendahman.jpg",
      title: "DANISH CHAMP",
      firstName: "Youssef",
      lastName: "Bendahman",
      weight: "63.5 KG",
    },
  ],
  sponsors: [
    "/sponsors/aadvokater.png",
    "/sponsors/assouik.png",
    "/sponsors/flypenge.png",
    "/sponsors/guardian.png",
    "/sponsors/indiaroyale.png",
    "/sponsors/ns.png",
    "/sponsors/pops.png",
    "/sponsors/skousen.png",
    "/sponsors/x44house.png",
    "/sponsors/cyconsult.png",
    "/sponsors/kaffehuset.png",
    "/sponsors/tolkdanmark.png",
    "/sponsors/tandex.png",
  ],
};

export const content = {
  header: {
    links: [
      { label: "EVENTS", href: "/events" },
      { label: "FIGHTERS", href: "/fighters" },
      { label: "SPONSORS", href: "/sponsors" },
      { label: "ABOUT", href: "/about" },
      { label: "CONTACT", href: "/contact" },
    ],
    action: { label: "Buy tickets", href: globals.ticketLink },
  },
  footer: {
    columns: [
      {
        label: "KOMBA",
        links: [
          { label: "Events", href: "/events" },
          { label: "Fighters", href: "/fighters" },
          { label: "Sponsors", href: "/sponsors" },
          { label: "About", href: "/about" },
        ],
      },
      {
        label: "OTHER",
        links: [
          { label: "Apply to fight", href: "#" },
          { label: "Become a sponsor", href: "/sponsors" },
          { label: "Contact us", href: "/sponsors" },
        ],
      },
      {
        label: "SOCIALS",
        links: [
          { label: "Instagram", href: "https://www.instagram.com/komba.fc/" },
          {
            label: "Facebook",
            href: "https://www.facebook.com/kombafightclub",
          },
          { label: "YouTube", href: "#" },
          {
            label: "LinkedIn",
            href: "https://www.linkedin.com/company/kombafc/",
          },
        ],
      },
      {
        label: "LEGAL",
        links: [
          { label: "Terms & conditions", href: "#" },
          { label: "Privacy policy", href: "#" },
          { label: "Cookie policy", href: "#" },
        ],
      },
    ],
  },
  homePage: {
    hero: {
      title: "ACTION.<br/>ADRENALINE.<br/>ENTERTAINMENT.",
      label: "Denmark's Leading Stage for Striking Combat Sports",
      actions: {
        secondary: {
          label: "Next event",
          href: "https://kbhallen.dk/event/komba-fight-club_2025-10-11/",
        },
      },
      backgroundImage: "/sample-0.png",
    },
    mediaContent: {
      imageSrc: "/fight-poster-komba-fc-2025.jpg",
      title:
        "<span>Saturday October 11:</span> Komba Fight Club takes over K. B. Hallen",
      description:
        "Get your tickets for our grand premiere which takes place in K. B. Hallen hosting a whopping 3000 spectators. A huge experience with two world titles on the line, international fighters from Finland, Turkey, Morocco, Sweeden and of course Denmark. The main-event of the evening is the danish sensation Niclas Larsen taking on the infamous Finnish fighter, Kristoffer Björkskog.",
      action: {
        label: "BUY TICKETS",
        mobileLabel: "GET YOUR TICKETS",
        href: globals.ticketLink,
      },
    },
    slideshow: [
      {
        paragraph:
          "KOMBA is a unique experience where the best strikers in combat sports clash to put on a show.",
        imageSrc: "/sample-1.png",
      },
      {
        paragraph:
          "We envision an immersive experience gathering both fight fans and newcomers around a shared interest.",
        imageSrc: "/sample-2.png",
      },
      {
        paragraph:
          "Prepare for an incredible evening. It will be bold, different and extraordinary. You do not want to miss it...",
        imageSrc: "/komba-fight-club-1.jpg",
      },
    ],
    fightersOverview: {
      label: "FIGHTERS",
      title:
        "We’re bringing <span>the best</span> Danish and international <span>Strikers</span>.",
      description:
        "Are you ready when the best fighters brings their style to the ring? Our fight club brings peak action and entertainment to Denmark.",
      actions: {
        primary: { label: "OUR FIGHTERS", href: "/" },
        secondary: { label: "APPLY TO FIGHT", href: "/" },
      },
    },
    fwMediaContent: {
      imageSrc: "/sponsor-img.jpg",
      title: "Become a driving force in a growing movement.",
      text: "Take your brand to the ringside along champions, leaders and visionaries.",
      action: {
        href: "/sponsor",
        label: "Partner with us",
      },
    },
  },
  fightersPage: {
    hero: {
      title: "The best strikers to take on Denmark.",
      label: "Watch Muay Thai & K-1 in it's finest form.",
      actions: {
        primary: { label: "APPLY AS A FIGHTER", href: "/apply" },
      },
      backgroundImage: "/komba-fight-club-1.jpg",
    },
    allFighters: {
      applyLink: "/apply",
      placeholderImage: "/fighter-placeholder.png",
    },
  },
};
