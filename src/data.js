/* ============================================================
   PORTFOLIO DATA - edit this file, nothing else.
   - Projects live in PROJECT_GROUPS, organised by domain.
     The FIRST project in each group's `projects` array is the
     flagship shown on the card; the rest appear when the group
     is expanded. `anim` picks an animation from
     public/js/animations.js (see registry at the top of that file).
   - Swap skills: edit SKILLS.
   - The Astro components render everything from these objects at
     build time, so the page is real HTML (good for SEO / link previews).
   ============================================================ */

export const SITE = {
  name: "Rishabh Pratap Singh",
  brand: "R.S",
  tagline:
    "I build distributed runtimes, backend systems, and the occasional asteroid field.",
  subline:
    "MS Computer Science @ University of Washington · Research Assistant on MASS C++ · GPA 4.0",
  bootLine: "$ MASS::init(hosts=24) ............ cluster online",
  heroNote:
    "// personal note: lately I can't stop thinking about low-level programming. Memory management in C, a bit of Zig on the side.",
  // SEO / link-preview copy
  description:
    "Portfolio of Rishabh Pratap Singh: distributed systems, HPC, and backend engineering. MS CS at the University of Washington, building the MASS C++ parallel runtime.",
  email: "rishprsi@gmail.com",
  github: "https://github.com/rishprsi",
  linkedin: "https://www.linkedin.com/in/rishprsi/",
  resume: "Rishabh_Resume.pdf", // lives in /public; update the file there to refresh it
  contactBlurb:
    "I'd love to collaborate on open-source systems work and learn from people who've been at it longer than me. If you're building something low-level, distributed, or just plain interesting, say hi.",
  contactNote:
    "// response latency: usually < 24h. No barrier synchronization required.",
  footer: "By Rishabh · Astro · Github Pages",
};

export const ABOUT_PARAGRAPHS = [
  "I'm a master's student at the University of Washington, working on <strong>MASS C++</strong>, a parallel computing library for agent-based simulation on distributed-memory clusters. My thesis is pushing it toward a general-purpose runtime, with modern lambda dispatch, asynchronous compound execution, and a full graph-computing stack.",
  "Before grad school I spent about four years as a data engineer and full-stack developer (Wipro on the Blackstone account, then Infosys), shipping finance dashboards, rule engines, and event-driven microservices. These days I work a lot closer to the metal: C++, CUDA, MPI, and the quiet joy of profiling something until it stops embarrassing me.",
  "Most of the projects below started as learning exercises that got a little out of hand, which, honestly, is my favorite way to learn.",
];

export const BOOKS = [
  "The Pragmatic Programmer",
  "Advanced Programming in the UNIX Environment",
  "Competitive Programmer's Handbook",
];

export const CERTS = [
  "Boot.dev Backend Developer Path, Archmage rank (Go, HTTP, crypto)",
  "Algorithmic Toolbox, UC San Diego",
];

export const SKILLS = [
  {
    group: "Languages",
    items: ["C++", "Go", "Python", "Zig", "TypeScript", "SQL"],
  },
  {
    group: "ML & HPC",
    items: ["CUDA", "MPI", "OpenMP", "PyTorch", "Nsight", "RAG", "OpenCV"],
  },
  {
    group: "Technologies",
    items: [
      "ReactJS",
      "FastAPI",
      "Spring",
      "AWS",
      "Terraform",
      "PostgreSQL",
      "Snowflake",
      "REST APIs",
    ],
  },
];

