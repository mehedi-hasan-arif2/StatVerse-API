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
                        pullRequests(first: 1) { totalCount }
                        contributionsCollection { totalCommitContributions }
                    }
                }`,
                variables: { login: username }
            }
        });

        const user = response.data.data.user;
        const totalPRs = user.pullRequests.totalCount;
        const totalCommits = user.contributionsCollection.totalCommitContributions;
        const growth = "15%"; 

      
        let rank, rankColor, glowColor, rankFill;
        
        if (totalCommits >= 100) { 
            rank = "EX"; 
            rankFill = "url(#exGrad)"; 
            glowColor = "#B066FF"; 
        } else if (totalCommits >= 80) { 
            rank = "S"; rankFill = "#7000FF"; glowColor = "#7000FF"; 
        } else if (totalCommits >= 60) { 
            rank = "A"; rankFill = "#00F0FF"; glowColor = "#00F0FF"; 
        } else if (totalCommits >= 40) { 
            rank = "B"; rankFill = "#00FF85"; glowColor = "#00FF85"; 
        } else if (totalCommits >= 20) { 
            rank = "C"; rankFill = "#FFD700"; glowColor = "#FFD700";
        } else if (totalCommits >= 10) { 
            rank = "D"; rankFill = "#FF8C00"; glowColor = "#FF8C00"; 
        } else { 
            rank = "E"; rankFill = "#B0B0B0"; glowColor = "#B0B0B0"; 
        }

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(`
            <svg width="450" height="200" viewBox="0 0 450 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <style>
                    .glass { fill: #0a0a0c; }
                    .border-line { stroke: url(#grad); stroke-width: 2; stroke-dasharray: 1000; animation: draw 8s linear infinite; }
                    @keyframes draw { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
                    
                    .star { animation: starMove 3.5s infinite linear; opacity: 0.7; }
                    @keyframes starMove { 
                        0% { transform: translate(0, 0); opacity: 0; }
                        50% { opacity: 1; }
                        100% { transform: translate(140px, -80px); opacity: 0; }
                    }

                    .corner-ui { animation: pulse 3s infinite alternate; }
                    @keyframes pulse { from { opacity: 0.4; transform: scale(1); } to { opacity: 1; transform: scale(1.1); } }

                    .shuttle-group { 
                        animation: float 3s infinite ease-in-out; 
                        filter: drop-shadow(0 0 15px ${glowColor});
                    }
                    @keyframes float { 
                        0%, 100% { transform: translate(225px, 90px) rotate(-45deg); } 
                        50% { transform: translate(225px, 75px) rotate(-45deg); } 
                    }
                    
                    .glow-line { stroke: url(#grad); stroke-width: 1; opacity: 0.15; stroke-dasharray: 50; animation: flow 6s linear infinite; }
                    @keyframes flow { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }

                    .stat-label { font: 700 11px 'Segoe UI', sans-serif; fill: #666; text-transform: uppercase; letter-spacing: 1.5px; }
                    .stat-value { font: 800 28px 'Segoe UI', sans-serif; fill: #fff; filter: drop-shadow(0 0 10px ${glowColor}); }
                    
                    .rank-text { 
                        font: 900 85px 'Segoe UI', sans-serif; 
                        fill: ${rankFill}; 
                        filter: drop-shadow(0 0 30px ${glowColor}); 
                    }
                </style>
                
                <defs>
                    <linearGradient id="grad"><stop offset="0%" stop-color="#7000FF" /><stop offset="100%" stop-color="#00F0FF" /></linearGradient>
                    <linearGradient id="exGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="10%" stop-color="#FFFFFF" />
                        <stop offset="100%" stop-color="#8A2BE2" />
                    </linearGradient>
                </defs>

                <rect width="450" height="200" rx="20" class="glass" />
                <rect width="450" height="200" rx="20" class="border-line" fill="none" />

                <circle cx="40" cy="160" r="1.5" fill="#FF007A" class="star" />
                <circle cx="120" cy="30" r="1.2" fill="#00F0FF" class="star" style="animation-delay: 0.4s" />
                <circle cx="280" cy="190" r="1" fill="#00FF85" class="star" style="animation-delay: 0.8s" />
                <circle cx="350" cy="50" r="1.5" fill="#FFD700" class="star" style="animation-delay: 1.2s" />
                <circle cx="180" cy="110" r="1" fill="#7000FF" class="star" style="animation-delay: 1.6s" />
                <circle cx="60" cy="80" r="1.3" fill="#FF4500" class="star" style="animation-delay: 2.0s" />
                <circle cx="400" cy="130" r="1.2" fill="#FFFFFF" class="star" style="animation-delay: 2.4s" />

                <g class="corner-ui" transform="translate(10, 10)">
                    <path d="M0 0 L15 0 L0 15 Z" fill="#7000FF" opacity="0.8" />
                    <rect x="5" y="5" width="8" height="8" fill="#00F0FF" opacity="0.5" />
                </g>

                <line x1="0" y1="200" x2="450" y2="0" class="glow-line" />

                <g class="shuttle-group">
                    <path d="M-10 10 L0 -25 L10 10 L0 5 Z" fill="#fff" />
                    <path d="M-10 0 L-18 15 L-10 10 Z" fill="#7000FF" />
                    <path d="M10 0 L18 15 L10 10 Z" fill="#00F0FF" />
                    <circle cy="15" r="5" fill="${glowColor}" opacity="0.8" />
                </g>

                <g transform="translate(40, 65)">
                    <text y="0" class="stat-label">Commits</text>
                    <text y="35" class="stat-value">${totalCommits}</text>
                    <text y="75" class="stat-label">Pull Requests</text>
                    <text y="110" class="stat-value">${totalPRs}</text>
                </g>

                <g transform="translate(225, 175)">
                    <text class="stat-label" text-anchor="middle">Evolution</text>
                    <text y="20" class="stat-value" text-anchor="middle" fill="#00FF85" style="font-size: 18px; filter:none;">+${growth}</text>
                </g>

                <g transform="translate(360, 115)">
                    <text class="rank-text" text-anchor="middle">${rank}</text>
                    <text y="35" text-anchor="middle" style="font: 700 12px sans-serif; fill: #444; letter-spacing: 4px;">RANKING</text>
                </g>
            </svg>
        `);
    } catch (err) {
        res.status(500).send('Error');
    }
};