/* ========================================
   SkyPulse Weather — Script v6
   Subtle Themes · Emoji Flow · Blurry Snowman
   ======================================== */

const apiKey = "49c4e305da612ff5d377df83c2060afa";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const weatherIcon = document.getElementById("weatherIcon");
const weatherCard = document.getElementById("weatherCard");
const bgCanvas = document.getElementById("bgCanvas");
const headerTime = document.getElementById("headerTime");
const weatherParticles = document.getElementById("weatherParticles");
const countryBadge = document.getElementById("countryBadge");

// Cursor Elements
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const cursorGlow = document.getElementById("cursorGlow");
const cursorTrailContainer = document.getElementById("cursorTrail");

// ============================================================
// 1) CUSTOM BLUE GLASS CURSOR
// ============================================================
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let ringX = mouseX, ringY = mouseY;
let glowX = mouseX, glowY = mouseY;
let lastTrailTime = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate dot update
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
    
    // Cursor trail
    const now = Date.now();
    if (now - lastTrailTime > 40) {
        spawnTrailParticle(mouseX, mouseY);
        lastTrailTime = now;
    }
});

function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
    
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + "px";
    cursorGlow.style.top = glowY + "px";
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

function spawnTrailParticle(x, y) {
    const p = document.createElement("div");
    p.className = "trail-particle";
    p.style.left = (x + (Math.random() - 0.5) * 8) + "px";
    p.style.top = (y + (Math.random() - 0.5) * 8) + "px";
    
    const size = (3 + Math.random() * 4) + "px";
    p.style.width = size;
    p.style.height = size;
    
    cursorTrailContainer.appendChild(p);
    setTimeout(() => p.remove(), 700);
}

function setupHoverTargets() {
    const hoverElements = document.querySelectorAll("button, input, a, .detail-item, .search-box");
    hoverElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursorDot.classList.add("hovering");
            cursorRing.classList.add("hovering");
            cursorGlow.classList.add("hovering");
        });
        el.addEventListener("mouseleave", () => {
            cursorDot.classList.remove("hovering");
            cursorRing.classList.remove("hovering");
            cursorGlow.classList.remove("hovering");
        });
    });
}
setupHoverTargets();

// ============================================================
// 2) ANIMATED BACKGROUND ORBS
// ============================================================
const ctx = bgCanvas.getContext("2d");
let orbs = [];
let canvasW, canvasH;

function resizeCanvas() {
    canvasW = bgCanvas.width = window.innerWidth;
    canvasH = bgCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createOrbs(count = 8) {
    orbs = [];
    const colors = [
        "rgba(34, 211, 238, 0.08)", "rgba(56, 189, 248, 0.06)",
        "rgba(59, 130, 246, 0.07)", "rgba(129, 140, 248, 0.05)",
        "rgba(34, 211, 238, 0.04)", "rgba(255, 255, 255, 0.03)", 
        "rgba(34, 211, 238, 0.05)", "rgba(129, 140, 248, 0.06)",
    ];
    for (let i = 0; i < count; i++) {
        orbs.push({
            x: Math.random() * canvasW, y: Math.random() * canvasH,
            radius: 150 + Math.random() * 300,
            color: colors[i % colors.length],
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.3,
        });
    }
}
createOrbs();

function drawOrbs() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    for (const orb of orbs) {
        orb.x += orb.vx; orb.y += orb.vy;
        
        // Wrap around bounds
        if (orb.x < -orb.radius) orb.x = canvasW + orb.radius;
        if (orb.x > canvasW + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvasH + orb.radius;
        if (orb.y > canvasH + orb.radius) orb.y = -orb.radius;
        
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        g.addColorStop(0, orb.color);
        g.addColorStop(1, "transparent");
        
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
    }
    requestAnimationFrame(drawOrbs);
}
drawOrbs();

// ============================================================
// 3) LIVE CLOCK
// ============================================================
function updateClock() {
    headerTime.textContent = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
    });
}
updateClock();
setInterval(updateClock, 1000);

// ============================================================
// 4) SUBTLE WEATHER THEMES & EFFECTS
// ============================================================
// The color palettes here are kept entirely mild and professional. (No stark yellow/orange or solid red)
// Mostly deep blues, slates, and indigos with very light variations depending on the weather.
const weatherThemes = {
    Clear: { gradients: ["#0f172a", "#1e3a8a", "#451a03"] }, // Tiny hint of warm sunset/amber glow
    Clouds: { gradients: ["#0f172a", "#1e293b", "#334155"] }, // Classic sophisticated slate
    Rain: { gradients: ["#070d1a", "#0f1c33", "#0c4a6e"] }, // Deep oceanic teal for rain
    Thunderstorm: { gradients: ["#050812", "#1e1b4b", "#0a0a1a"] }, // Electric dark indigo
    Snow: { gradients: ["#142036", "#1e3048", "#475569"] }, // Crisp frosty blue/grey
    Mist: { gradients: ["#151f2e", "#202d3d", "#1a2533"] }, // Smoky dark
    Default: { gradients: ["#0f172a", "#1e293b", "#0f172a"] }
};

let lightningInterval = null;

