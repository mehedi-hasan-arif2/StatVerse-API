const axios = require('axios');

module.exports = async (req, res) => {
    const { username } = req.query;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    try {
        const response = await axios({
            url: 'https://api.github.com/graphql',
            method: 'post',
            headers: { Authorization: `bearer ${GITHUB_TOKEN}` },
            data: {
                query: `
                query userInfo($login: String!) {
                    user(login: $login) {
                        repositories(first: 100) { totalCount }
                        starredRepositories { totalCount }
                        repositoriesContributedTo { totalCount }
                        issues { totalCount }
                        contributionsCollection { 
                            contributionCalendar { totalContributions }
                        }
                    }
                }`,
                variables: { login: username }
            }
        });

        const user = response.data.data.user;
        const stats = [
            { label: "REPOSITORIES", value: user.repositories.totalCount, clr: "#00F0FF", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
            { label: "TOTAL STARS", value: user.starredRepositories.totalCount, clr: "#FFD700", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
            { label: "CONTRIBUTIONS", value: user.contributionsCollection.contributionCalendar.totalContributions, clr: "#00FF85", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
            { label: "COLLABORATIONS", value: user.repositoriesContributedTo.totalCount, clr: "#FF007A", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
            { label: "ISSUES RESOLVED", value: user.issues.totalCount, clr: "#BD00FF", icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" },
            { label: "STARRED REPOS", value: user.starredRepositories.totalCount, clr: "#58a6ff", icon: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" }
        ];

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(`
            <svg width="450" height="190" viewBox="0 0 450 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <style>
                    .bg { fill: #0d1117; rx: 12; stroke: url(#borderG); stroke-width: 2; }
                    .header { font: 800 15px sans-serif; fill: #BD00FF; filter: drop-shadow(0 0 3px #BD00FF); text-transform: uppercase; }
                    .label { font: 700 9px sans-serif; fill: #8b949e; letter-spacing: 0.5px; }
                    .val { font: 800 13px sans-serif; fill: #fff; }
                    
                    /* Center Line Breathing Glow [cite: 2026-01-05] */
                    @keyframes lineBreathe {
                        0%, 100% { opacity: 0.1; stroke-width: 1; }
                        50% { opacity: 0.7; stroke-width: 2; filter: blur(1px); }
                    }
                    .glow-line { stroke: #BD00FF; stroke-dasharray: 4, 4; animation: lineBreathe 3s infinite ease-in-out; }

                    /* Floating Upwards Particle Animation [cite: 2026-01-05] */
                    @keyframes floatUp {
                        0% { transform: translateY(0); opacity: 0; }
                        20% { opacity: 1; }
                        100% { transform: translateY(-100px); opacity: 0; }
                    }
                    .p { animation: floatUp 4s infinite linear; }

                    @keyframes barPulse { 0%, 100% { height: var(--h1); } 50% { height: var(--h2); } }
                    .bar { animation: barPulse 3s infinite ease-in-out; transform-box: fill-box; transform-origin: bottom; }
                </style>

                <rect width="450" height="190" class="bg" />
                <text x="25" y="30" class="header">Developer Metrics</text>

                <line x1="220" y1="40" x2="220" y2="165" class="glow-line" />

                ${stats.map((s, i) => `
                    <g transform="translate(25, ${58 + i * 18})">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${s.clr}" stroke-width="2.5">
                            <path d="${s.icon}" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <text x="18" y="8" class="label">${s.label}</text>
                        <text x="180" y="8" class="val" style="fill: ${s.clr}; text-anchor: end;">${s.value}</text>
                    </g>
                `).join('')}

                <g transform="translate(245, 160)">
                    <path d="M0 0 L180 0" stroke="#1f242b" stroke-width="1.5" />
                    
                    <rect x="0" y="-50" width="18" height="50" fill="#BD00FF" rx="2" class="bar" style="--h1:50px; --h2:30px; filter: drop-shadow(0 0 8px #BD00FF);" />
                    <rect x="25" y="-90" width="18" height="90" fill="#00F0FF" rx="2" class="bar" style="--h1:90px; --h2:60px; animation-delay: 0.2s; filter: drop-shadow(0 0 8px #00F0FF);" />
                    <rect x="50" y="-45" width="18" height="45" fill="#BD00FF" rx="2" class="bar" style="--h1:45px; --h2:25px; animation-delay: 0.4s; filter: drop-shadow(0 0 8px #BD00FF);" />
                    <rect x="75" y="-110" width="18" height="110" fill="#00F0FF" rx="2" class="bar" style="--h1:110px; --h2:80px; animation-delay: 0.6s; filter: drop-shadow(0 0 8px #00F0FF);" />
                    <rect x="100" y="-70" width="18" height="70" fill="#BD00FF" rx="2" class="bar" style="--h1:70px; --h2:45px; animation-delay: 0.8s; filter: drop-shadow(0 0 8px #BD00FF);" />
                    <rect x="125" y="-95" width="18" height="95" fill="#00F0FF" rx="2" class="bar" style="--h1:95px; --h2:65px; animation-delay: 1s; filter: drop-shadow(0 0 8px #00F0FF);" />
                    <rect x="150" y="-60" width="18" height="60" fill="#BD00FF" rx="2" class="bar" style="--h1:60px; --h2:40px; animation-delay: 1.2s; filter: drop-shadow(0 0 8px #BD00FF);" />

                    <circle cx="10" cy="-20" r="1.5" fill="#fff" class="p" style="animation-delay: 0s;" />
                    <circle cx="40" cy="-30" r="2" fill="#00F0FF" class="p" style="animation-delay: 1s;" />
                    <circle cx="85" cy="-10" r="1.5" fill="#BD00FF" class="p" style="animation-delay: 2.5s;" />
                    <circle cx="130" cy="-40" r="2" fill="#fff" class="p" style="animation-delay: 1.5s;" />
                    <circle cx="165" cy="-25" r="1.2" fill="#00F0FF" class="p" style="animation-delay: 3s;" />
                    <circle cx="60" cy="-15" r="1" fill="#BD00FF" class="p" style="animation-delay: 0.5s;" />
                </g>

                <defs>
                    <linearGradient id="borderG" x1="0" y1="0" x2="450" y2="190">
                        <stop offset="0%" stop-color="#BD00FF" />
                        <stop offset="100%" stop-color="#00F0FF" />
                    </linearGradient>
                </defs>
            </svg>
        `);
    } catch (err) {
        res.status(500).send('Error');
    }
};