export const THESIS = {
  title: "Feature Extension of MASS C++ towards a General-Purpose Library",
  institution: "University of Washington · MS Thesis · 2026",
  anim: "agents",
  summary:
    "MASS C++ runs agent-based simulations on distributed-memory clusters using a master-worker BSP model. My thesis removes three structural limits while staying fully backward compatible, so existing simulations recompile and run unchanged.",
  contributions: [
    {
      title: "Three-Tier Lambda Dispatch",
      body: "Replaced hand-numbered integer dispatch with string-named methods, header lambdas, and JIT-compiled lambdas behind one registry. That cut user code by 20 to 34% across the benchmarks.",
    },
    {
      title: "Compound Execution",
      body: "A phase-pipeline builder plus an async handle executor collapses K×N master round-trips per simulation into a single dispatch, so workers advance through BSP phases on their own.",
    },
    {
      title: "Distributed Graph Stack",
      body: "GraphTopology, GraphPlaces, and GraphAgents: locality-aware edge-cut partitioning, edge-constrained agent migration, Pregel-style combiners and aggregators, and pluggable parsers.",
    },
  ],
  stats: [
    { value: "24", label: "node cluster" },
    { value: "+20%", label: "graph throughput" },
    { value: "20-34%", label: "less user code" },
    { value: "O(1)", label: "master dispatches / iteration" },
  ],
  note: "// the fun part: watching barrier round-trips drop by orders of magnitude on Wave2D never got old.",
};

/* anim keys: agents, nbody, search, encrypt, http, upload, chirps,
   rss, pokeball, asteroids, markdown, crawler, agentloop, memgraph, wordcount */