function applyWeatherTheme(condition) {
    const theme = weatherThemes[condition] || weatherThemes["Default"];
    const root = document.documentElement;

    // Apply the subtle background gradient
    root.style.setProperty("--bg-gradient-1", theme.gradients[0]);
    root.style.setProperty("--bg-gradient-2", theme.gradients[1]);
    root.style.setProperty("--bg-gradient-3", theme.gradients[2]);

    // Clear old visual effects
    weatherParticles.innerHTML = "";
    if (lightningInterval) clearInterval(lightningInterval);

    // 1. Classical Particles (Raindrops/Snowflakes)
    if (condition === "Rain" || condition === "Drizzle") {
        createRainParticles(condition === "Drizzle" ? 50 : 100);
        spawnEmojiFlow(["💧", "🌧️", "🐸", "🐌"]);
    } else if (condition === "Snow") {
        createSnowParticles(80);
        spawnEmojiFlow(["❄️", "🧊", "🐻‍❄️", "🐧"]);
        spawnBlurrySnowman();
    } else if (condition === "Thunderstorm") {
        createRainParticles(120);
        startLightning();
        spawnEmojiFlow(["⚡", "🌩️", "🦇", "🐺"]);
    } else if (condition === "Clear") {
        spawnEmojiFlow(["✨", "☀️", "🦋", "🌻", "🌈", "🕊️"]);
    } else if (condition === "Clouds") {
        spawnEmojiFlow(["☁️", "🌫️", "🦉", "🪁", "🦅"]);
    } else {
        spawnEmojiFlow(["✨", "🍃", "🦋", "🍄"]);
    }
}

function spawnEmojiFlow(emojis) {
    // Spawns slow drifting emojis in the background
    for (let i = 0; i < 20; i++) {
        const span = document.createElement("span");
        span.className = "bg-floating-emoji";
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        span.style.left = (Math.random() * 100) + "vw";
        const size = (1.5 + Math.random() * 2) + "rem";
        span.style.fontSize = size;
        
        span.style.animationDuration = (15 + Math.random() * 20) + "s";
        span.style.animationDelay = (Math.random() * 10) + "s";
        
        weatherParticles.appendChild(span);
    }
}

function spawnBlurrySnowman() {
    const snowman = document.createElement("div");
    snowman.className = "blurry-snowman";
    snowman.textContent = "⛄";
    weatherParticles.appendChild(snowman);
}

function createRainParticles(count) {
    for (let i = 0; i < count; i++) {
        const d = document.createElement("div"); d.className = "raindrop";
        d.style.left = Math.random() * 100 + "%";
        d.style.height = (20 + Math.random() * 40) + "px";
        d.style.animationDuration = (0.3 + Math.random() * 0.4) + "s";
        d.style.animationDelay = Math.random() * 2 + "s";
        d.style.opacity = 0.2 + Math.random() * 0.4;
        weatherParticles.appendChild(d);
    }
}

function createSnowParticles(count) {
    for (let i = 0; i < count; i++) {
        const f = document.createElement("div"); f.className = "snowflake";
        f.style.left = Math.random() * 100 + "%";
        const size = (3 + Math.random() * 5) + "px";
        f.style.width = size; f.style.height = size;
        f.style.animationDuration = (4 + Math.random() * 6) + "s";
        f.style.animationDelay = Math.random() * 4 + "s";
        f.style.opacity = 0.3 + Math.random() * 0.5;
        weatherParticles.appendChild(f);
    }
}

function startLightning() {
    lightningInterval = setInterval(() => {
        if (Math.random() > 0.6) {
            const flash = document.createElement("div");
            flash.className = "lightning-flash";
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 200);
        }
    }, 2500);
}

// ============================================================
// 5) FETCH WEATHER API
// ============================================================
async function checkWeather(city) {
    if (!city.trim()) return;
    
    weatherCard.classList.add("loading");
    
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        
        if (!response.ok) { 
            weatherCard.classList.remove("loading"); 
            return; 
        }
        
        const data = await response.json();
        
        // Update basic info
        document.getElementById("cityName").textContent = data.name;
        countryBadge.textContent = data.sys.country;
        
        // Update details
        document.getElementById("temperature").textContent = Math.round(data.main.temp) + "°";
        document.getElementById("feelsLike").textContent = "Feels like " + Math.round(data.main.feels_like) + "°";
        document.getElementById("humidity").textContent = data.main.humidity + "%";
        document.getElementById("windSpeed").textContent = data.wind.speed + " km/h";
        document.getElementById("visibility").textContent = (data.visibility / 1000).toFixed(1) + " km";
        document.getElementById("pressure").textContent = data.main.pressure + " hPa";
        document.getElementById("weatherDesc").textContent = data.weather[0].description;
        
        // Icon
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        
        // Apply Subtle Themes & Emojis
        applyWeatherTheme(data.weather[0].main);

        // UI Reset
        weatherCard.classList.remove("loading");
        
    } catch (err) {
        console.error("API error:", err);
        weatherCard.classList.remove("loading");
    }
}

// Event Listeners
searchBtn.addEventListener("click", () => checkWeather(searchInput.value));
searchInput.addEventListener("keypress", (e) => { 
    if (e.key === "Enter") checkWeather(searchInput.value); 
});

// Init
searchInput.focus();