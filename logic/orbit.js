const axios = require('axios');

module.exports = async (req, res) => {
    const { username } = req.query;
    // Using environment variable for security
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    if (!username) return res.status(400).send("Username missing!");

    try {
        const config = { 
            headers: { 
                'Authorization': `token ${GITHUB_TOKEN}`, 
                'User-Agent': 'node.js' 
            } 
        };
         
        const userRes = await axios.get(`https://api.github.com/users/${username}`, config);
        const { followers, following, public_repos, name, created_at, public_gists } = userRes.data;

        const years = new Date().getFullYear() - new Date(created_at).getFullYear() || 1;
        
        const statsData = [
            { label: 'Repos', val: public_repos, score: Math.min(80, public_repos * 2 + 10) },
            { label: 'Followers', val: followers, score: Math.min(80, followers * 5 + 10) },
            { label: 'Following', val: following, score: Math.min(80, following * 5 + 10) },
            { label: 'Experience', val: years, score: Math.min(80, years * 15) },
            { label: 'Gists', val: public_gists, score: Math.min(80, public_gists * 15 + 10) },
            { label: 'Power', val: 'MAX', score: 75 }
        ];

        const angleStep = (Math.PI * 2) / 6;
        const centerX = 120, centerY = 135; 
        const points = statsData.map((s, i) => {
            const x = centerX + s.score * Math.cos(i * angleStep - Math.PI / 2);
            const y = centerY + s.score * Math.sin(i * angleStep - Math.PI / 2);
            return `${x},${y}`;
        }).join(' ');

        const svg = `
        <svg width="480" height="260" viewBox="0 0 480 260" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
                .name { font: bold 22px 'Segoe UI', Sans-Serif; fill: #E22BFF; filter: drop-shadow(0 0 12px #E22BFF); }
                .label { font: bold 9px 'Segoe UI', Sans-Serif; fill: #8B949E; }
                .val { font: bold 11px 'Segoe UI', Sans-Serif; fill: #00D4FF; }
                @keyframes starFlow { from { transform: translateX(500px); } to { transform: translateX(-100px); } }
                @keyframes starSparkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.4); filter: blur(1px); } }
                @keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes rotateFast { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                @keyframes chartPulse { 0%, 100% { fill-opacity: 0.2; stroke-opacity: 0.5; filter: drop-shadow(0 0 5px #E22BFF); } 50% { fill-opacity: 0.7; stroke-opacity: 1; filter: drop-shadow(0 0 15px #E22BFF); } }
                @keyframes particleOrbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes floatParticle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                @keyframes pulseCircle { 0% { r: 10; opacity: 1; } 100% { r: 60; opacity: 0; } }
                .star-container { animation: starFlow 10s linear infinite; }
                .star { fill: #FFF; animation: starSparkle 2s infinite ease-in-out; }
                .chart-area { fill: rgba(226, 43, 255, 0.35); stroke: #E22BFF; stroke-width: 2; animation: chartPulse 3s infinite ease-in-out; }
                .spinner-outer { transform-origin: 380px 135px; animation: rotateSlow 12s linear infinite; }
                .spinner-inner { transform-origin: 380px 135px; animation: rotateFast 5s linear infinite; }
                .particle-container { transform-origin: 380px 135px; animation: particleOrbit 25s linear infinite; }
                .particle { animation: floatParticle 3s infinite ease-in-out alternate; filter: blur(1px); opacity: 0.8; }
                .pulse { transform-origin: 380px 135px; stroke: #E22BFF; animation: pulseCircle 3s infinite; }
            </style>
            
            <rect width="480" height="260" rx="20" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
            
            <g class="star-container">
                <circle cx="50" cy="40" r="1.5" class="star" style="animation-delay: 0.1s;"/>
                <circle cx="150" cy="90" r="1.2" class="star" style="animation-delay: 0.8s;"/>
                <circle cx="280" cy="180" r="1.4" class="star" style="animation-delay: 0.3s;"/>
                <circle cx="350" cy="60" r="1" class="star" style="animation-delay: 1.2s;"/>
                <circle cx="420" cy="220" r="1.6" class="star" style="animation-delay: 0.5s;"/>
                <circle cx="100" cy="200" r="1.2" class="star" style="animation-delay: 1.5s;"/>
                <circle cx="200" cy="30" r="1.3" class="star" style="animation-delay: 0.2s;"/>
                <circle cx="460" cy="120" r="1" class="star" style="animation-delay: 0.9s;"/>
            </g>

            <rect x="150" y="8" width="220" height="28" rx="14" fill="#E22BFF" fill-opacity="0.1" stroke="#E22BFF" stroke-width="1" stroke-opacity="0.3"/>
            <text x="260" y="30" text-anchor="middle" class="name">${name || username}</text>

            <g stroke="#21262d" stroke-width="1" opacity="0.4">
                <polygon points="120,55 189,95 189,175 120,215 51,175 51,95" fill="none"/>
                <polygon points="120,75 172,105 172,165 120,195 68,165 68,105" fill="none"/>
                <line x1="120" y1="55" x2="120" y2="215" /><line x1="51" y1="95" x2="189" y2="175" /><line x1="51" y1="175" x2="189" y2="95" />
            </g>

            <polygon points="${points}" class="chart-area" />

            <text x="120" y="50" text-anchor="middle" class="label">POWER: <tspan class="val">${statsData[5].val}</tspan></text>
            <text x="200" y="95" class="label">FOLLOWERS: <tspan class="val">${statsData[1].val}</tspan></text>
            <text x="200" y="180" class="label">FOLLOWING: <tspan class="val">${statsData[2].val}</tspan></text>
            <text x="120" y="230" text-anchor="middle" class="label">EXP: <tspan class="val">${statsData[3].val}Y</tspan></text>
            <text x="5" y="180" class="label">GISTS: <tspan class="val">${statsData[4].val}</tspan></text>
            <text x="5" y="95" class="label">REPOS: <tspan class="val">${statsData[0].val}</tspan></text>

            <circle cx="380" cy="135" r="10" fill="none" class="pulse" stroke-width="2"/>
            
            <g class="spinner-outer">
                <circle cx="380" cy="135" r="45" stroke="#E22BFF" stroke-width="1" stroke-dasharray="8,4" opacity="0.4"/>
            </g>

            <g class="spinner-inner">
                <path d="M345 135 L415 135 M380 100 L380 170" stroke="#00D4FF" stroke-width="2" opacity="0.8"/>
            </g>

            <g class="particle-container">
                <circle cx="380" cy="65" r="2.5" fill="#FF3131" class="particle" style="animation-delay: 0s;"/>
                <circle cx="440" cy="100" r="2" fill="#FF9100" class="particle" style="animation-delay: 0.5s;"/>
                <circle cx="450" cy="170" r="2.5" fill="#FFF01F" class="particle" style="animation-delay: 1s;"/>
                <circle cx="380" cy="205" r="3" fill="#39FF14" class="particle" style="animation-delay: 1.5s;"/>
                <circle cx="310" cy="170" r="2" fill="#00D4FF" class="particle" style="animation-delay: 2s;"/>
                <circle cx="320" cy="100" r="2.5" fill="#005EFF" class="particle" style="animation-delay: 2.5s;"/>
                <circle cx="415" cy="190" r="2" fill="#E22BFF" class="particle" style="animation-delay: 3s;"/>
            </g>

            <circle cx="380" cy="135" r="20" fill="#E22BFF" fill-opacity="0.7" style="filter: blur(12px);"/>
            <circle cx="380" cy="135" r="8" fill="#FFF" />
        </svg>`;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
    } catch (err) {
        res.status(500).send("API error");
    }
};