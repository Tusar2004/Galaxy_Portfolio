import { useState, useEffect } from "react";

type PlanetPanelProps = {
  planet: string | null;
  onClose: () => void;
};

export default function PlanetPanel({ planet, onClose }: PlanetPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedCert) {
          setSelectedCert(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, selectedCert]);

  if (!planet) return null;

  // ✅ FIXED: Complete Portfolio Data with proper structure
  const contentMap: Record<string, any> = {
    "origin-station": {
      title: "ORIGIN STATION",
      subtitle: "About Tusar Goswami",
      icon: "🏛️",
      tabs: [
        {
          name: "Overview",
          content: {
            intro: "BTech CSE Student (2023-2027) at Lovely Professional University, passionate about becoming a proficient Full-Stack Developer with expertise in cloud technologies and CI/CD.",
            highlights: [
              { icon: "🎓", label: "Education", value: "BTech CSE, LPU (3rd Year)" },
              { icon: "🏫", label: "School", value: "Mandalkuli Netaji Vidyapith" },
              { icon: "🎯", label: "Goal", value: "Senior Software Engineer" },
              { icon: "💡", label: "Inspiration", value: "Bruno Simon's Portfolio" },
            ],
          },
        },
        {
          name: "Journey",
          content: {
            story: [
              {
                phase: "🌱 The Beginning",
                text: "Started coding during college when I realized the power of logic and data. A small automation script changed everything.",
              },
              {
                phase: "⚡ The Struggle",
                text: "Faced lack of guidance, tutorial overwhelm, and imposter syndrome comparing myself to others.",
              },
              {
                phase: "🚀 The Breakthrough",
                text: "Completed and deployed my first big project. Learned Git & GitHub, joined the global dev community.",
              },
              {
                phase: "💪 Today",
                text: "Coding is my superpower! Combining logic with creativity. Excited about algorithms, data structures, and building scalable systems.",
              },
            ],
          },
        },
        {
          name: "Fun Facts",
          content: {
            facts: [
              { emoji: "🎮", text: "Loves gaming, traveling, and drawing" },
              { emoji: "🌙", text: "Night owl - Best work: 10 PM to 2 AM" },
              { emoji: "☕", text: "Can't function without strong chai (not coffee!)" },
              { emoji: "🎬", text: "Excellent memory for movie quotes & trivia" },
              { emoji: "💙", text: "Favorite color: Deep Navy/Royal Blue" },
              { emoji: "🦾", text: "Favorite character: Iron Man (Tony Stark)" },
            ],
          },
        },
      ],
    },

    "tech-nebula": {
      title: "TECH NEBULA",
      subtitle: "Skills & Technology Stack",
      icon: "⚡",
      tabs: [
        {
          name: "Frontend",
          content: {
            skills: [
              { name: "HTML5", level: 95 },
              { name: "CSS3", level: 90 },
              { name: "JavaScript (ES6+)", level: 92 },
              { name: "TypeScript", level: 85 },
              { name: "React.js", level: 90 },
              { name: "Next.js", level: 80 },
              { name: "Angular", level: 75 },
              { name: "Vue.js", level: 70 },
              { name: "Tailwind CSS", level: 95 },
              { name: "Bootstrap", level: 85 },
            ],
          },
        },
        {
          name: "Backend",
          content: {
            skills: [
              { name: "Node.js", level: 88 },
              { name: "Python", level: 85 },
              { name: "Java", level: 80 },
              { name: "PHP", level: 75 },
              { name: "Express.js", level: 85 },
              { name: "Flask", level: 82 },
              { name: "Django", level: 75 },
              { name: "Spring Boot", level: 78 },
              { name: "NestJS", level: 72 },
            ],
          },
        },
        {
          name: "Database & Tools",
          content: {
            databases: [
              { name: "MySQL", level: 90 },
              { name: "MongoDB", level: 85 },
              { name: "PostgreSQL", level: 80 },
              { name: "Oracle DB", level: 75 },
            ],
            tools: [
              { name: "Git", level: 92 },
              { name: "Docker", level: 80 },
              { name: "VS Code", level: 95 },
              { name: "Postman", level: 88 },
              { name: "GitHub", level: 90 },
            ],
          },
        },
        {
          name: "Mobile & Other",
          content: {
            mobile: [
              { name: "Flutter", level: 82 },
              { name: "Dart", level: 80 },
            ],
            libraries: [
              { name: "Chart.js" },
              { name: "Leaflet.js" },
              { name: "Matplotlib" },
              { name: "pandas" },
            ],
          },
        },
      ],
    },

    "project-galaxy": {
      title: "PROJECT GALAXY",
      subtitle: "Featured Work & Innovations",
      icon: "🚀",
      tabs: [
        {
          name: "All Projects",
          content: {
            projects: [
              {
                name: "Velo Rapido",
                tagline: "Premium Bike Rental System",
                description: "Responsive web app with secure auth, admin dashboard, and real-time bike tracking using Leaflet.js. Optimized database and mobile-friendly UI.",
                tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "Tailwind CSS", "Leaflet.js"],
                features: [
                  "Secure authentication system",
                  "Interactive admin dashboard",
                  "Real-time bike tracking with maps",
                  "Optimized database queries",
                  "Fully responsive design",
                ],
                links: {
                  github: "#",
                  live: "#",
                },
              },
              {
                name: "LinkedIn Optimizer Pro",
                tagline: "AI-Powered Profile Assistant",
                description: "AI chatbot for LinkedIn profile optimization with tools like Headline Grader, Keyword Spotlight, and Summary Analyzer. Analytics dashboard with Chart.js.",
                tech: ["Flask", "Python", "Tailwind CSS", "Chart.js", "pandas", "fpdf", "Werkzeug"],
                features: [
                  "Headline Grader with AI suggestions",
                  "Keyword Spotlight analysis",
                  "Summary Analyzer tool",
                  "Dashboard with Chart.js analytics",
                  "PDF export functionality",
                ],
                links: {
                  github: "#",
                  live: "#",
                },
              },
              {
                name: "CPU Scheduling Simulator",
                tagline: "Algorithm Visualization Tool",
                description: "Interactive simulator for 6 CPU scheduling algorithms (FCFS, SJF, RR, etc.) with real-time Gantt charts and performance metrics.",
                tech: ["Python", "Flask", "HTML", "Tailwind CSS", "JavaScript", "Matplotlib"],
                features: [
                  "6 scheduling algorithms",
                  "Interactive Gantt charts",
                  "Real-time performance metrics",
                  "Algorithm comparison tool",
                ],
                links: {
                  github: "#",
                },
              },
              {
                name: "University Management System",
                tagline: "Flutter Student Portal",
                description: "Mobile app for university students with Material Design, custom themes, form validation, and integrated packages like url_launcher.",
                tech: ["Flutter", "Dart", "Material Design", "Navigator 2.0"],
                features: [
                  "Student portal dashboard",
                  "Custom themes and styling",
                  "Form validation",
                  "URL launcher integration",
                ],
                links: {
                  github: "#",
                },
              },
            ],
          },
        },
      ],
    },

    "career-cosmos": {
      title: "CAREER COSMOS",
      subtitle: "Experience & Education",
      icon: "💼",
      tabs: [
        {
          name: "Experience",
          content: {
            experiences: [
              {
                role: "Summer Training",
                company: "Lovely Professional University",
                duration: "Summer 2024",
                description: "Mobile Application Development using Flutter",
                highlights: [
                  "Built cross-platform mobile applications",
                  "Learned Flutter & Dart fundamentals",
                  "Implemented Material Design patterns",
                ],
              },
              {
                role: "Technical Club Lead/Coordinator",
                company: "University Technical Society",
                duration: "2024 - Present",
                description: "Active member organizing workshops and managing club activities",
                highlights: [
                  "Organize workshops for juniors",
                  "Manage club website and social media",
                  "Lead technical events and hackathons",
                ],
              },
            ],
            hackathons: [
              "Participated in 2 major hackathons",
              "Building problem-solving skills",
            ],
            openSource: [
              "Planning 3-5 meaningful contributions",
              "Focus on documentation and bug fixes",
              "Targeting good-first-issue labels",
            ],
          },
        },
        {
          name: "Education",
          content: {
            education: [
              {
                degree: "BTech in Computer Science & Engineering",
                institution: "Lovely Professional University",
                duration: "2023 - 2027",
                status: "Currently in 3rd Year",
                highlights: [
                  "Core CSE specialization",
                  "Focus on Full-Stack Development",
                  "Active in technical clubs",
                ],
              },
              {
                degree: "Higher Secondary Education",
                institution: "Mandalkuli Netaji Vidyapith",
                duration: "Completed",
                highlights: [
                  "Strong foundation in sciences",
                  "Early interest in technology",
                ],
              },
            ],
          },
        },
      ],
    },

    "achievement-sphere": {
      title: "ACHIEVEMENT SPHERE",
      subtitle: "Certifications & Milestones",
      icon: "🎯",
      tabs: [
        {
          name: "Certifications",
          content: {
            certs: [
              {
                name: "Cloud Computing",
                issuer: "NPTEL",
                date: "May 2025",
                image: "https://via.placeholder.com/400x250/1a3a5f/00ffff?text=Cloud+Computing+NPTEL",
              },
              {
                name: "ChatGPT-4 Prompt Engineering",
                issuer: "Infosys Springboard",
                date: "Aug 2025",
                image: "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=ChatGPT-4+Infosys",
              },
              {
                name: "The Bits and Bytes of Computer Networking",
                issuer: "Google",
                date: "Nov-Dec 2024",
                image: "https://via.placeholder.com/400x250/0ea5e9/ffffff?text=Networking+Google",
              },
              {
                name: "Computer Networking Fundamentals",
                issuer: "Google (Coursera)",
                date: "Sep 2024",
                image: "https://via.placeholder.com/400x250/34d399/000000?text=Networking+Coursera",
              },
              {
                name: "Frontend Development Libraries",
                issuer: "FreeCodeCamp",
                date: "Sep 2025",
                image: "https://via.placeholder.com/400x250/f59e0b/000000?text=Frontend+FreeCodeCamp",
              },
              {
                name: "Build Generative AI Apps (No-Code)",
                issuer: "Udemy",
                date: "Aug 2025",
                image: "https://via.placeholder.com/400x250/ec4899/ffffff?text=GenAI+Udemy",
              },
              {
                name: "Mobile Application Development",
                issuer: "Lovely Professional University",
                date: "Aug 2025",
                image: "https://via.placeholder.com/400x250/06b6d4/000000?text=Mobile+Dev+LPU",
              },
              {
                name: "Generative AI Courses",
                issuer: "Infosys Springboard",
                date: "Aug 2025",
                image: "https://via.placeholder.com/400x250/a78bfa/000000?text=GenAI+Infosys",
              },
            ],
          },
        },
        {
          name: "HackerRank",
          content: {
            stars: [
              {
                lang: "Java",
                stars: 5,
                label: "Java",
                value: "⭐⭐⭐⭐⭐",
              },
              {
                lang: "C++",
                stars: 5,
                label: "C++",
                value: "⭐⭐⭐⭐⭐",
              },
              {
                lang: "React",
                stars: 5,
                label: "React",
                value: "⭐⭐⭐⭐⭐",
              },
              {
                lang: "C",
                stars: 4,
                label: "C",
                value: "⭐⭐⭐⭐☆",
              },
              {
                lang: "Python",
                stars: 4,
                label: "Python",
                value: "⭐⭐⭐⭐☆",
              },
            ],
            badges: [
              "JavaScript (Intermediate)",
              "Problem Solving (Basic)",
              "Python (Basic)",
              "SQL (Basic)",
            ],
          },
        },
        {
          name: "Achievements",
          content: {
            stats: [
              { label: "Problems Solved", value: "500+", icon: "💻" },
              { label: "Certifications", value: "8+", icon: "📜" },
              { label: "Projects Completed", value: "4+", icon: "🚀" },
              { label: "Hackathons", value: "2", icon: "🏆" },
            ],
          },
        },
      ],
    },
  };

  const data = contentMap[planet] || {
    title: planet.toUpperCase(),
    subtitle: "Details coming soon...",
    icon: "🌍",
    tabs: [],
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.92)",
          backdropFilter: "blur(12px)",
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={onClose}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .panel-content {
            animation: slideUp 0.4s ease-out;
          }
          .panel-content::-webkit-scrollbar {
            width: 10px;
          }
          .panel-content::-webkit-scrollbar-track {
            background: rgba(0, 255, 255, 0.1);
            border-radius: 10px;
          }
          .panel-content::-webkit-scrollbar-thumb {
            background: rgba(0, 255, 255, 0.4);
            border-radius: 10px;
          }
          .panel-content::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 255, 255, 0.6);
          }
          .skill-bar {
            height: 8px;
            background: rgba(14, 165, 233, 0.2);
            border-radius: 10px;
            overflow: hidden;
            margin-top: 8px;
          }
          .skill-fill {
            height: 100%;
            background: linear-gradient(90deg, #0ea5e9, #06b6d4);
            border-radius: 10px;
            transition: width 1s ease-out;
          }
          .tab-btn {
            padding: 12px 24px;
            background: rgba(14, 165, 233, 0.1);
            border: 2px solid rgba(14, 165, 233, 0.3);
            border-radius: 10px;
            color: #94a3b8;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            font-size: 14px;
          }
          .tab-btn:hover {
            background: rgba(14, 165, 233, 0.2);
            border-color: rgba(14, 165, 233, 0.5);
            color: #ffffff;
          }
          .tab-btn-active {
            background: rgba(14, 165, 233, 0.3);
            border-color: #0ea5e9;
            color: #00ffff;
            box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);
          }
          .cert-card {
            position: relative;
            padding: 16px;
            background: rgba(14, 165, 233, 0.08);
            border-radius: 12px;
            border: 2px solid rgba(14, 165, 233, 0.2);
            cursor: pointer;
            transition: all 0.3s ease;
            overflow: hidden;
          }
          .cert-card:hover {
            background: rgba(14, 165, 233, 0.15);
            border-color: rgba(14, 165, 233, 0.5);
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
          }
          .cert-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 12px;
            background: rgba(14, 165, 233, 0.1);
          }
          .cert-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(14, 165, 233, 0.9);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
          }
        `}</style>
        <div
          className="panel-content"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(900px, 95vw)",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
            padding: "40px",
            borderRadius: 24,
            border: "2px solid rgba(0, 255, 255, 0.3)",
            boxShadow: "0 25px 80px rgba(0, 255, 255, 0.25), inset 0 0 60px rgba(0, 100, 255, 0.15)",
            color: "white",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 48 }}>{data.icon}</span>
              <div>
                <h2
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    margin: 0,
                    background: "linear-gradient(to right, #00ffff, #00aaff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: 2,
                  }}
                >
                  {data.title}
                </h2>
                <p style={{ fontSize: 15, color: "#00ffff", marginTop: 8, opacity: 0.8, letterSpacing: 1 }}>
                  {data.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                border: "2px solid #0ea5e9",
                background: "rgba(14, 165, 233, 0.15)",
                color: "#00ffff",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 700,
                transition: "all 0.3s ease",
                letterSpacing: 1,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(14, 165, 233, 0.3)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(14, 165, 233, 0.15)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ✕ CLOSE
            </button>
          </div>

          {/* Tabs */}
          {data.tabs && data.tabs.length > 0 && (
            <>
              <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
                {data.tabs.map((tab: any, idx: number) => (
                  <button
                    key={idx}
                    className={`tab-btn ${activeTab === idx ? "tab-btn-active" : ""}`}
                    onClick={() => setActiveTab(idx)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div>
                {renderTabContent(data.tabs[activeTab]?.content, setSelectedCert)}
              </div>
            </>
          )}

          {/* Footer */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid rgba(0, 255, 255, 0.15)",
              fontSize: 13,
              color: "#00ffff",
              opacity: 0.6,
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            Press ESC or click outside to exit • Use arrow keys to navigate
          </div>
        </div>
      </div>

      {/* Fullscreen Certificate Viewer */}
      {selectedCert && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 400,
            background: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            animation: "fadeIn 0.3s ease-out",
          }}
          onClick={() => setSelectedCert(null)}
        >
          <div
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCert(null)}
              style={{
                position: "absolute",
                top: -50,
                right: 0,
                padding: "12px 24px",
                background: "rgba(14, 165, 233, 0.2)",
                border: "2px solid #0ea5e9",
                borderRadius: 10,
                color: "#00ffff",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              ✕ Close
            </button>
            <img
              src={selectedCert.image}
              alt={selectedCert.name}
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: 12,
                boxShadow: "0 20px 60px rgba(14, 165, 233, 0.4)",
              }}
            />
            <div
              style={{
                marginTop: 16,
                textAlign: "center",
                color: "#00ffff",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {selectedCert.name} • {selectedCert.issuer}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ✅ FIXED: Render function with proper null checks
function renderTabContent(content: any, setSelectedCert?: (cert: any) => void) {
  if (!content) {
    return <div style={{ color: "#cbd5e1", padding: 20, textAlign: "center" }}>No content available</div>;
  }

  // Overview type
  if (content.intro) {
    return (
      <div>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#cbd5e1", marginBottom: 24 }}>
          {content.intro}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {content.highlights.map((item: any, i: number) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: "rgba(14, 165, 233, 0.1)",
                borderRadius: 12,
                border: "1px solid rgba(14, 165, 233, 0.2)",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Story/Journey type
  if (content.story) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {content.story.map((item: any, i: number) => (
          <div
            key={i}
            style={{
              padding: 20,
              background: "rgba(14, 165, 233, 0.08)",
              borderRadius: 12,
              borderLeft: "4px solid #0ea5e9",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: "#00ffff", marginBottom: 8 }}>
              {item.phase}
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#cbd5e1", margin: 0 }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Fun Facts type
  if (content.facts) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        {content.facts.map((fact: any, i: number) => (
          <div
            key={i}
            style={{
              padding: 16,
              background: "rgba(14, 165, 233, 0.1)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 32 }}>{fact.emoji}</span>
            <span style={{ fontSize: 14, color: "#cbd5e1" }}>{fact.text}</span>
          </div>
        ))}
      </div>
    );
  }

  // Skills type
  if (content.skills) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {content.skills.map((skill: any, i: number) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#ffffff" }}>{skill.name}</span>
              <span style={{ fontSize: 14, color: "#0ea5e9" }}>{skill.level}%</span>
            </div>
            <div className="skill-bar">
              <div className="skill-fill" style={{ width: `${skill.level}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Database & Tools type
  if (content.databases || content.tools) {
    return (
      <div>
        {content.databases && (
          <>
            <h3 style={{ fontSize: 20, color: "#00ffff", marginBottom: 16 }}>Databases</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {content.databases.map((db: any, i: number) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#ffffff" }}>{db.name}</span>
                    <span style={{ fontSize: 14, color: "#0ea5e9" }}>{db.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-fill" style={{ width: `${db.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {content.tools && (
          <>
            <h3 style={{ fontSize: 20, color: "#00ffff", marginBottom: 16 }}>Tools</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {content.tools.map((tool: any, i: number) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#ffffff" }}>{tool.name}</span>
                    <span style={{ fontSize: 14, color: "#0ea5e9" }}>{tool.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-fill" style={{ width: `${tool.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Mobile & Other type
  if (content.mobile || content.libraries) {
    return (
      <div>
        {content.mobile && (
          <>
            <h3 style={{ fontSize: 20, color: "#00ffff", marginBottom: 16 }}>Mobile Development</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {content.mobile.map((skill: any, i: number) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#ffffff" }}>{skill.name}</span>
                    <span style={{ fontSize: 14, color: "#0ea5e9" }}>{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {content.libraries && (
          <>
            <h3 style={{ fontSize: 20, color: "#00ffff", marginBottom: 16 }}>Libraries & Frameworks</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {content.libraries.map((lib: any, i: number) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 20px",
                    background: "rgba(14, 165, 233, 0.15)",
                    borderRadius: 10,
                    border: "1px solid rgba(14, 165, 233, 0.3)",
                    fontSize: 14,
                    color: "#00ffff",
                    fontWeight: 600,
                  }}
                >
                  {lib.name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Projects type
  if (content.projects) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {content.projects.map((project: any, i: number) => (
          <div
            key={i}
            style={{
              padding: 24,
              background: "rgba(14, 165, 233, 0.08)",
              borderRadius: 16,
              border: "2px solid rgba(14, 165, 233, 0.2)",
            }}
          >
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#00ffff", marginBottom: 8 }}>
              {project.name}
            </h3>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 12 }}>{project.tagline}</p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#cbd5e1", marginBottom: 16 }}>
              {project.description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {project.tech.map((tech: string, j: number) => (
                <span
                  key={j}
                  style={{
                    padding: "4px 12px",
                    background: "rgba(14, 165, 233, 0.2)",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#00ffff",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 14, color: "#cbd5e1" }}>
              <strong>Features:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                {project.features.map((feature: string, k: number) => (
                  <li key={k} style={{ marginBottom: 4 }}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Experience type
  if (content.experiences) {
    return (
      <div>
        <h3 style={{ fontSize: 22, color: "#00ffff", marginBottom: 20 }}>Work Experience</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
          {content.experiences.map((exp: any, i: number) => (
            <div
              key={i}
              style={{
                padding: 20,
                background: "rgba(14, 165, 233, 0.08)",
                borderRadius: 12,
                borderLeft: "4px solid #0ea5e9",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginBottom: 4 }}>
                {exp.role}
              </div>
              <div style={{ fontSize: 14, color: "#0ea5e9", marginBottom: 8 }}>
                {exp.company} • {exp.duration}
              </div>
              <p style={{ fontSize: 14, color: "#cbd5e1", marginBottom: 12 }}>{exp.description}</p>
              <ul style={{ fontSize: 13, color: "#94a3b8", paddingLeft: 20 }}>
                {exp.highlights.map((highlight: string, j: number) => (
                  <li key={j} style={{ marginBottom: 4 }}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {content.hackathons && (
          <>
            <h3 style={{ fontSize: 20, color: "#00ffff", marginBottom: 16 }}>Hackathons</h3>
            <ul style={{ fontSize: 14, color: "#cbd5e1", paddingLeft: 20, marginBottom: 32 }}>
              {content.hackathons.map((item: string, i: number) => (
                <li key={i} style={{ marginBottom: 8 }}>✓ {item}</li>
              ))}
            </ul>
          </>
        )}

        {content.openSource && (
          <>
            <h3 style={{ fontSize: 20, color: "#00ffff", marginBottom: 16 }}>Open Source Goals</h3>
            <ul style={{ fontSize: 14, color: "#cbd5e1", paddingLeft: 20 }}>
              {content.openSource.map((item: string, i: number) => (
                <li key={i} style={{ marginBottom: 8 }}>→ {item}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  // Education type
  if (content.education) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {content.education.map((edu: any, i: number) => (
          <div
            key={i}
            style={{
              padding: 24,
              background: "rgba(14, 165, 233, 0.08)",
              borderRadius: 16,
              border: "2px solid rgba(14, 165, 233, 0.2)",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: "#00ffff", marginBottom: 8 }}>
              {edu.degree}
            </div>
            <div style={{ fontSize: 15, color: "#0ea5e9", marginBottom: 4 }}>
              {edu.institution}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
              {edu.duration} {edu.status && `• ${edu.status}`}
            </div>
            <ul style={{ fontSize: 14, color: "#cbd5e1", paddingLeft: 20 }}>
              {edu.highlights.map((highlight: string, j: number) => (
                <li key={j} style={{ marginBottom: 6 }}>✓ {highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  // Certifications type (with images)
  if (content.certs) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {content.certs.map((cert: any, i: number) => (
          <div
            key={i}
            className="cert-card"
            onClick={() => setSelectedCert && setSelectedCert(cert)}
          >
            <div className="cert-badge">NEW</div>
            <img
              src={cert.image}
              alt={cert.name}
              className="cert-image"
            />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", marginBottom: 6 }}>
              {cert.name}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
              {cert.issuer}
            </div>
            <div style={{ fontSize: 12, color: "#0ea5e9", fontWeight: 600 }}>
              📅 {cert.date}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ✅ FIXED: HackerRank stars type - removed JSX badge
  if (content.stars) {
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          {content.stars.map((star: any, i: number) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: "rgba(14, 165, 233, 0.1)",
                borderRadius: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>{star.lang}</span>
              <span style={{ fontSize: 20, color: "#f59e0b" }}>{star.value}</span>
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ fontSize: 20, color: "#00ffff", marginBottom: 16 }}>Badges</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {content.badges.map((badge: string, i: number) => (
              <div
                key={i}
                style={{
                  padding: "8px 16px",
                  background: "rgba(14, 165, 233, 0.2)",
                  borderRadius: 20,
                  fontSize: 14,
                  color: "#00ffff",
                  border: "1px solid rgba(14, 165, 233, 0.4)",
                }}
              >
                ✓ {badge}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Achievements stats type
  if (content.stats) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        {content.stats.map((stat: any, i: number) => (
          <div
            key={i}
            style={{
              padding: 24,
              background: "rgba(14, 165, 233, 0.1)",
              borderRadius: 16,
              textAlign: "center",
              border: "2px solid rgba(14, 165, 233, 0.3)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>{stat.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#00ffff", marginBottom: 8 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 14, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default fallback
  return <div style={{ color: "#cbd5e1", padding: 20 }}>Content type not supported</div>;
}