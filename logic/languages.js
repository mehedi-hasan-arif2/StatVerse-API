const axios = require('axios');

module.exports = async (req, res) => {
    const { username } = req.query;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    if (!username) return res.status(400).send("Username missing!");

    try {
        const config = { 
            headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'User-Agent': 'node.js' } 
        }; 

        const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, config);
        const langData = {};
        reposRes.data.forEach(repo => {
            if (repo.language) {
                langData[repo.language] = (langData[repo.language] || 0) + 1;
            }
        });

        const sortedLangs = Object.entries(langData).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const total = Object.values(langData).reduce((a, b) => a + b, 0);

        // Generating 25 stars with unique positions
        const starsCount = 25;
        const starsHtml = Array.from({ length: starsCount }).map((_, i) => {
            const cx = Math.floor(Math.random() * 380) + 10;
            const cy = Math.floor(Math.random() * 210) + 10;
            const delay = (Math.random() * 3).toFixed(1);
            const size = (Math.random() * 0.7 + 0.6).toFixed(1);
            return `<circle class="star" cx="${cx}" cy="${cy}" r="${size}" style="animation-delay: ${delay}s" />`;
        }).join('');

        const svg = `
        <svg width="400" height="230" viewBox="0 0 400 230" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
                /* Enhanced Twinkle with stronger Glow */
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; filter: blur(0.5px); transform: scale(0.8); }
                    50% { opacity: 1; filter: blur(2px); transform: scale(1.3); fill: #fff; }
                }
                .star { fill: white; animation: twinkle 3s infinite ease-in-out; }
                
                @keyframes grow { from { width: 0; } }
                .bar-fill { height: 6px; rx: 3; animation: grow 1.5s ease-out forwards; }
                
                /* Classic Battery-style Flash Animation */
                @keyframes chargeFlash {
                    0% { transform: translateX(-100px); opacity: 0; }
                    20% { opacity: 0.7; }
                    80% { opacity: 0.7; }
                    100% { transform: translateX(350px); opacity: 0; }
                }
                .flash { fill: #fff; animation: chargeFlash 2.5s infinite linear; }
                
                .header { font: bold 16px 'Segoe UI', Sans-Serif; fill: #D783FF; filter: drop-shadow(0 0 5px #D783FF); }
                .lang-name { font: 600 13px 'Segoe UI', Sans-Serif; fill: #73FDFF; }
                .percent { font: 400 11px 'Segoe UI', Sans-Serif; fill: #8B949E; }
                .card-border { stroke: #D783FF; stroke-width: 1.5; stroke-opacity: 0.8; }
            </style>

            <rect x="0" y="0" width="400" height="230" rx="12" fill="#0D1117" />
            
            ${starsHtml}

            <rect x="1" y="1" width="398" height="228" rx="12" class="card-border" fill="none" />
            <text x="25" y="35" class="header">Language Proficiency</text>

            ${sortedLangs.map((lang, index) => {
                const percentage = ((lang[1] / total) * 100).toFixed(1);
                const barWidth = (percentage * 2.8);
                return `
                <g transform="translate(25, ${70 + index * 32})">
                    <text class="lang-name">${lang[0]}</text>
                    <text x="315" class="percent">${percentage}%</text>
                    <rect y="10" width="340" height="6" fill="#161B22" rx="3"/>
                    <rect y="10" width="${barWidth}" height="6" class="bar-fill" fill="url(#grad${index})" style="animation-delay: ${index * 0.1}s;"/>
                    <svg width="${barWidth}" height="6" x="0" y="10">
                        <rect width="60" height="6" class="flash" style="animation-delay: ${index * 0.2 + 1.5}s;"/>
                    </svg>
                    <defs>
                        <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#D783FF" />
                            <stop offset="100%" stop-color="#00D4FF" />
                        </linearGradient>
                    </defs>
                </g>`;
            }).join('')}
        </svg>`;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
    } catch (err) {
        res.status(500).send("API error");
    }
};