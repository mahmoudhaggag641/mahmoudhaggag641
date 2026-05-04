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
    // Featured projects — inlined here so projects.json can stay in
    // .gitignore. Edit this array directly to add / remove a project.
    // Each project has: slug, sortOrder, category (web|mobile), cover,
    // technologies[], link, images[], and bilingual title/desc/detail.
    // ---------------------------------------------------------------
    const projectsData = [
      {
        slug: "hellocallers-platform",
        sortOrder: 1,
        category: "web",
        cover: "assets/img/projects/hellocallers/cover.png",
        technologies: ["Laravel", "Vue.js", "MySQL", "Firebase", "Sphinx Search", "Paymob", "Stripe"],
        link: "https://hellocallers.com",
        images: [
          "assets/img/projects/hellocallers/img-1.png",
          "assets/img/projects/hellocallers/img-2.png",
          "assets/img/projects/hellocallers/img-3.png",
          "assets/img/projects/hellocallers/img-4.png",
          "assets/img/projects/hellocallers/img-5.png",
          "assets/img/projects/hellocallers/img-6.png",
          "assets/img/projects/hellocallers/img-7.png",
          "assets/img/projects/hellocallers/img-8.png",
        ],
        title: { ar: "منصة هالو؟ من المتصل", en: "Hello? Caller ID Platform" },
        desc:  { ar: "منصة ذكية للبحث عن الأرقام والأسماء والإيميلات مع تعريف المتصل وحماية الخصوصية",
                 en: "Smart platform for searching phone numbers, names, and emails with caller ID and privacy protection" },
        detail: {
          ar: "طورنا منصة هالو كولرز (HelloCallers) — منصة ويب متكاملة لتعريف هوية المتصل وحماية المستخدمين من المكالمات المزعجة والاحتيالية. تتيح المنصة البحث المتقدم بواسطة رقم الهاتف أو الاسم أو البريد الإلكتروني عبر محرك بحث Sphinx Search Engine للبحث اللحظي في قاعدة بيانات ضخمة. تشمل المنصة نظام تقييم وتصنيف الأرقام من قبل المستخدمين، صفحات تفصيلية لكل رقم مع تاريخ التقارير والتعليقات، ولوحة تحكم شاملة لإدارة البيانات والمستخدمين. تم دمج بوابات دفع متعددة تشمل Paymob وStripe لدعم الاشتراكات المدفوعة، مع نظام مصادقة آمن وتجربة مستخدم سلسة تدعم العربية والإنجليزية. المنصة مبنية بـ Laravel كـbackend و Vue.js كـfrontend مع قاعدة بيانات MySQL وFirebase للتحديثات اللحظية.",
          en: "We developed HelloCallers — a comprehensive web platform for caller identification and protecting users from spam and fraudulent calls. The platform enables advanced search by phone number, name, or email through Sphinx Search Engine for instant searching across a massive database. Features include a user-driven number rating and tagging system, detailed pages for each number with report history and comments, and a comprehensive admin dashboard for data and user management. Multiple payment gateways were integrated including Paymob and Stripe to support paid subscriptions, along with secure authentication and a smooth bilingual (Arabic/English) user experience. Built with Laravel backend, Vue.js frontend, MySQL database, and Firebase for real-time updates.",
        },
      },
      {
        slug: "hellocallers-mobile-app",
        sortOrder: 2,
        category: "mobile",
        cover: "assets/img/projects/hellocallers-mobile/cover.png",
        technologies: ["Android (Kotlin)", "iOS (Swift)", "Firebase Realtime DB", "Google Pay", "Apple Pay", "Push Notifications"],
        link: "https://play.google.com/store/apps/details?id=com.callerid.wie",
        images: [
          "assets/img/projects/hellocallers-mobile/img-1.jpg",
          "assets/img/projects/hellocallers-mobile/img-2.jpg",
          "assets/img/projects/hellocallers-mobile/img-3.jpg",
          "assets/img/projects/hellocallers-mobile/img-4.jpg",
          "assets/img/projects/hellocallers-mobile/img-5.jpg",
        ],
        title: { ar: "تطبيق هالو؟ من المتصل", en: "Hello? Caller ID App" },
        desc:  { ar: "تطبيق كاشف هوية المتصل والبحث بالاسم والإيميل بأكثر من 500,000 تحميل وتقييم 4.3 نجوم",
                 en: "Caller ID app with search by name and email — 500,000+ downloads and 4.3-star rating" },
        detail: {
          ar: "صممنا وطورنا تطبيق «هالو؟ من المتصل» (Hello? Caller ID) — تطبيق ذكي لتعريف هوية المتصل وحماية الخصوصية، متوفر على Android و iOS. يتيح التطبيق البحث بواسطة رقم الهاتف أو الاسم أو البريد الإلكتروني لمعرفة هوية المتصل فوراً قبل الرد، مع حماية متقدمة من المكالمات المزعجة والاحتيالية. يشمل التطبيق نظام تعريف لحظي للأرقام المجهولة، قاعدة بيانات محدّثة باستمرار من تقييمات المستخدمين، بحث عكسي عن الأرقام والأسماء والإيميلات، وإعدادات خصوصية متقدمة تمنح المستخدم تحكماً كاملاً في بياناته. حقق التطبيق أكثر من 500,000 تحميل على Google Play مع تقييم 4.3 نجوم وأكثر من 2,230 مراجعة. تم بناؤه بتقنيات native مع Firebase Realtime Database للتحديثات اللحظية ودعم Google Pay و Apple Pay لعمليات الدفع.",
          en: "We designed and developed the «Hello? Caller ID» app — a smart caller identification and privacy protection app available on Android and iOS. The app enables search by phone number, name, or email to instantly identify callers before answering, with advanced protection from spam and fraudulent calls. Features include real-time unknown number identification, a continuously updated database from user ratings, reverse lookup for numbers, names, and emails, and advanced privacy settings giving users full control over their data. The app achieved over 500,000 downloads on Google Play with a 4.3-star rating and 2,230+ reviews. Built with native technologies, Firebase Realtime Database for instant updates, and Google Pay & Apple Pay support for payments.",
        },
      },
      {
        slug: "vlaby-virtual-labs",
        sortOrder: 3,
        category: "web",
        cover: "assets/img/projects/vlaby/cover.png",
        technologies: ["Laravel", "Vue.js", "MySQL", "WebGL", "LMS Integration", "REST API", "Payment Gateway", "PayPal", "Fawry"],
        link: "https://vlaby.com",
        images: [
          "assets/img/projects/vlaby/img-1.png",
          "assets/img/projects/vlaby/img-2.png",
          "assets/img/projects/vlaby/img-3.png",
          "assets/img/projects/vlaby/img-4.png",
          "assets/img/projects/vlaby/img-5.png",
          "assets/img/projects/vlaby/img-6.png",
          "assets/img/projects/vlaby/img-7.png",
        ],
        title: { ar: "فلابي - معامل افتراضية", en: "Vlaby - Virtual Labs" },
        desc:  { ar: "منصة معامل علمية افتراضية تفاعلية بأكثر من 350 تجربة تدعم 15+ منهج دراسي و5 لغات",
                 en: "Interactive virtual science lab platform with 350+ experiments supporting 15+ curricula and 5 languages" },
        detail: {
          ar: "طورنا منصة فلابي (Vlaby) — منصة معامل افتراضية متكاملة تمكّن الطلاب من إجراء تجارب علمية تفاعلية في الكيمياء والفيزياء والأحياء والعلوم العامة عبر الإنترنت دون الحاجة لمعدات حقيقية أو التعرض لمخاطر. تضم المنصة أكثر من 350 تجربة متوافقة مع أكثر من 15 منهجاً دراسياً عربياً ودولياً (مصري، سعودي، بريطاني، أمريكي، إماراتي، كويتي، قطري، وغيرها). تدعم المنصة 5 لغات (العربية، الإنجليزية، الفرنسية، الألمانية، الإندونيسية) وتتضمن نظام Gamification بالنجوم والشارات والكؤوس لتحفيز الطلاب. تشمل المنصة لوحة تحكم للمعلمين لمتابعة تقدم الطلاب، تكامل مع أنظمة إدارة التعلم (LMS)، وضع الألعاب لتقييم المهارات، ودعم العمل أونلاين وأوفلاين. تتعاون المنصة مع أكثر من 20 مدرسة في مصر والسعودية وشركاء استراتيجيين مثل Classera.",
          en: "We developed Vlaby — a comprehensive virtual laboratory platform that enables students to conduct interactive scientific experiments in chemistry, physics, biology, and general sciences online without physical equipment or safety risks. The platform hosts over 350 experiments aligned with 15+ Arab and international curricula (Egyptian, Saudi, British, American, Emirati, Kuwaiti, Qatari, and more). It supports 5 languages (Arabic, English, French, German, Indonesian) and features a gamification system with stars, badges, and trophies to motivate students. The platform includes a teacher dashboard for tracking student progress, LMS integration, a game mode for skill assessment, and online/offline support. Vlaby partners with 20+ schools across Egypt and Saudi Arabia and strategic partners including Classera.",
        },
      },
      {
        slug: "ilearn-education-erp",
        sortOrder: 4,
        category: "web",
        cover: "assets/img/projects/ilearn/cover.png",
        technologies: ["Laravel", "Vue.js", "MySQL", "Node JS", "REST API", "Zoom SDK", "Gitsi Meet", "SMS Gateway", "Push Notifications", "GPS Tracking"],
        link: "https://ilearn.today",
        images: [
          "assets/img/projects/ilearn/img-1.png",
          "assets/img/projects/ilearn/img-2.png",
          "assets/img/projects/ilearn/img-3.png",
          "assets/img/projects/ilearn/img-4.png",
          "assets/img/projects/ilearn/img-5.png",
          "assets/img/projects/ilearn/img-6.png",
        ],
        title: { ar: "ILearn - نظام إدارة المؤسسات التعليمية", en: "ILearn - Education Management System" },
        desc:  { ar: "نظام ERP سحابي متكامل لإدارة جميع عمليات المؤسسات التعليمية من القبول حتى التخرج",
                 en: "Cloud-based ERP system for managing all educational institution operations from admission to graduation" },
        detail: {
          ar: "طورنا نظام ILearn — نظام ERP سحابي شامل لإدارة المؤسسات التعليمية يغطي كامل دورة العمل الأكاديمية والإدارية. يشمل النظام عدة وحدات متكاملة: الوحدة الأكاديمية (الكورسات، الجداول الزمنية، دفتر الدرجات، الامتحانات الإلكترونية، الحضور والغياب، تقارير التقدم، والشهادات)، الوحدة المالية (إدارة الرسوم والمدفوعات أونلاين، الفواتير، المحاسبة، الحسابات اليومية، والمشتريات والمخزون)، وحدة الموارد البشرية (بيانات الموظفين والمعلمين، الإجازات، جداول العمل، الحضور، وإدارة الرواتب)، وحدة النقل (معلومات الحافلات، المسارات، تتبع GPS المباشر، وإدارة الوقود)، ووحدة التواصل المدرسي (الرسائل، الأخبار، تكامل SMS والبريد الإلكتروني، إدارة المهام، تكامل Zoom، إدارة البوابات، الاستبيانات، وإدارة المستندات). يوفر النظام بوابات مخصصة للطلاب وأولياء الأمور والمعلمين والإدارة، مع تطبيقات جوال ولوحات تحكم تحليلية قابلة للتخصيص.",
          en: "We developed ILearn — a comprehensive cloud-based ERP system for educational institutions covering the entire academic and administrative workflow. The system includes multiple integrated modules: Academic Module (courses, timetables, gradebooks, online examinations, attendance, progress reports, and certificates), Finance Module (fee management with online payments, invoicing, accounting, daily transactions, and purchasing & inventory), HR Module (employee and teacher records, leave management, work schedules, attendance, and payroll), Transportation Module (bus information, routes, live GPS tracking, and fuel management), and School Connect Module (messaging, news, SMS & email integration, task management, Zoom integration, gate management, surveys, and document management). The system provides dedicated portals for students, parents, teachers, and administrators, with mobile apps and customizable analytics dashboards.",
        },
      },
      {
        slug: "research-dimensions",
        sortOrder: 5,
        category: "web",
        cover: "assets/img/projects/rd/cover.jpg",
        technologies: ["AI", "Machine Learning", "Data Visualization", "Laravel", "Vue.js", "MySQL", "Power BI"],
        link: "https://rd.com.sa",
        images: [
          "assets/img/projects/rd/competitive-analysis.jpg",
          "assets/img/projects/rd/supply-demand-prediction.jpg",
        ],
        title: { ar: "أبعاد — منصة أبحاث السوق", en: "Research Dimensions — Market Research Platform" },
        desc:  { ar: "أول منصة تقنية سعودية متخصصة في الدراسات والأبحاث المتقدمة باستخدام الذكاء الاصطناعي وتعلّم الآلة، لتوفير تحليلات السوق والمنافسين والأسعار عبر أكثر من 24 قطاعاً.",
                 en: "The first Saudi technical platform specialised in advanced market studies and research using AI and machine learning — delivering market, competitor, and pricing intelligence across 24+ industries." },
        detail: {
          ar: "منصة SaaS سعودية تدمج البيانات من مصادر متعددة (استطلاعات، بيانات عملاء، مواقع، سوشيال ميديا) وتبنيها في مستودع سحابي موحّد. تقدّم لوحات تحليل جاهزة لأبحاث السوق والتحليل التنافسي والتنبّؤ بالعرض والطلب، مع أدوات جمع وتنظيف بيانات آلية، ونماذج تعلّم آلة لاستخراج الرؤى، وبنية تسعير مرنة بخطط اشتراك شهرية وسنوية.",
          en: "A Saudi SaaS platform that integrates data from surveys, customer records, websites, and social channels into a unified cloud data warehouse. It ships ready-made dashboards for market research, competitive analysis, and supply/demand forecasting, backed by automated data collection & cleansing pipelines, machine-learning insight models, and flexible monthly/yearly subscription plans.",
        },
      },
      {
        slug: "return-rewards",
        sortOrder: 6,
        category: "mobile",
        cover: "assets/img/projects/return-rewards/cover.png",
        technologies: ["Ionic", "Vue.js", "Capacitor", "REST API", "Laravel", "MySQL"],
        link: "https://play.google.com/store/apps/details?id=com.rd.returnrewards",
        images: [
          "assets/img/projects/return-rewards/img-1.png",
          "assets/img/projects/return-rewards/img-2.png",
          "assets/img/projects/return-rewards/img-3.png",
          "assets/img/projects/return-rewards/img-4.png",
          "assets/img/projects/return-rewards/img-5.png",
          "assets/img/projects/return-rewards/img-6.png",
          "assets/img/projects/return-rewards/img-7.png",
          "assets/img/projects/return-rewards/img-8.png",
        ],
        title: { ar: "تطبيق Return Rewards — المكافآت والاسترداد", en: "Return Rewards — Loyalty & Cashback App" },
        desc:  { ar: "تطبيق جوال للولاء والمكافآت يسمح للمستخدمين برفع فواتير مشترياتهم للحصول على نقاط واستبدالها بعروض وهدايا من المتاجر الشريكة.",
                 en: "Loyalty and cashback mobile app that lets users upload their purchase receipts to earn reward points and redeem them for offers and gifts from partner retailers." },
        detail: {
          ar: "صممنا وطورنا تطبيق «Return Rewards» — تطبيق ولاء ومكافآت متوفر على Android و iOS مبني بتقنية Ionic مع Vue.JS و Capacitor كإطار عمل هجين. يمكّن التطبيق المستخدمين من تصوير ورفع فواتير المشتريات والفواتير الشهرية بسهولة وأمان ليحصلوا على نقاط مكافآت لكل عملية رفع يتم التحقق منها. تشمل مميزات التطبيق: نظام مهام وتحديات لكسب نقاط إضافية، شبكة واسعة من العلامات التجارية الشريكة لاستبدال النقاط، محفظة نقاط شخصية مع متابعة التقدّم، وسوق مكافآت يضم بطاقات هدايا ومنتجات وتجارب حصرية، مع تشفير للبيانات وتجربة استخدام بسيطة تدعم العربية والإنجليزية.",
          en: "We designed and developed the «Return Rewards» app — a loyalty and cashback mobile app available on Android and iOS, built with Ionic + Vue.JS + Capacitor as a hybrid framework. The app enables users to capture and securely submit purchase receipts and monthly bills, earning reward points for every verified upload. Features include a missions & challenges system for bonus points, a wide network of partner retailers for point redemption, a personal points wallet with progress tracking, and a rewards marketplace featuring gift cards, merchandise, and exclusive experiences — all backed by data encryption and a bilingual (Arabic/English) experience.",
        },
      },
      {
        slug: "tours-booking-platform",
        sortOrder: 7,
        category: "web",
        cover: "assets/img/projects/tours-booking/cover.jpg",
        technologies: ["Laravel", "Vue.js", "MySQL", "Payment Gateway", "REST API", "Multi-currency", "TripAdvisor Integration"],
        link: "http://sharmexcursions-experts.com",
        images: [
          "assets/img/projects/tours-booking/img-1.jpg",
          "assets/img/projects/tours-booking/img-2.jpg",
          "assets/img/projects/tours-booking/img-3.jpg",
          "assets/img/projects/tours-booking/img-4.jpg",
          "assets/img/projects/tours-booking/img-5.jpg",
        ],
        title: { ar: "منصة حجز الرحلات السياحية — Sharm Excursions Experts", en: "Tours Booking Platform — Sharm Excursions Experts" },
        desc:  { ar: "منصة حجز رحلات سياحية متكاملة تشمل جولات المغامرات ورحلات القاهرة والأقصر وعروض البدو وخدمات النقل من وإلى المطار، مع سلة حجز ودفع آمن متعدد العملات.",
                 en: "A comprehensive tours booking platform covering adventure tours, Cairo/Luxor excursions, Bedouin shows, and airport transfers — with a booking cart and secure multi-currency payment." },
        detail: {
          ar: "طورنا منصة «Sharm Excursions Experts» — منصة حجز رحلات سياحية متكاملة، تغطي مختلف أنواع الرحلات من مغامرات صحراوية وغوص ورحلات ثقافية إلى القاهرة والأقصر وبتراء، وعروض عشاء بدوية، وخدمات النقل من وإلى مطار شرم الشيخ. تشمل المنصة كتالوج رحلات قابل للتصفية حسب النوع والمدة والسعر، سلة حجز بنظام دفع عربون (10%)، بوابة دفع آمنة متعددة العملات (USD / GBP / EGP)، إصدار vouchers إلكترونية تلقائياً بعد تأكيد الحجز، لوحة تحكم إدارية لإدارة الرحلات والباقات والأسعار والحجوزات، سياسة تعديل مرنة للحجوزات، وقسم مراجعات العملاء مع تكامل TripAdvisor. مبنية بـ Laravel للـ backend و Vue.js للـ frontend و MySQL كقاعدة بيانات.",
          en: "We developed 'Sharm Excursions Experts' — a full tour booking platform, covering a wide range of experiences from desert adventures, diving, and cultural day trips to Cairo, Luxor, and Petra, through Bedouin dinner shows and airport transfers from/to Sharm El Sheikh airport. The platform features a filterable tours catalog (by type, duration, price), a booking cart with deposit-based payment (10%), a secure multi-currency payment gateway (USD/GBP/EGP), automatic electronic voucher issuance after confirmation, an admin dashboard for managing tours, packages, pricing and bookings, flexible amendment policies, and a customer reviews section with TripAdvisor integration. Built with Laravel backend, Vue.js frontend, and MySQL database.",
        },
      },
      {
        slug: "almusaed-logistics-platform",
        sortOrder: 8,
        category: "web",
        cover: "assets/img/projects/almusaed/cover.png",
        technologies: ["Laravel", "Vue.js", "MySQL", "Payment Gateway", "PayPal"],
        link: "https://almusaed.net",
        images: [
          "assets/img/projects/almusaed/img-1.png",
          "assets/img/projects/almusaed/img-2.png",
          "assets/img/projects/almusaed/img-3.png",
          "assets/img/projects/almusaed/img-4.jpg",
          "assets/img/projects/almusaed/img-5.jpg",
          "assets/img/projects/almusaed/img-6.jpg",
          "assets/img/projects/almusaed/img-7.jpg",
          "assets/img/projects/almusaed/img-8.jpg",
          "assets/img/projects/almusaed/img-9.jpg",
          "assets/img/projects/almusaed/img-10.jpg",
        ],
        title: { ar: "المساعد — منصة الخدمات اللوجستية", en: "Almusaed — Logistics Services Platform" },
        desc:  { ar: "منصة متعددة الأطراف تربط مقدّمي الخدمات اللوجستية (شحن، تخزين، خدمات عامة) بطالبي الخدمة عبر الويب والموبايل، مع نظام عروض وتفاوض ودفع ومحفظة وتقييمات.",
                 en: "A two-sided marketplace connecting logistics service providers (shipping, storage, general services) with customers through web and mobile — with bidding, negotiation chat, payments, in-app wallet, and ratings." },
        detail: {
          ar: "طورنا منصة «المساعد» (Almusaed) — منصة سعودية متعددة الأطراف للخدمات اللوجستية تربط مقدمي الخدمة بطالبيها عبر موقع ويب وتطبيق موبايل. يدعم النظام تسجيلاً متدرّجاً لمقدمي الخدمة (أفراد أو شركات) مع تفعيل الرقم برسالة SMS، وتصنيف خدماتهم ضمن ثلاثة محاور رئيسية: (١) الشحن الأمامي بفروعه الثلاثة — شحن ثقيل (بري/بحري/جوي) مع تفاصيل مركباته (قطارات، عربات نقل كبيرة، نقل عادية، نصف نقل، ربع نقل، ...) وخدمات البريد وخدمات التوصيل؛ ولكل مركبة ملف كامل يضم رقم وصورة الرخصة، صور المركبة من كل الاتجاهات، صور لوحة الأرقام من الأمام والخلف، الماركة والموديل، والمميزات (تبريد، مقطورة، ...). (٢) التخزين بمواصفات مفصّلة (المساحة، العنوان، مكافحة الحرائق، التبريد، التحميل والتفريغ). (٣) الخدمات العامة (التحميل والمناولة، نقل الأثاث، الخدمات الإلكترونية، تأجير المعدات، ...). آلية طلب الخدمة تدعم مسارين: تصفّح العروض والتفاوض المباشر عبر شات ثم إرسال طلب خاص، أو نشر طلب عام يُشعَر به كل مقدمي الخدمات في الفئة ليقدّموا عروضهم. يشمل النظام بوابات دفع متعددة، محفظة إلكترونية، نظام تقييم بعقوبات نقاط سلبية عند الإلغاء غير المبرّر مع تدخّل إداري عند الحاجة، إشعارات فورية عبر الويب والموبايل، ولوحة تحكم إدارية قابلة للتوسع تتيح إضافة أنواع مركبات وفئات جديدة بمميزاتها وأيقوناتها، بالإضافة إلى واجهات تعرض الأكثر طلباً والأعلى تقييماً خلال الشهر.",
          en: "We developed 'Almusaed' — a Saudi multi-sided logistics marketplace that connects service providers with customers through a web platform and mobile app. The system supports phased provider onboarding (individuals or companies) with SMS phone verification, and organises services across three pillars: (1) Forward shipping with three branches — heavy shipping (land/sea/air) with detailed vehicle subtypes (trains, large trucks, regular trucks, half-trucks, quarter-trucks, …), mail services, and delivery services — where each vehicle carries a full profile (license number & image, vehicle photos from all angles, front/back plate photos, make and model, and feature flags such as cooling or trailer support). (2) Storage with detailed specs (area, address, fire suppression, cooling, loading & unloading). (3) General services (loading & handling, furniture moving, online services, equipment rental, …). The order flow supports two paths: browse offers and negotiate via direct chat then send a targeted request, or post a public request that notifies every provider in the matching category to submit their bids. The platform includes multiple payment gateways, an in-app wallet, a reputation system with penalty points for unjustified cancellations and admin mediation when needed, real-time notifications across web and mobile, an extensible admin dashboard that allows adding new vehicle types and categories with their icons and features, plus monthly highlights of the most-requested and top-rated providers.",
        },
      },
      {
        slug: "imc-mosquito-control",
        sortOrder: 9,
        category: "mobile",
        cover: "assets/img/projects/imc/cover.png",
        technologies: ["Laravel", "Vue.js", "MySQL", "Google Maps API", "Flutter", "REST API", "GPS"],
        link: "https://imcjed.com",
        images: [],
        title: { ar: "IMC — نظام معلومات مشاريع المكافحة المتكاملة للبعوض", en: "IMC — Integrated Mosquito Control Information System" },
        desc:  { ar: "نظام معلومات متكامل لأمانة جدة لإدارة مشاريع المكافحة المتكاملة للبعوض داخل وخارج المنازل، يضم لوحة تحكم ويب مدعومة بنظم المعلومات الجغرافية وتطبيق موبايل Native للعمل الميداني.",
                 en: "A comprehensive information system for Amanat Jeddah (Jeddah Municipality) to manage integrated indoor/outdoor mosquito control projects — combining a GIS-powered web admin dashboard with a native mobile app for field teams." },
        detail: {
          ar: "طوّرنا لصالح أمانة جدة نظام IMC — نظام معلومات متكامل لإدارة ومتابعة وتقييم مشاريع المكافحة المتكاملة للبعوض داخل وخارج المنازل عبر القطاعات الأوسط والجنوبي والشمالي بمدينة جدة، بهدف السيطرة على بؤر حمى الضنك. يتكوّن النظام من ثلاث طبقات متكاملة: (١) قاعدة بيانات MySQL مركزية تستوعب كل بيانات المشروع الأساسية والتشغيلية. (٢) لوحة تحكم ويب مبنية بـ Laravel + Vue.js مع تكامل Google Maps لنظم المعلومات الجغرافية — تتيح تحديد مناطق عمل الفرق، تصدير التقارير، وعرض لوحة معلومات نقطية على الخريطة. (٣) تطبيق موبايل Flutter (Android/iOS) للعمل الميداني يستخدم GPS لتحديد المواقع، يحتوي كل النماذج الميدانية، ويوثّق الإجراءات بصور من الكاميرا مع تزامن آني مع السيرفر. يدعم النظام واجهة ثنائية اللغة (عربي/إنجليزي)، صلاحيات متعددة المستويات لثمانية أدوار (مدير المشروع، نائبه، استشاري، أخصائي حيوي، وحدة GIS، مدير العمليات، أخصائي مكافحة، رئيس فرقة)، وهرم جغرافي من خمسة مستويات (المملكة → المنطقة → المدينة → البلدية → الحي → المربع). يشمل النظام إدارة المصائد بالباركود، إدارة المهام (تركيب/فك المصائد، زيارة موقع، فحص)، أنواع الأعمال (عام، مصائد، فحص)، تصنيفات المواقع (مسجد، فيلا، شقة، مبنى تحت الإنشاء، مدرسة، متنزه، ...)، وأنواع المعدات (ULV، الضباب، الاسطوانة، سيارات الرش الفراغي، الرذاذ). كذلك تقارير عمليات ميدانية وتحليلية شاملة (خطة الزيارات اليومية، الوحدات الممسوحة، تفاصيل المكافحة، الزيارات غير الناجحة، نتائج البؤر، نسب الإنجاز لكل فرد/مجموعة/حي/بلدية/قطاع) قابلة للتصدير كـ Excel والعرض على خرائط جغرافية تظهر لكل مربع اسم المالك، رقم الهاتف، وجود بعوض أو بؤر، وعدد الإصابات.",
          en: "We developed IMC for Amanat Jeddah (Jeddah Municipality) — a comprehensive information system to manage, track, and evaluate Integrated Mosquito Control projects (indoor & outdoor) across Jeddah's central, southern, and northern sectors, targeting dengue-fever outbreak zones. The system is built in three layers: (1) A central MySQL database holding all core and operational data. (2) A Laravel + Vue.js web admin dashboard integrated with Google Maps for the GIS layer — used to assign field zones, export reports, and render a point-data dashboard over the map. (3) A flutter mobile app (Android/iOS) for field teams that uses GPS for positioning, carries every field form, and documents actions with camera photos synced in real time with the backend. The system ships with a bilingual UI (Arabic/English), multi-level permissions across eight roles (Project Manager, Deputy, Consultant, Biological Specialist, GIS Unit, Operations Manager, Control Specialist, Team Leader), and a 5-level geographic hierarchy (Kingdom → Region → City → Municipality → Neighborhood → Block). It includes barcode-based trap management, task management (install/remove traps, site visits, inspections), work types (general, trap, inspection), location types (mosque, villa, apartment, under-construction, school, park, …), and equipment types (ULV, fog, cylinder, space-spray vehicles, mist). Comprehensive field and analytical reporting covers daily visit plans, surveyed unit counts, control details, unsuccessful-visit reports (no one on site / no mahram / owner refusal), outbreak outcomes, and completion-rate reports at individual/team/sub-neighborhood/municipality/sector levels — all exportable to Excel and visualized on geographic maps showing per-block data (owner name, phone, mosquito/focus presence, case counts).",
        },
      },
    ];

    // ---------------------------------------------------------------
    // Reactive state
    // ---------------------------------------------------------------
    const projects = ref(projectsData);
    const loadingProjects = ref(false);
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
      for (const link of navLinks.value) {
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
