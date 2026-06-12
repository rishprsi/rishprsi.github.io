/* ============================================================
   PORTFOLIO DATA — edit this file, nothing else.
   - Projects live in PROJECT_GROUPS, organised by domain.
     The FIRST project in each group's `projects` array is the
     flagship shown on the card; the rest appear when the group
     is expanded. `anim` picks an animation from
     js/animations.js (see registry at the top of that file).
   - Swap skills: edit SKILLS.
   - Everything renders automatically from these objects.
   ============================================================ */

const SITE = {
  name: "Rishabh Pratap Singh",
  brand: "rishabh.singh",
  tagline: "I build distributed runtimes, backend systems, and the occasional asteroid field.",
  subline: "MS Computer Science @ University of Washington · Research Assistant on MASS C++ · GPA 4.0",
  bootLine: "$ MASS::init(hosts=24) ............ cluster online",
  heroNote: "// personal note: lately obsessed with low-level programming — memory management in C, a bit of Zig on the side.",
  email: "rishprsi@gmail.com",
  github: "https://github.com/rishprsi",
  linkedin: "https://www.linkedin.com/in/rishprsi/",
  resume: "Rishabh_Resume.pdf", // drop your resume PDF next to index.html with this name
  contactBlurb:
    "I'm looking to collaborate on open-source systems work and learn from people more experienced than me. If you're building something low-level, distributed, or just plain interesting — say hi.",
  contactNote: "// response latency: usually < 24h. No barrier synchronization required.",
  footer: "designed & built by rishabh · no frameworks, no build step · hosted on github pages",
};

const ABOUT_PARAGRAPHS = [
  "I'm a master's student at the University of Washington working on <strong>MASS C++</strong> — a parallel computing library for agent-based simulation on distributed-memory clusters. My thesis extends it toward a general-purpose runtime: modern lambda dispatch, asynchronous compound execution, and a full graph-computing stack.",
  "Before grad school I spent ~4 years as a data engineer / full-stack developer (Wipro on the Blackstone account, and Infosys), shipping finance dashboards, rule engines, and event-driven microservices. Now I live closer to the metal: C++, CUDA, MPI, and the joy of profiling things until they stop embarrassing me.",
  "Most of the projects below started as learning exercises and got out of hand — which, honestly, is my favorite way to learn.",
];

const BOOKS = [
  "The Pragmatic Programmer",
  "Advanced Programming in the UNIX Environment",
  "Competitive Programmer's Handbook",
];

const CERTS = [
  "Boot.dev Backend Developer Path — Archmage rank (Go, HTTP, crypto)",
  "Algorithmic Toolbox — UC San Diego",
];

const SKILLS = [
  { group: "Languages", items: ["C++", "Go", "Python", "Zig", "TypeScript", "SQL"] },
  { group: "ML & HPC", items: ["CUDA", "MPI", "OpenMP", "PyTorch", "Nsight", "RAG", "OpenCV"] },
  { group: "Technologies", items: ["ReactJS", "FastAPI", "Spring", "AWS", "Terraform", "PostgreSQL", "Snowflake", "REST APIs"] },
];

const THESIS = {
  title: "Feature Extension of MASS C++ towards a General-Purpose Library",
  institution: "University of Washington · MS Thesis · 2026",
  anim: "agents",
  summary:
    "MASS C++ runs agent-based simulations on distributed-memory clusters using a master–worker BSP model. My thesis removes three structural limits while staying 100% backward compatible — legacy simulations recompile and run unchanged.",
  contributions: [
    {
      title: "Three-Tier Lambda Dispatch",
      body: "Replaced hand-numbered integer dispatch with string-named methods, header lambdas, and JIT-compiled lambdas behind one registry. Cut user code by 20–34% across benchmarks.",
    },
    {
      title: "Compound Execution",
      body: "A phase-pipeline builder + async handle executor collapses K×N master round-trips per simulation into a single dispatch — workers advance through BSP phases autonomously.",
    },
    {
      title: "Distributed Graph Stack",
      body: "GraphTopology, GraphPlaces & GraphAgents: locality-aware edge-cut partitioning, edge-constrained agent migration, Pregel-style combiners/aggregators, pluggable parsers.",
    },
  ],
  stats: [
    { value: "24", label: "node cluster" },
    { value: "+20%", label: "graph throughput" },
    { value: "20–34%", label: "less user code" },
    { value: "O(1)", label: "master dispatches / iteration" },
  ],
  note: "// the fun part: watching barrier round-trips drop by orders of magnitude on Wave2D never got old.",
};