export const PROJECT_GROUPS = [
  {
    domain: "HPC & Low-Level Systems",
    blurb:
      "Parallel algorithms on GPUs, cryptography, and protocols rebuilt from raw bytes. The goal here was to learn the machine, not just the API.",
    expertise: ["C++", "CUDA", "Go", "TCP", "Web Crypto"],
    projects: [
      {
        name: "N-Body Simulation",
        tag: "HPC / CUDA",
        anim: "nbody",
        desc: "Three gravitational N-body solvers: direct summation O(n²), Barnes-Hut O(n log n), and Fast Multipole O(n). It comes with configurable scenarios and a benchmarking harness so you can race them against each other.",
        tech: ["C++", "CUDA", "OpenCV", "CMake"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// watching FMM lap direct summation at n=100k is deeply satisfying.",
      },
      {
        name: "MyOwnHTTP",
        tag: "protocols from scratch",
        anim: "http",
        desc: "An HTTP/1.1 server built from raw TCP sockets in Go: hand-rolled request parsing, header handling, chunked transfer encoding, and binary streaming. No net/http allowed.",
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
          {
            label: "live demo",
            url: "https://rishprsi.github.io/Simple_Encrypt/",
          },
          {
            label: "github",
            url: "https://github.com/rishprsi/Simple_Encrypt",
          },
        ],
        note: "// born from refusing to upload a private file to a random website.",
      },
    ],
  },
  {
    domain: "AI, Agents & Retrieval",
    blurb:
      "LLM memory architectures, full information-retrieval pipelines, and tool-calling loops, built layer by layer instead of importing the magic.",
    expertise: ["Python", "RAG", "Embeddings", "Gemini", "CLIP"],
    projects: [
      {
        name: "Memory Graph",
        tag: "LLM infrastructure",
        anim: "memgraph",
        desc: "Hierarchical graph memory for LLM agents: semantic and temporal edges with PageRank-style importance weighting, nested subgraph summarization to cut context tokens, and a semantic response cache with staleness expiry.",
        tech: ["Python", "Graphs", "LLM", "Embeddings"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// agents forget things. This one holds a grudge, efficiently.",
      },
      {
        name: "SearchBot",
        tag: "information retrieval",
        anim: "search",
        desc: "A full IR pipeline over a movie catalog: BM25 keyword search, dense semantic search, hybrid Reciprocal Rank Fusion, LLM query enhancement and reranking, RAG answers with citations, and CLIP-powered image search, plus precision and recall evaluation.",
        tech: ["Python", "sentence-transformers", "Gemini", "CLIP", "BM25"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// built every layer myself before trusting a vector DB to do it.",
      },
      {
        name: "BuggyAIAgent",
        tag: "LLM agents",
        anim: "agentloop",
        desc: "A minimal LLM coding agent: a Gemini function-calling loop that can list files, read code, run Python, and write fixes. A tiny version of the tools I now use every day.",
        tech: ["Python", "Gemini", "function calling"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// I built a small agent so I'd stop being surprised by the big ones.",
      },
    ],
  },
  {
    domain: "Backend & Cloud",
    blurb:
      "Production-shaped Go services: auth, object storage, media pipelines, and databases that don't fall over.",
    expertise: ["Go", "PostgreSQL", "AWS", "JWT", "ffmpeg"],
    projects: [
      {
        name: "Tubely",
        tag: "media pipeline",
        anim: "upload",
        desc: "A video upload platform: ffmpeg processing for aspect ratios and fast-start encoding, S3 storage, CloudFront delivery, and presigned URLs. The whole life of a video, from upload to playback.",
        tech: ["Go", "AWS S3", "CloudFront", "ffmpeg", "SQLite"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// ffmpeg flags are a language. I speak a dialect now.",
      },
      {
        name: "Chirpy",
        tag: "backend API",
        anim: "chirps",
        desc: "A microblog API server with JWT access and refresh token auth, webhook handling, and a PostgreSQL data layer. The REST endpoints are written against Go's standard library.",
        tech: ["Go", "PostgreSQL", "JWT", "REST"],
        links: [{ label: "github", url: "https://github.com/rishprsi" }],
        note: "// auth is 10% crypto and 90% being paranoid in the right places.",
      },
      {
        name: "Blog Aggregator",
        tag: "CLI + database",
        anim: "rss",
        desc: "A CLI RSS aggregator: follow feeds, fetch posts on an interval, and browse them, all backed by PostgreSQL with type-safe queries generated by sqlc.",
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
    blurb:
      "Parsers, concurrency, and game loops, built to learn the fundamentals and kept around because they're fun.",
    expertise: ["Python", "asyncio", "parsing", "pygame"],
    projects: [
      {
        name: "Static Site Generator",
        tag: "parsers",
        anim: "markdown",
        desc: "A markdown-to-HTML static site generator: inline and block parsing into an HTMLNode tree, recursive directory builds, and templating. It's the same idea that powers this page's spirit.",
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
        note: "// BFS over the web, politely, with a semaphore.",
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

export const PROJECTS_INTRO =
  "Four groups, each led by its flagship build. Open a group's full log to see everything inside, and every project has its own little system animation.";

export const EXPERIENCE = [
  {
    role: "Research Assistant",
    org: "University of Washington",
    when: "Sep 2025 to now",
    points: [
      "Extending MASS C++/CUDA with functional programming primitives, asynchronous inter-node computation, and graph-based computation on a cluster.",
      "Designed and benchmarked BFS and PageRank under multiple partitioning strategies, landing a 20% throughput gain on a 24-node cluster.",
    ],
  },
  {
    role: "Data Engineer / Full-Stack Developer",
    org: "Wipro · Blackstone account",
    when: "Mar 2022 to Sep 2024",
    points: [
      "Led development of a Cash Flow Dashboard (React + FastAPI) for settlement tracking, used daily by finance teams.",
      "Built user-customizable data-warehouse integrations that saved over 50 person-hours a week, plus a rule engine for automated reports that saved 20 more.",
      "Engineered a full audit-history change tracker and deployed a private DLT architecture for financial logging.",
    ],
  },
  {
    role: "Digital Specialist Engineer",
    org: "Infosys Ltd.",
    when: "Feb 2021 to Mar 2022",
    points: [
      "Built full-stack features and RESTful APIs, integrating microservices with AWS Lambda via event-driven architecture.",
      "Developed dynamic integrations with third-party payment and shipping services.",
    ],
  },
];

export const NAV = [
  { label: "crew", href: "#about" },
  { label: "research", href: "#thesis" },
  { label: "missions", href: "#projects" },
  { label: "record", href: "#experience" },
  { label: "contact", href: "#contact" },
];
