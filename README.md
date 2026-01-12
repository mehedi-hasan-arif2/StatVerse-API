# 🌌 StatVerse-API
### *The Creative Metrics Lab*

**StatVerse-API** is a self-built analytics engine designed to move beyond generic GitHub stats. I built this from scratch using **Node.js** and **manual SVG logic** to transform raw developer data into stunning visual narratives.

---

### 💡 Why StatVerse?
Standard GitHub profile cards felt repetitive and lacked personality. I wanted to build a bridge where **Data meets Art**. By swapping heavy libraries for custom SVG coordinate math and CSS keyframes, StatVerse-API delivers high-performance, lightweight, and visually unique dashboards.

### 🚀 What’s Inside the Lab?
Every card is a product of manual experimentation with SVG paths and GitHub's API architecture:

* **Space Orbit Metrics:** A mathematical representation of developer strength using hexagonal coordinate geometry.
* **Language Proficiency:** Custom "Battery-style" bars with signature charging animations.
* **Evolution Ranking:** A logic-driven grading system (EX to E) analyzing contribution density.
* **Dynamic Particles:** Floating UI elements and twinkling star-fields rendered through pure CSS.

---

### 🛠️ Engineering Stack
* **Runtime:** Node.js & Express.js
* **Data Engine:** GitHub GraphQL (v4) & REST APIs
* **Visuals:** Manual SVG Templating (Zero Dependencies)
* **Security:** Environment-driven Token Management

---

### 🔧 Integration Guide (Add to your Profile)
Simply copy the code below and replace `YOUR_USERNAME` with your actual username.

```html
<p align="center">
  <img src="[https://stat-verse-api.vercel.app/api/orbit?username=YOUR_USERNAME](https://stat-verse-api.vercel.app/api/orbit?username=YOUR_USERNAME)" width="48%" alt="Power Radar" />
  &nbsp;&nbsp;
  <img src="[https://stat-verse-api.vercel.app/api/coreStats?username=YOUR_USERNAME](https://stat-verse-api.vercel.app/api/coreStats?username=YOUR_USERNAME)" width="48%" alt="Core Stats" />
</p>

<p align="center">
  <img src="[https://stat-verse-api.vercel.app/api/languages?username=YOUR_USERNAME](https://stat-verse-api.vercel.app/api/languages?username=YOUR_USERNAME)" width="48%" alt="Top Languages" />
  &nbsp;&nbsp;
  <img src="[https://stat-verse-api.vercel.app/api/performance?username=YOUR_USERNAME](https://stat-verse-api.vercel.app/api/performance?username=YOUR_USERNAME)" width="48%" alt="Evolution Rank" />
</p>


[!NOTE]
StatVerse-API operates on zero external dependencies. The entire visualization layer is built using vanilla SVG templating and CSS logic, ensuring maximum performance and minimal load times.