/* anim keys: agents, nbody, search, encrypt, http, upload, chirps,
   rss, pokeball, asteroids, markdown, crawler, agentloop, memgraph, wordcount */
const PROJECT_GROUPS = [
  {
    domain: "HPC & Low-Level Systems",
    blurb: "Parallel algorithms on GPUs, cryptography, and protocols rebuilt from raw bytes — understanding the machine, not just the API.",
    expertise: ["C++", "CUDA", "Go", "TCP", "Web Crypto"],
    projects: [
      {
        name: "N-Body Simulation",
        tag: "HPC / CUDA",
        anim: "nbody",
        desc: "Three gravitational N-body solvers — direct summation O(n²), Barnes-Hut O(n log n), and Fast Multipole O(n) — with configurable scenarios and a benchmarking harness to race them against each other.",
        tech: ["C++", "CUDA", "OpenCV", "CMake"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// watching FMM lap direct summation at n=100k is deeply satisfying.",
      },
      {
        name: "MyOwnHTTP",
        tag: "protocols from scratch",
        anim: "http",
        desc: "An HTTP/1.1 server built from raw TCP sockets in Go — hand-rolled request parsing, header handling, chunked transfer encoding, and binary streaming. No net/http allowed.",
        tech: ["Go", "TCP", "HTTP/1.1"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// you never really know HTTP until you've parsed it byte by byte.",
      },
      {
        name: "Simple Encrypt",
        tag: "security · live site",
        anim: "encrypt",
        desc: "Zero-backend encryptor for text and files: AES-256-GCM via the Web Crypto API, optional expiry metadata, runs entirely in your browser. Also ships a Go terminal version. Deployed on GitHub Pages.",
        tech: ["JavaScript", "Web Crypto", "AES-256-GCM", "Go"],
        links: [
          { label: "live demo", url: "https://rishprsi.github.io/Simple_Encrypt/" },
          { label: "github", url: "https://github.com/rishprsi/Simple_Encrypt" },
        ],
        note: "// born from refusing to upload a private file to a random website.",
      },
    ],
  },
  {
    domain: "AI, Agents & Retrieval",
    blurb: "LLM memory architectures, full information-retrieval pipelines, and tool-calling loops — built layer by layer instead of importing the magic.",
    expertise: ["Python", "RAG", "Embeddings", "Gemini", "CLIP"],
    projects: [
      {
        name: "Memory Graph",
        tag: "LLM infrastructure",
        anim: "memgraph",
        desc: "Hierarchical graph memory for LLM agents: semantic + temporal edges with PageRank-style importance weighting, nested subgraph summarization to cut context tokens, and a semantic response cache with staleness expiry.",
        tech: ["Python", "Graphs", "LLM", "Embeddings"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// agents forget things. This one holds a grudge — efficiently.",
      },
      {
        name: "SearchBot",
        tag: "information retrieval",
        anim: "search",
        desc: "A full IR pipeline over a movie catalog: BM25 keyword search, dense semantic search, hybrid Reciprocal Rank Fusion, LLM query enhancement & reranking, RAG answers with citations, and CLIP-powered image search — plus precision/recall evaluation.",
        tech: ["Python", "sentence-transformers", "Gemini", "CLIP", "BM25"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// built every layer myself before trusting a vector DB to do it.",
      },
      {
        name: "BuggyAIAgent",
        tag: "LLM agents",
        anim: "agentloop",
        desc: "A minimal LLM coding agent: Gemini function-calling loop that can list files, read code, run Python, and write fixes — a tiny version of the tools I now use daily.",
        tech: ["Python", "Gemini", "function calling"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// I built a small agent so I'd stop being surprised by the big ones.",
      },
    ],
  },
  {
    domain: "Backend & Cloud",
    blurb: "Production-shaped Go services: auth, object storage, media pipelines, and databases that don't fall over.",
    expertise: ["Go", "PostgreSQL", "AWS", "JWT", "ffmpeg"],
    projects: [
      {
        name: "Tubely",
        tag: "media pipeline",
        anim: "upload",
        desc: "A video upload platform: ffmpeg processing for aspect ratios and fast-start encoding, S3 storage, CloudFront delivery, and presigned URLs — the whole life of a video from upload to playback.",
        tech: ["Go", "AWS S3", "CloudFront", "ffmpeg", "SQLite"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// ffmpeg flags are a language. I speak a dialect now.",
      },
      {
        name: "Chirpy",
        tag: "backend API",
        anim: "chirps",
        desc: "A microblog API server with JWT access + refresh token auth, webhook handling, and a PostgreSQL data layer — REST endpoints written against Go's standard library.",
        tech: ["Go", "PostgreSQL", "JWT", "REST"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// auth is 10% crypto and 90% being paranoid in the right places.",
      },
      {
        name: "Blog Aggregator",
        tag: "CLI + database",
        anim: "rss",
        desc: "A CLI RSS aggregator: follow feeds, fetch posts on an interval, and browse them — backed by PostgreSQL with type-safe queries generated by sqlc.",
        tech: ["Go", "PostgreSQL", "sqlc", "RSS"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// my RSS reader doesn't track me, because it can't.",
      },
      {
        name: "Pokedex CLI",
        tag: "API client",
        anim: "pokeball",
        desc: "A REPL pokedex over the PokeAPI with an in-memory time-expiring cache, exploration commands, and catch mechanics based on base experience.",
        tech: ["Go", "REST", "caching"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// the cache layer outlived the game. Lesson learned.",
      },
    ],
  },
  {
    domain: "Foundations & Play",
    blurb: "Parsers, concurrency, and game loops — built to understand the fundamentals, kept because they're fun.",
    expertise: ["Python", "asyncio", "parsing", "pygame"],
    projects: [
      {
        name: "Static Site Generator",
        tag: "parsers",
        anim: "markdown",
        desc: "A markdown-to-HTML static site generator: inline + block parsing into an HTMLNode tree, recursive directory builds, and templating — the same idea powering this very page's spirit.",
        tech: ["Python", "Markdown", "parsing"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// parsers humble you. Nested delimiters humble you twice.",
      },
      {
        name: "Web Crawler",
        tag: "concurrency",
        anim: "crawler",
        desc: "An async website crawler that maps internal link graphs with URL normalization, concurrency limits, and per-page link extraction.",
        tech: ["Python", "asyncio", "aiohttp"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// BFS over the web — politely, with a semaphore.",
      },
      {
        name: "Asteroids",
        tag: "game dev",
        anim: "asteroids",
        desc: "Classic asteroids with a proper game loop: delta-time movement, circle collision, asteroid splitting, and sprite groups in pygame.",
        tech: ["Python", "pygame"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// shipped the same week I learned what a game loop was.",
      },
      {
        name: "BookBot",
        tag: "first project",
        anim: "wordcount",
        desc: "A text analyzer that reports word counts and character frequencies from classic novels. Small, but it's where the streak started.",
        tech: ["Python"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// every cluster starts with a single node.",
      },
    ],
  },
];

const PROJECTS_INTRO =
  "Four mission groups, each led by its flagship build. Open a group's full log to see everything in it — every project has its own system animation.";

const EXPERIENCE = [
  {
    role: "Research Assistant",
    org: "University of Washington",
    when: "Sep 2025 — present",
    points: [
      "Extending MASS C++/CUDA with functional programming primitives, asynchronous inter-node computation, and graph-based computation on a cluster.",
      "Designed & benchmarked BFS and PageRank under multiple partitioning strategies — +20% throughput on a 24-node cluster.",
    ],
  },
  {
    role: "Data Engineer / Full-Stack Developer",
    org: "Wipro · Blackstone account",
    when: "Mar 2022 — Sep 2024",
    points: [
      "Led development of a Cash Flow Dashboard (React + FastAPI) for settlement tracking, used daily by finance teams.",
      "Built user-customizable data-warehouse integrations saving 50+ person-hours weekly; rule engine for automated reports saved 20+ more.",
      "Engineered a full audit-history change tracker and deployed a private DLT architecture for financial logging.",
    ],
  },
  {
    role: "Digital Specialist Engineer",
    org: "Infosys Ltd.",
    when: "Feb 2021 — Mar 2022",
    points: [
      "Built full-stack features and RESTful APIs, integrating microservices with AWS Lambda via event-driven architecture.",
      "Developed dynamic integrations with third-party payment and shipping services.",
    ],
  },
];

const NAV = [
  { label: "crew", href: "#about" },
  { label: "research", href: "#thesis" },
  { label: "missions", href: "#projects" },
  { label: "record", href: "#experience" },
  { label: "contact", href: "#contact" },
];
