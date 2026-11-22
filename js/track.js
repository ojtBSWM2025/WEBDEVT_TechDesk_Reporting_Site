// TechDesk - Track a Report
// Looks up sample reports first, then reports submitted on report.html (saved in localStorage).

const mockReportsData = {
            "TS-2024-00123": {
                category: "Wi-Fi Connection Issues",
                reportNumber: "TS-2024-00123",
                dateSubmitted: "March 12, 2024 - 10:24 AM",
                description: "Unable to connect to the campus wi-fi on the 5th floor. Already tried restarting the device.",
                location: "SDA Building, 5F - Lab 10",
                statusTitle: "In Progress",
                statusDesc: "Our team is currently working on your report.",
                timeline: [
                    { title: "Submitted", date: "March 12, 2024 10:24 AM", status: "completed" },
                    { title: "In Progress", date: "March 12, 2024 11:15 AM", status: "active" },
                    { title: "Resolved", date: "Pending", status: "" },
                    { title: "Closed", date: "Pending", status: "" }
                ]
            },
            "TS-2024-00456": {
                category: "Projector & AV Hardware",
                reportNumber: "TS-2024-00456",
                dateSubmitted: "March 10, 2024 - 02:00 PM",
                description: "HDMI port on lecture room projector is loose and flickering.",
                location: "Main Hall, Room 302",
                statusTitle: "Resolved",
                statusDesc: "Maintenance has replaced the faulty video cable connector.",
                timeline: [
                    { title: "Submitted", date: "March 10, 2024", status: "completed" },
                    { title: "In Progress", date: "March 10, 2024", status: "completed" },
                    { title: "Resolved", date: "March 11, 2024", status: "completed" },
                    { title: "Closed", date: "March 11, 2024", status: "active" }
                ]
            }
        };

const STORAGE_KEY = "techdesk_reports";
const form = document.getElementById("track-search-form");
const input = document.getElementById("track-report-number");
const notice = document.getElementById("track-notice");
const article = document.getElementById("track-report");

function formatDate(iso) {
    return new Date(iso).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function fromSaved(r) {
    const when = formatDate(r.submittedAt);
    return {
        category: r.category,
        reportNumber: r.reportNumber,
        dateSubmitted: when,
        description: r.description,
        location: r.location,
        statusTitle: "Submitted",
        statusDesc: "Your report was received and is waiting for review by the IT support team.",
        timeline: [
            { title: "Submitted", date: when, status: "active" },
            { title: "In Progress", date: "Pending", status: "" },
            { title: "Resolved", date: "Pending", status: "" },
            { title: "Closed", date: "Pending", status: "" }
        ]
    };
}

function findReport(ref) {
    if (mockReportsData[ref]) return mockReportsData[ref];
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch (e) { saved = []; }
    const match = saved.find(function (r) { return r.reportNumber === ref; });
    return match ? fromSaved(match) : null;
}

function setText(id, value) {
    document.getElementById(id).textContent = value;
}

function stepElement(step) {
    const div = document.createElement("div");
    div.className = ("w-step " + step.status).trim();
    const dot = document.createElement("div");
    dot.className = "w-step-dot";
    if (step.status) {
        const icon = document.createElement("i");
        icon.className = "bi bi-check";
        dot.appendChild(icon);
    }
    const title = document.createElement("div");
    title.className = "w-step-title";
    title.textContent = step.title;
    const date = document.createElement("div");
    date.className = "w-step-date";
    date.textContent = step.date;
    div.append(dot, title, date);
    return div;
}

function showReport(data) {
    setText("track-category", data.category);
    setText("track-report-heading", data.reportNumber);
    setText("track-date-submitted", data.dateSubmitted);
    setText("track-description", data.description);
    setText("track-location", data.location);
    setText("track-status-title", data.statusTitle);
    setText("track-status-desc", data.statusDesc);
    document.getElementById("track-timeline").replaceChildren(...data.timeline.map(stepElement));
    article.hidden = false;
    notice.hidden = true;
}

function search(raw) {
    const ref = raw.trim().toUpperCase();
    const data = ref ? findReport(ref) : null;
    if (data) {
        showReport(data);
    } else {
        article.hidden = true;
        notice.textContent = ref
            ? 'No report found for "' + ref + '". Check the number and try again, or try the sample TS-2024-00123.'
            : "Please enter a reference number.";
        notice.hidden = false;
    }
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    search(input.value);
});

// Opened from the confirmation message on report.html (track.html?ref=...)
const ref = new URLSearchParams(window.location.search).get("ref");
if (ref) {
    input.value = ref;
    search(ref);
}