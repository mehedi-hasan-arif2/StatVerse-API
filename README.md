🌌 StatVerse-API (The Creative Metrics Lab)

StatVerse-API is a self-built analytics engine designed to move beyond generic GitHub stats. I built this from scratch using Node.js and manual SVG logic to transform raw developer data into stunning visual narratives.

💡 Why StatVerse?

Standard GitHub profile cards felt repetitive and lacked personality. I wanted to build something where Data meets Art. By swapping heavy libraries for custom SVG coordinate math and CSS keyframes, StatVerse-API delivers high-performance, lightweight, and visually unique dashboards.

🚀 What’s Inside the Lab?

Space Orbit Metrics: A mathematical representation of developer strength using hexagonal coordinate geometry and orbital animations.

Language Proficiency: Custom "Battery-style" bars with signature charging animations, built using raw SVG paths.

Evolution Ranking: A logic-driven grading system (EX to E) that analyzes contribution density and PR impact.

Dynamic Particles: Floating UI elements and twinkling star-fields rendered through pure CSS.


🛠️ Engineering Stack

Runtime: Node.js & Express.js for a robust backend.

Data Layer: Optimized fetching via GitHub GraphQL (v4) & REST APIs.

Visuals: Manual SVG templating — No external UI libraries, zero dependencies.

Security: Environment-driven token management for secure, rate-limit-optimized requests.



🔧 Setup & Usage

Everything is custom-coded and deployment-ready. To use these metrics, simply pass your username to the API endpoints.

# Clone the lab
git clone https://github.com/your-username/StatVerse-API.git

# Install dependencies
npm install



Note: This project is a product of manual experimentation with SVG paths and GitHub's API architecture. It’s built for performance, security, and aesthetics.




