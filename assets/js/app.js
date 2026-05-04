/* global Vue */
/*
  Portfolio Vue 3 app — uses the Vue 3 global CDN build (no bundler).
  Mounts to #app inside index.html. All UI state (active section,
  filters, selected project, lightbox) lives here.
*/

const { createApp, ref, computed, onMounted, onBeforeUnmount, watch } = Vue;

createApp({
  setup() {
    // ---------------------------------------------------------------
    // Static content
    // ---------------------------------------------------------------
    // Inline SVG icons keep the bundle dependency-free.
    const icon = (path) =>
      `<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7">${path}</svg>`;

    // ---------------------------------------------------------------
    // i18n — UI strings for both languages. Project & methodology data
    // already contain bilingual content elsewhere; this dictionary is for
    // the surrounding chrome (nav, headings, buttons, paragraphs).
    // ---------------------------------------------------------------
    const translations = {
      en: {
        name: 'Mahmoud Haggag',
        fullName: 'Mahmoud Said Haggag',
        nav: { home: 'Home', about: 'About', skills: 'Skills', experience: 'Experience', projects: 'Projects', contact: 'Contact', getInTouch: 'Get in touch' },
        hero: {
          available: 'Available for new opportunities',
          hi: "Hi, I'm",
          role: 'Senior Full Stack Engineer.',
          desc1: 'I design and build',
          desc2: 'scalable, secure, production-grade',
          desc3: 'web and mobile platforms. 9+ years shipping enterprise systems across education, eCommerce, fintech, GIS, AI-driven research, and government — backed by clean architecture, strong APIs, and DevOps automation.',
          ctaWork: 'View my work',
          ctaContact: 'Contact me',
          ctaIntro: 'Watch intro',
          statExp: 'Experience', statExpSub: 'years',
          statProj: 'Projects', statProjSub: 'shipped',
          statCli: 'Clients', statCliSub: 'companies',
        },
        about: {
          heading: 'About me',
          kicker: 'Backend-focused full stack engineer with a soft spot for clean architecture, fast APIs, and the systems that quietly run the business.',
          p1: "I'm <strong class=\"text-white\">Mahmoud Said Haggag</strong>, a Senior Full Stack Software Engineer based in Alexandria, Egypt with a B.Sc. in Computer Science from Menoufia University. Over the past 9+ years I've designed and shipped enterprise-grade platforms across education, eCommerce, fintech, GIS, AI-driven research, government, and more.",
          p2: 'My core stack is <strong class="text-white">Laravel (PHP)</strong> on the backend and <strong class="text-white">Vue.js / Nuxt.js</strong> on the frontend — backed by REST &amp; SOAP APIs, WebSockets, MySQL/Oracle/MongoDB, Docker, and CI/CD pipelines. I care about writing code that\'s tested, readable, and built to outlive me on the team.',
          p3: 'I work well solo and inside Agile teams (Scrum / Kanban), I learn fast, and I love turning vague product asks into systems that just work.',
          cardLocation: 'Location',           cardLocationVal: 'Alexandria, Egypt — open to on-site or remote',
          cardEducation: 'Education',         cardEducationVal: 'B.Sc. Computer Science, Menoufia University (2012–2016)',
          cardExperience: 'Experience',       cardExperienceVal: '9+ years · 50+ production systems · 7 companies across SA & EG',
          cardLanguages: 'Languages',         cardLanguagesVal: 'Arabic (Native) · English (Proficient)',
          cardIndustries: 'Industries',       cardIndustriesVal: '17+ verticals — Education, ERP, Fintech, GIS, Government, AI/ML, Logistics & more',
          cardHowIWork: 'How I work',         cardHowIWorkVal: 'AI-augmented workflow · Agile (Scrum/Kanban) · TDD/BDD · Clean Architecture',
        },
        skills: {
          heading: 'Technical skills',
          kicker: 'The tools I reach for, organized by where they live in the stack.',
          methHeading: 'Methodologies & practices',
          methKicker: 'How I structure work, reason about systems, and ship reliably — beyond the toolset above.',
          softHeading: 'Soft skills & languages',
          softKicker: 'Who I am beyond the keyboard, and how I communicate.',
          softTitle: 'Soft skills',
          langTitle: 'Languages',
        },
        experience: {
          heading: 'Work experience',
          kicker: "A timeline of where I've spent my coding hours over the last decade.",
        },
        projects: {
          heading: 'Featured projects',
          kicker: 'A curated selection of production systems I designed and shipped. Click any card for details.',
          filterAll: 'All', filterWeb: 'Web', filterMobile: 'Mobile',
          loading: 'Loading projects...',
          empty: 'No projects match the selected filter.',
          clickDetails: 'Click to view details',
          view: 'View',
        },
        otherProjects: {
          heading: 'More production work',
          kicker: 'Additional platforms I contributed to across various industries.',
        },
        contact: {
          heading1: "Let's build something",
          highlight: 'great',
          heading2: '.',
          desc: 'Have a product idea, a hairy backend project, or a team that needs a senior full stack engineer? Drop me a line — I usually reply within a day.',
        },
        modal: {
          web: 'Web Platform',
          mobile: 'Mobile App',
          webLong: 'Web Platform',
          mobileLong: 'Mobile Application',
          visitLive: 'Visit live site',
          builtWith: 'Built with',
          details: 'Project details',
          screenshots: 'Screenshots',
          imagesUnit: 'images',
        },
        footer: { tagline: 'Built with Vue + Tailwind.' },
      },
      ar: {
        name: 'محمود حجاج',
        fullName: 'محمود سعيد حجاج',
        nav: { home: 'الرئيسية', about: 'عنّى', skills: 'المهارات', experience: 'الخبرات', projects: 'المشاريع', contact: 'تواصل', getInTouch: 'تواصل معايا' },
        hero: {
          available: 'متاح لفرص جديدة',
          hi: 'أهلاً، أنا',
          role: 'Senior Full Stack Engineer.',
          desc1: 'بصمّم وأبنى',
          desc2: 'منصات قابلة للتوسّع، آمنة، بمستوى إنتاجى',
          desc3: 'للويب والموبايل. أكتر من 9 سنين بشحن أنظمة Enterprise فى مجالات التعليم، الـ eCommerce، الفنتك، الـ GIS، أبحاث الذكاء الاصطناعى، والحكومى — مدعوم بـ Clean Architecture وAPIs قوية وDevOps automation.',
          ctaWork: 'استعرض أعمالى',
          ctaContact: 'تواصل معايا',
          ctaIntro: 'شغّل التعريف',
          statExp: 'الخبرة', statExpSub: 'سنين',
          statProj: 'مشاريع', statProjSub: 'تم شحنها',
          statCli: 'العملاء', statCliSub: 'شركة',
        },
        about: {
          heading: 'عنّى',
          kicker: 'مهندس Full Stack بتركيز على الـ Backend ومتعلّق بالـ Clean Architecture والـ APIs السريعة والأنظمة اللى بتشغّل البيزنس بهدوء.',
          p1: 'أنا <strong class="text-white">محمود سعيد حجاج</strong>، مهندس Senior Full Stack من الإسكندرية، مصر، خريج علوم حاسب من جامعة المنوفية. على مدار +9 سنين بصمّم وأشحن منصات بمستوى Enterprise فى التعليم، الـ eCommerce، الفنتك، الـ GIS، أبحاث الذكاء الاصطناعى، الحكومى، وأكتر.',
          p2: 'الـ Stack الأساسى عندى <strong class="text-white">Laravel (PHP)</strong> فى الـ backend و<strong class="text-white">Vue.js / Nuxt.js</strong> فى الـ frontend — مع REST و SOAP APIs، WebSockets، MySQL/Oracle/MongoDB، Docker، وCI/CD pipelines. بهتم أكتب كود متيستد، مقروء، ومبنى يفضل بعدى فى التيم.',
          p3: 'بشتغل كويس بمفردى وداخل تيم Agile (Scrum / Kanban)، بتعلّم بسرعة، وبحب أحوّل الطلبات الـ vague لأنظمة بتشتغل صح.',
          cardLocation: 'المكان',          cardLocationVal: 'الإسكندرية، مصر — متاح On-site أو Remote',
          cardEducation: 'الدراسة',        cardEducationVal: 'بكالوريوس علوم حاسب، جامعة المنوفية (2012–2016)',
          cardExperience: 'الخبرة',        cardExperienceVal: '+9 سنين · +50 نظام إنتاجى · 7 شركات فى السعودية ومصر',
          cardLanguages: 'اللغات',         cardLanguagesVal: 'العربية (لغة أم) · الإنجليزية (Proficient)',
          cardIndustries: 'المجالات',      cardIndustriesVal: '+17 مجال — تعليم، ERP، فنتك، GIS، حكومى، AI/ML، Logistics وأكتر',
          cardHowIWork: 'إزاى بشتغل',     cardHowIWorkVal: 'AI-augmented workflow · Agile (Scrum/Kanban) · TDD/BDD · Clean Architecture',
        },
        skills: {
          heading: 'المهارات التقنية',
          kicker: 'الأدوات اللى بشتغل بيها، مرتّبة حسب مكانها فى الـ Stack.',
          methHeading: 'المنهجيات والممارسات',
          methKicker: 'إزاى بنظّم الشغل، بفكّر فى الأنظمة، وبشحن بثبات — بعيداً عن الأدوات اللى فوق.',
          softHeading: 'المهارات الشخصية واللغات',
          softKicker: 'مين أنا بعيداً عن الكيبورد، وإزاى بتواصل.',
          softTitle: 'مهارات شخصية',
          langTitle: 'اللغات',
        },
        experience: {
          heading: 'الخبرات العملية',
          kicker: 'خط زمنى للأماكن اللى قضيت فيها ساعات الكود على مدار العقد الأخير.',
        },
        projects: {
          heading: 'مشاريع مختارة',
          kicker: 'مجموعة منتقاة من الأنظمة الإنتاجية اللى صمّمتها وشحنتها. اضغط على أى كارت للتفاصيل.',
          filterAll: 'الكل', filterWeb: 'ويب', filterMobile: 'موبايل',
          loading: 'جارى التحميل...',
          empty: 'مفيش مشاريع تطابق الفلتر المختار.',
          clickDetails: 'اضغط للتفاصيل',
          view: 'عرض',
        },
        otherProjects: {
          heading: 'أعمال إنتاجية إضافية',
          kicker: 'منصات أخرى ساهمت فيها فى مجالات متنوّعة.',
        },
        contact: {
          heading1: 'يلا نبنى حاجة',
          highlight: 'متميّزة',
          heading2: '.',
          desc: 'عندك فكرة منتج، مشروع backend صعب، أو تيم محتاج مهندس Senior Full Stack؟ ابعتلى رسالة — عادةً برد خلال يوم.',
        },
        modal: {
          web: 'منصة ويب',
          mobile: 'تطبيق موبايل',
          webLong: 'منصة ويب',
          mobileLong: 'تطبيق موبايل',
          visitLive: 'زيارة الموقع',
          builtWith: 'التقنيات المستخدمة',
          details: 'تفاصيل المشروع',
          screenshots: 'صور من المشروع',
          imagesUnit: 'صورة',
        },
        footer: { tagline: 'مبنى بـ Vue + Tailwind.' },
      },
    };
    const t = computed(() => translations[lang.value]);

    const navLinks = computed(() => [
      { id: 'home',       label: t.value.nav.home },
      { id: 'about',      label: t.value.nav.about },
      { id: 'skills',     label: t.value.nav.skills },
      { id: 'experience', label: t.value.nav.experience },
      { id: 'projects',   label: t.value.nav.projects },
      { id: 'contact',    label: t.value.nav.contact },
    ]);

    // Tooling skills — mirrors the CV's first three "Technical Skills"
    // subsections (Programming Languages / Backend / Frontend) verbatim,
    // so the site stays a faithful reflection of the printed CV.
    const skills = [
      {
        title: 'Programming Languages',
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />'),
        items: ['PHP', 'Java', 'JavaScript (ES6)', 'Python (Basic)', 'C++ (Basic)', 'Assembly (Basic)', 'SQL/PLSQL', 'Dart'],
      },
      {
        title: 'Backend',
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M5 12V7a2 2 0 012-2h10a2 2 0 012 2v5M5 12v5a2 2 0 002 2h10a2 2 0 002-2v-5M5 12h14M9 8h.01M9 16h.01" />'),
        items: ['Laravel Framework', 'Node.js', 'Java SE/EE', 'WebSocket', 'Web Services (SOAP, RESTful)', 'WebRTC'],
      },
      {
        title: 'Frontend',
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 6a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2M9 22h6m-3-4v4" />'),
        items: ['HTML', 'CSS', 'Vue.js', 'Nuxt.js', 'Vuetify', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'XML', 'JSON', 'GraphQL', 'Ajax'],
      },
    ];

    // Higher-level engineering disciplines & methodologies — mirrors the
    // CV's "Systems Analysis", "Project Management", etc. subsections so
    // the site reads like a formal capabilities list under the Skills grid.
    const practices = [
      {
        title: 'Systems Analysis & Design',
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M3 7h4l2-3h6l2 3h4M3 7v12a2 2 0 002 2h14a2 2 0 002-2V7M9 13l2 2 4-4" />'),
        items: [
          'Software Engineering (Documentation, Testing, Code Standards, Naming Conventions)',
          'UML Diagrams',
          'SOLID Principles',
          'Design Patterns',
        ],
      },
      {
        title: 'Project Management',
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />'),
        items: [
          'Agile (Scrum, Kanban)',
          'Waterfall Methodology',
        ],
      },
      {
        title: 'Database Management Systems',
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M4 7c0-1.657 3.582-3 8-3s8 1.343 8 3-3.582 3-8 3-8-1.343-8-3zm0 0v10c0 1.657 3.582 3 8 3s8-1.343 8-3V7M4 12c0 1.657 3.582 3 8 3s8-1.343 8-3" />'),
        items: [
          'Relational: MySQL, Oracle, SQL Server, PostgreSQL',
          'NoSQL: Firebase, MongoDB',
        ],
      },
      {
        title: 'Testing Technologies',
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M12 11v6m-3-3h6" />'),
        items: [
          'Automation Testing (PHPUnit, Pest)',
          'TDD',
          'BDD',
        ],
      },
      {
        title: 'Version Control Systems (Git)',
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M8 7v10m0-10l-4 4m4-4l4 4m4 6V7m0 10l-4-4m4 4l4-4" />'),
        items: [
          'GitHub',
          'Bitbucket',
          'GitLab',
        ],
      },
      {
        title: 'DevOps',
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999A5.002 5.002 0 006 11a4 4 0 00-3 4z" />'),
        items: [
          'CI/CD Pipelines (GitHub Actions, GitLab CI, Jenkins)',
          'Docker, Docker Compose, Docker Swarm',
          'Git Workflows',
        ],
      },
      {
        title: 'Operating Systems',
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />'),
        items: [
          'Microsoft Windows',
          'Linux',
        ],
      },
      {
        title: 'GIS Technologies',
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />'),
        items: [
          'Google Maps API',
          'ArcGIS',
        ],
      },
    ];

    // Soft skills & languages — mirror the CV's "Soft Skills" and
    // "Language Skills" sections so the site stays a 1:1 reflection.
    // Bilingual so the global lang toggle flips them with the rest.
    const softSkills = [
      { en: 'Self-motivated, problem-solver',     ar: 'مبادر ذاتياً وحلّال للمشاكل' },
      { en: 'Team and independent worker',        ar: 'بشتغل ضمن فريق ومستقل بنفس الكفاءة' },
      { en: 'Thrives under pressure',             ar: 'بأدّى أحسن تحت الضغط' },
      { en: 'Passionate about new technologies',  ar: 'شغوف بالتقنيات الجديدة' },
    ];

    const languageSkills = [
      {
        lang: 'Arabic',
        flag: '🇪🇬',
        level: 'Native',
        percent: 100,
      },
      {
        lang: 'English',
        flag: '🇬🇧',
        // Mixed level — strong in reading/writing (years of code, docs,
        // and English-only collaboration), conversational at intermediate.
        breakdown: [
          { name: 'Reading',   level: 'Proficient',   percent: 90 },
          { name: 'Writing',   level: 'Proficient',   percent: 85 },
          { name: 'Speaking',  level: 'Intermediate', percent: 60 },
          { name: 'Listening', level: 'Intermediate', percent: 65 },
        ],
      },
    ];

    const experience = [
      {
        role: 'Full Stack Developer',
        company: 'iLearn',
        url: 'https://ilearn.sa',
        period: '06/2023 — Present',
        points: [
          'Built scalable full stack applications with Laravel + Vue.js for seamless front/back integration.',
          'Implemented real-time features using WebSockets and optimized data layers across MySQL & Firebase.',
          'Hardened security and shipped deployments to cloud and dedicated servers via CI/CD and Docker.',
        ],
      },
      {
        role: 'Full Stack Developer',
        company: 'FocusEMS',
        url: 'https://focusems.com',
        period: '06/2020 — 06/2023',
        points: [
          'Maintained full stack systems with Laravel and Vue.js, focused on robust REST APIs and real-time updates.',
          'Configured CI/CD pipelines that reduced deployment time by ~30%.',
          'Managed shared hosting and cloud environments with scalability and security in mind.',
        ],
      },
      {
        role: 'Full Stack Developer',
        company: 'Business Circles',
        url: 'https://circles.business',
        period: '08/2018 — 06/2020',
        points: [
          'Built secure full stack applications with Laravel + Vue.js, integrating REST/SOAP APIs.',
          'Implemented Git workflows and high-coverage automated test suites.',
          'Optimized database queries to keep API latency in check under load.',
        ],
      },
      {
        role: 'Mid-Level Web Developer',
        company: 'Master Vision',
        url: 'https://mv-is.com',
        period: '03/2018 — 08/2018',
        points: [
          'Developed web applications using PHP, CodeIgniter, Laravel, and JavaScript.',
          'Designed UML diagrams for system architecture and integrated Google Maps API.',
          'Refactored legacy code for maintainability and team velocity.',
        ],
      },
      {
        role: 'Mid-Level Web Developer',
        company: 'Sweven',
        url: 'https://sweven.net',
        period: '06/2016 — 03/2018',
        points: [
          'Built dynamic web applications with PHP, Laravel, and JavaScript.',
          'Managed relational databases and contributed to Agile delivery.',
          'Documented system designs to improve onboarding and clarity.',
        ],
      },
      {
        role: 'Junior Web Developer (Part-time)',
        company: 'AppRoc',
        url: 'https://approc.com',
        period: '06/2015 — 06/2016',
        points: [
          'Assisted in building web applications with PHP/Laravel and basic JavaScript.',
        ],
      },
      {
        role: 'Junior Web Developer (Freelance)',
        company: 'Paladox',
        url: 'http://paladox.com',
        period: '01/2016 — 06/2016',
        points: [
          'Delivered full-stack features using PHP and JavaScript on freelance contracts.',
        ],
      },
    ];

    // Animated intro — 6 scenes synced to the recorded narration script.
    // Each scene has its own duration, tags for visual flavor, and bilingual
    // copy that mirrors the EN/AR scripts the user locked in.
    const introScenes = [
      {
        duration: 8000,
        tags: [],
        en: {
          kicker: 'Hello',
          title: "I'm Mahmoud Haggag",
          subtitle: 'Full Stack Developer · 9+ years building web applications.',
        },
        ar: {
          kicker: 'السلام عليكم',
          title: 'أنا محمود حجاج',
          subtitle: 'Full Stack Developer — خبرة أكتر من 9 سنين فى تطوير تطبيقات الويب.',
        },
      },
      {
        duration: 12000,
        tags: ['Laravel', 'Vue.js', 'End-to-end', 'Scalable'],
        en: {
          kicker: 'My core stack',
          title: 'Laravel · Vue.js',
          subtitle: 'Building end-to-end systems and scalable solutions that handle large numbers of users efficiently.',
        },
        ar: {
          kicker: 'الـ Stack الأساسى',
          title: 'Laravel · Vue.js',
          subtitle: 'بناء أنظمة متكاملة وحلول scalable تخدم عدد كبير من المستخدمين بكفاءة.',
        },
      },
      {
        duration: 12000,
        tags: ['WebSockets', 'MySQL', 'MongoDB', 'Firebase', 'Performance'],
        en: {
          kicker: 'Real-time & data',
          title: 'WebSockets · multi-database',
          subtitle: 'Performance-tuned systems with the right database for each project — relational or NoSQL.',
        },
        ar: {
          kicker: 'لحظى وقواعد بيانات',
          title: 'WebSockets · قواعد بيانات متعددة',
          subtitle: 'تحسين أداء الأنظمة والتعامل مع قواعد بيانات مختلفة حسب احتياجات كل مشروع.',
        },
      },
      {
        duration: 14000,
        tags: ['Architecture', 'Security', 'Docker', 'GitHub Actions', 'CI/CD'],
        en: {
          kicker: 'Beyond just code',
          title: 'Architecture · Security · DevOps',
          subtitle: 'CI/CD pipelines with Docker and GitHub Actions, performance and security baked in from day one.',
        },
        ar: {
          kicker: 'مش مجرد كود',
          title: 'Architecture · Security · DevOps',
          subtitle: 'CI/CD pipelines بـ Docker و GitHub Actions، الأمان والأداء جزء من التصميم.',
        },
      },
      {
        duration: 12000,
        tags: ['Education', 'Data-driven', 'Management', 'ERP'],
        en: {
          kicker: 'Diverse projects',
          title: 'Education · Data · Management',
          subtitle: 'Different domains, different challenges — practical solutions across many industries.',
        },
        ar: {
          kicker: 'مشاريع متنوعة',
          title: 'تعليم · تحليل بيانات · إدارة',
          subtitle: 'مجالات مختلفة، تحديات مختلفة، وحلول عملية فى أكتر من قطاع.',
        },
      },
      {
        duration: 10000,
        tags: [],
        cta: true,
        en: {
          kicker: "Let's collaborate",
          title: 'Mahmoud Haggag',
          subtitle: "If you think my experience could be a good fit — feel free to reach out.",
        },
        ar: {
          kicker: 'يلا نتكلم',
          title: 'محمود حجاج',
          subtitle: 'لو شايف إن خبرتى مناسبة لمشروعك — تواصل معايا.',
        },
      },
    ];

    // Other production projects from the CV that aren't in projects.json.
    const otherProjects = [
      { name: 'FocusEMS',       url: 'https://focusems.net',       desc: 'Comprehensive education management system for streamlined academic operations.' },
      { name: 'Caffebene',      url: 'https://caffebene.com.sa',   desc: 'Global coffee house digital platform across 1,600+ locations worldwide.' },
      { name: '3D Araby',       url: 'https://3daraby.com',        desc: 'Platform for creating and managing interactive 3D models.' },
      { name: 'Kids Directory', url: 'https://kidsdirectory.com.eg', desc: "Comprehensive guide for children's services in Egypt — education, healthcare, and more." },
      { name: 'Ajaza Book',     url: 'https://agazabook.com',      desc: 'Travel booking platform for tourism programs and hotel reservations.' },
      { name: 'Arab Science',   url: 'https://www.arab-science.com', desc: 'Supplier of chemicals, equipment, and kits for scientific research.' },
      { name: 'Tag (TechnoAirGate)', url: 'https://technoairgate.com', desc: 'HVAC validation and clean-room services across Egypt and the Gulf.' },
      { name: 'Fortune Makers', url: 'https://fortunemakers.io',   desc: 'Interactive platform for digital investment and funding solutions.' },
      { name: 'White Esnad',    url: 'https://www.esnadmedical.sa', desc: 'Platform for homecare medical services in Saudi Arabia.' },
    ];

    const contactLinks = [
      {
        label: 'Email',
        value: 'mahmoudhaggag641@gmail.com',
        href: 'mailto:mahmoudhaggag641@gmail.com',
        external: false,
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />'),
      },
      {
        label: 'WhatsApp',
        value: '+20 112 130 0234',
        href: 'https://wa.me/201121300234',
        external: true,
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M3 21l1.65-3.8a9 9 0 113.4 3.36L3 21zM9 10a.5.5 0 011 0v1a3 3 0 003 3h1a.5.5 0 010 1c-2.5 0-5-2-5-5z" />'),
      },
      {
        label: 'LinkedIn',
        value: 'linkedin.com/in/mahmoudhaggag641',
        href: 'https://linkedin.com/in/mahmoudhaggag641',
        external: true,
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />'),
      },
      {
        label: 'Phone',
        value: '+20 100 574 1071',
        href: 'tel:+201005741071',
        external: false,
        icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.7 2.793a2 2 0 01-.45 1.953l-1.27 1.27a16 16 0 006.586 6.586l1.27-1.27a2 2 0 011.953-.45l2.793.7A2 2 0 0121 18.72V21a2 2 0 01-2 2A18 18 0 013 5z" />'),
      },
    ];

    // ---------------------------------------------------------------
    // Reactive state
    // ---------------------------------------------------------------
    const projects = ref([]);
    const loadingProjects = ref(true);
    const activeFilter = ref('all');
    const selectedProject = ref(null);
    const lightboxIndex = ref(null);
    // Global language for the entire site. Defaults to English; persisted
    // across visits via localStorage. Reading projects.json content also
    // uses this same ref (selectedProject.title[lang], etc.) so the user
    // toggles once and the whole UI flips together.
    const langKey = 'site.lang.v1';
    const lang = ref('en');
    try {
      const saved = localStorage.getItem(langKey);
      if (saved === 'en' || saved === 'ar') lang.value = saved;
    } catch (e) { /* private mode — fine */ }
    function setLang(value) {
      if (value !== 'en' && value !== 'ar') return;
      lang.value = value;
      try { localStorage.setItem(langKey, value); } catch (e) {}
    }
    const scrolled = ref(false);
    const activeSection = ref('home');
    const mobileMenuOpen = ref(false);
    const year = new Date().getFullYear();

    // Animated intro overlay state. The progress bar is driven by an
    // rAF loop (introRafId) so it stays smooth and pause/resume-able if
    // we ever add that. introSeenKey is bumped if the script is edited
    // so returning visitors get the new version once.
    const introOpen = ref(false);
    const introScene = ref(0);
    const introLang = ref('en');
    const introTimerId = ref(null);
    const introRafId = ref(null);
    const introSeenKey = 'introSeen.v1';

    // ---------------------------------------------------------------
    // Computed
    // ---------------------------------------------------------------
    const filters = computed(() => {
      const all = projects.value.length;
      const web = projects.value.filter(p => p.category === 'web').length;
      const mobile = projects.value.filter(p => p.category === 'mobile').length;
      return [
        { id: 'all',    label: t.value.projects.filterAll,    count: all },
        { id: 'web',    label: t.value.projects.filterWeb,    count: web },
        { id: 'mobile', label: t.value.projects.filterMobile, count: mobile },
      ];
    });

    const filteredProjects = computed(() => {
      const list = activeFilter.value === 'all'
        ? projects.value
        : projects.value.filter(p => p.category === activeFilter.value);
      return [...list].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    });

    // ---------------------------------------------------------------
    // Methods
    // ---------------------------------------------------------------
    async function loadProjects() {
      try {
        const res = await fetch('projects.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Strip the leading slash so the site works under any base path
        // (e.g., GitHub Pages project pages serve from a sub-directory).
        const fix = (p) => (typeof p === 'string' && p.startsWith('/')) ? p.slice(1) : p;
        projects.value = data.map(p => ({
          ...p,
          cover: fix(p.cover),
          images: Array.isArray(p.images) ? p.images.map(fix) : [],
        }));
      } catch (err) {
        console.error('Failed to load projects:', err);
        projects.value = [];
      } finally {
        loadingProjects.value = false;
      }
    }

    function openProject(project) {
      selectedProject.value = project;
      document.body.classList.add('modal-open');
    }
    function closeProject() {
      selectedProject.value = null;
      lightboxIndex.value = null;
      document.body.classList.remove('modal-open');
    }
    function openLightbox(idx) { lightboxIndex.value = idx; }
    function lightboxNext() {
      if (!selectedProject.value) return;
      const len = selectedProject.value.images.length;
      lightboxIndex.value = (lightboxIndex.value + 1) % len;
    }
    function lightboxPrev() {
      if (!selectedProject.value) return;
      const len = selectedProject.value.images.length;
      lightboxIndex.value = (lightboxIndex.value - 1 + len) % len;
    }

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function onScroll() {
      scrolled.value = window.scrollY > 80;

      // Active-section detection: pick the section whose top is
      // closest above the viewport's vertical midpoint.
      const offset = window.innerHeight * 0.35;
      let current = activeSection.value;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - offset <= 0 && rect.bottom - offset > 0) {
          current = link.id;
          break;
        }
      }
      activeSection.value = current;
    }

    function onKeydown(e) {
      if (selectedProject.value && e.key === 'Escape') {
        if (lightboxIndex.value !== null) {
          lightboxIndex.value = null;
        } else {
          closeProject();
        }
      }
      if (lightboxIndex.value !== null) {
        if (e.key === 'ArrowRight') lightboxNext();
        if (e.key === 'ArrowLeft')  lightboxPrev();
      }
      // Intro overlay shortcuts
      if (introOpen.value) {
        if (e.key === 'Escape')      closeIntro();
        if (e.key === 'ArrowRight')  nextScene();
        if (e.key === 'ArrowLeft')   prevScene();
      }
    }

    // Reveal-on-scroll for any element marked .reveal (none by
    // default — included so future sections can opt in cheaply).
    let revealObserver = null;
    function setupReveal() {
      if (!('IntersectionObserver' in window)) return;
      revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        }
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }

    // ---------------------------------------------------------------
    // Animated intro
    // ---------------------------------------------------------------
    function openIntro() {
      introScene.value = 0;
      introOpen.value = true;
      document.body.classList.add('modal-open');
      // Start on next tick so the transition catches the scene 0 mount.
      setTimeout(() => startSceneTimer(), 50);
    }

    function closeIntro() {
      introOpen.value = false;
      stopSceneTimer();
      document.body.classList.remove('modal-open');
      try { localStorage.setItem(introSeenKey, '1'); } catch (e) {}
    }

    function stopSceneTimer() {
      if (introTimerId.value) { clearTimeout(introTimerId.value); introTimerId.value = null; }
      if (introRafId.value)   { cancelAnimationFrame(introRafId.value); introRafId.value = null; }
    }

    function startSceneTimer() {
      stopSceneTimer();
      const dur = introScenes[introScene.value].duration;
      introTimerId.value = setTimeout(() => {
        nextScene();
      }, dur);
    }

    function nextScene() {
      if (introScene.value < introScenes.length - 1) {
        introScene.value++;
        startSceneTimer();
      } else {
        closeIntro();
      }
    }

    function prevScene() {
      if (introScene.value > 0) {
        introScene.value--;
        startSceneTimer();
      }
    }

    function jumpToScene(i) {
      if (i < 0 || i >= introScenes.length) return;
      introScene.value = i;
      startSceneTimer();
    }

    // ---------------------------------------------------------------
    // Lifecycle
    // ---------------------------------------------------------------
    onMounted(() => {
      loadProjects();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('keydown', onKeydown);
      onScroll();
      setupReveal();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeydown);
      if (revealObserver) revealObserver.disconnect();
      stopSceneTimer();
    });

    // Re-set scroll lock when a modal closes mid-navigation.
    watch(selectedProject, (val) => {
      if (!val) document.body.classList.remove('modal-open');
    });

    // Apply language to <html lang/dir> so the whole document mirrors the
    // current selection — Tailwind's logical properties (start/end) and
    // native rendering then pick up RTL automatically.
    watch(lang, (val) => {
      document.documentElement.lang = val;
      document.documentElement.dir = val === 'ar' ? 'rtl' : 'ltr';
    }, { immediate: true });

    return {
      // data
      navLinks, skills, practices, softSkills, languageSkills, experience, otherProjects, contactLinks,
      introScenes,
      // state
      projects, loadingProjects, activeFilter, selectedProject,
      lightboxIndex, lang, scrolled, activeSection, mobileMenuOpen, year,
      introOpen, introScene,
      // computed
      filters, filteredProjects, t,
      // methods
      openProject, closeProject, openLightbox, lightboxNext, lightboxPrev, scrollToTop,
      openIntro, closeIntro, nextScene, prevScene, jumpToScene,
      setLang,
    };
  },
}).mount('#app');
