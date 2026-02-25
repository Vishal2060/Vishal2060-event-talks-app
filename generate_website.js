
const fs = require('fs');
const path = require('path');

const talksData = [
    {
        "id": "talk1",
        "title": "Introduction to AI in Software Development",
        "speakers": ["Dr. Anya Sharma"],
        "category": ["AI", "Software Development"],
        "duration": 60,
        "description": "An overview of how artificial intelligence is transforming software development lifecycles, from coding assistants to automated testing."
    },
    {
        "id": "talk2",
        "title": "Demystifying Quantum Computing",
        "speakers": ["Prof. Ben Carter", "Dr. Chloe Davis"],
        "category": ["Quantum Computing", "Physics", "Future Tech"],
        "duration": 60,
        "description": "A foundational look into the principles of quantum computing and its potential impact on various industries."
    },
    {
        "id": "talk3",
        "title": "Secure Coding Practices in Web Applications",
        "speakers": ["Ms. Emily Rodriguez"],
        "category": ["Security", "Web Development"],
        "duration": 60,
        "description": "Best practices and common pitfalls in securing modern web applications against prevalent cyber threats."
    },
    {
        "id": "talk4",
        "title": "The Rise of Serverless Architectures",
        "speakers": ["Mr. David Kim"],
        "category": ["Cloud", "Serverless", "Architecture"],
        "duration": 60,
        "description": "Exploring the benefits and challenges of building and deploying applications using serverless functions and platforms."
    },
    {
        "id": "talk5",
        "title": "Data Visualization with D3.js",
        "speakers": ["Dr. Sarah Lee"],
        "category": ["Data Science", "Visualization", "JavaScript"],
        "duration": 60,
        "description": "A hands-on session on creating interactive and compelling data visualizations using the D3.js library."
    },
    {
        "id": "talk6",
        "title": "Blockchain Beyond Cryptocurrencies",
        "speakers": ["Mr. Alex Chen"],
        "category": ["Blockchain", "Distributed Systems", "Finance"],
        "duration": 60,
        "description": "Unpacking the underlying technology of blockchain and its applications in areas outside of digital currencies."
    }
];

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Talks Event Schedule</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
        }
        .search-container {
            margin-bottom: 20px;
            text-align: center;
        }
        .search-container input[type="text"] {
            width: 100%;
            max-width: 400px;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }
        .schedule-item {
            background-color: #e9ecef;
            border-left: 5px solid #007bff;
            margin-bottom: 15px;
            padding: 15px 20px;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .schedule-item.lunch {
            border-left: 5px solid #28a745;
            background-color: #d4edda;
        }
        .schedule-time {
            font-weight: bold;
            color: #0056b3;
            font-size: 1.1em;
        }
        .schedule-item.lunch .schedule-time {
            color: #155724;
        }
        .talk-title {
            font-size: 1.3em;
            color: #343a40;
            margin-top: 5px;
        }
        .speakers {
            font-style: italic;
            color: #555;
            font-size: 0.9em;
        }
        .categories span {
            display: inline-block;
            background-color: #6c757d;
            color: #fff;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.8em;
            margin-right: 5px;
            margin-top: 5px;
        }
        .description {
            font-size: 0.9em;
            line-height: 1.5;
            margin-top: 10px;
        }
        .no-results {
            text-align: center;
            color: #666;
            font-size: 1.1em;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Technical Talks Event Schedule</h1>

        <div class="search-container">
            <input type="text" id="categorySearch" placeholder="Search by category (e.g., AI, Security)">
        </div>

        <div id="schedule">
            <!-- Schedule items will be generated here by JavaScript -->
        </div>
    </div>

    <script>
        const talks = ${JSON.stringify(talksData, null, 2)};

        const eventStartTime = new Date();
        eventStartTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

        const talkDuration = 60; // minutes
        const transitionDuration = 10; // minutes
        const lunchDuration = 60; // minutes

        function formatTime(date) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        function generateSchedule() {
            const scheduleDiv = document.getElementById('schedule');
            scheduleDiv.innerHTML = ''; // Clear existing schedule

            let currentTime = new Date(eventStartTime);
            let talkIndex = 0;
            let currentTalks = [...talks]; // Make a copy to filter

            // Check for search term
            const searchTerm = document.getElementById('categorySearch').value.toLowerCase();
            if (searchTerm) {
                currentTalks = talks.filter(talk =>
                    talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
                );
            }

            if (currentTalks.length === 0 && searchTerm) {
                scheduleDiv.innerHTML = '<p class="no-results">No talks found for this category.</p>';
                return;
            } else if (currentTalks.length === 0 && !searchTerm) {
                scheduleDiv.innerHTML = '<p class="no-results">No talks available.</p>';
                return;
            }


            for (let i = 0; i < currentTalks.length + 1; i++) { // +1 for lunch
                // Add talk
                if (talkIndex < currentTalks.length) {
                    const talk = currentTalks[talkIndex];
                    const talkEndTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);

                    const talkElement = document.createElement('div');
                    talkElement.className = 'schedule-item';
                    talkElement.innerHTML = `
                        <div class="schedule-time">${formatTime(currentTime)} - ${formatTime(talkEndTime)}</div>
                        <div class="talk-title">${talk.title}</div>
                        <div class="speakers">Speaker(s): ${talk.speakers.join(', ')}</div>
                        <div class="categories">
                            ${talk.category.map(cat => `<span>${cat}</span>`).join('')}
                        </div>
                        <div class="description">${talk.description}</div>
                    `;
                    scheduleDiv.appendChild(talkElement);

                    currentTime = new Date(talkEndTime.getTime() + transitionDuration * 60 * 1000);
                    talkIndex++;
                }

                // Insert lunch break after the third talk
                if (talkIndex === 3 && i < currentTalks.length) { // Ensure lunch is added only once and not if no talks left
                    const lunchStartTime = new Date(currentTime);
                    const lunchEndTime = new Date(lunchStartTime.getTime() + lunchDuration * 60 * 1000);

                    const lunchElement = document.createElement('div');
                    lunchElement.className = 'schedule-item lunch';
                    lunchElement.innerHTML = `
                        <div class="schedule-time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div>
                        <div class="talk-title">Lunch Break</div>
                        <div class="description">Enjoy your meal!</div>
                    `;
                    scheduleDiv.appendChild(lunchElement);
                    currentTime = new Date(lunchEndTime.getTime() + transitionDuration * 60 * 1000);
                }
            }
        }

        document.addEventListener('DOMContentLoaded', generateSchedule);
        document.getElementById('categorySearch').addEventListener('input', generateSchedule);
    </script>
</body>
</html>
`;

const outputPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outputPath, htmlContent, 'utf8');

console.log(`Successfully generated index.html at \${outputPath}`);
