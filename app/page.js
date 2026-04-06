'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

function CountdownCircle({ radius = 38, offset }) {
    const circumference = 2 * Math.PI * radius;
    return (
        <svg>
            <circle 
                cx="40" cy="40" r={radius} 
                style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
            />
        </svg>
    )
}

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    // Countdown State
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    
    // FAQ State
    const [activeFaq, setActiveFaq] = useState(null)

    // Form State
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', track: ''
    })
    const [members, setMembers] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const eventDate = new Date("Nov 6, 2026 09:00:00").getTime();
        
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            })
        }, 1000);

        return () => clearInterval(timer)
    }, [])

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index)
    }

    const openModalWithTrack = (trackName = '') => {
        setFormData(prev => ({ ...prev, track: trackName }))
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setFormData({ name: '', email: '', phone: '', track: '' })
        setMembers([])
    }

    const addMember = () => {
        if (members.length >= 4) {
            alert("Maximum 4 additional team members allowed.");
            return;
        }
        setMembers([...members, { id: Date.now(), name: '', email: '', phone: '' }])
    }

    const removeMember = (id) => {
        setMembers(members.filter(m => m.id !== id))
    }

    const handleMainChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleMemberChange = (id, field, value) => {
        setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    track: formData.track,
                    members: members.map(m => ({ name: m.name, email: m.email, phone: m.phone }))
                })
            })

            const result = await response.json()

            if (response.ok) {
                alert(`✅ Registration Successful!\n\nYour Team ID is: ${result.teamId}\n\nPlease save this ID for future reference.`);
                closeModal()
            } else {
                alert("❌ Error: " + result.error);
            }
        } catch (error) {
            console.error('Submit error:', error)
            alert("❌ Could not connect to the server. Please ensure the backend is running.");
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCardMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xCenter = rect.width / 2;
        const yCenter = rect.height / 2;
        
        const rotateX = ((y - yCenter) / yCenter) * -10;
        const rotateY = ((x - xCenter) / xCenter) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }

    const handleCardMouseLeave = (e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }

    // Helper to calculate circle offset
    const getOffset = (val, max) => {
        const circumference = 2 * Math.PI * 38;
        return circumference - (val / max * circumference);
    }

    return (
        <div className={styles.container}>
            {/* Background Elements */}
            <div className={styles.bgGrid}></div>
            <div className={`${styles.orb} ${styles.orb1}`}></div>
            <div className={`${styles.orb} ${styles.orb2}`}></div>
            <div className={`${styles.orb} ${styles.orb3}`}></div>
            <div className={styles.scanline}></div>

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <img src="https://www.krmangalam.edu.in/wp-content/uploads/2025/11/KRMU-Logo-NAAC.webp" alt="KRMU Logo" className={styles.logoImg} />
                </div>
                
                <nav className={styles.navLinks}>
                    <a href="#home">Home</a>
                    <a href="#tracks">Tracks</a>
                    <a href="#schedule">Schedule</a>
                    <a href="#faq">FAQ</a>
                </nav>

                <div className={styles.navButtons}>
                    <a href="#faq" className={`${styles.btn} ${styles.btnGhost}`}>FAQ</a>
                    <div className={styles.dropdownContainer}>
                        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => openModalWithTrack('')}>
                            Register <span>▼</span>
                        </button>
                        <div className={styles.dropdownContent}>
                            <a className={styles.dropdownItem} onClick={() => openModalWithTrack('Artificial Intelligence')}>Artificial Intelligence</a>
                            <a className={styles.dropdownItem} onClick={() => openModalWithTrack('Web 3.0 & Blockchain')}>Web 3.0 & Blockchain</a>
                            <a className={styles.dropdownItem} onClick={() => openModalWithTrack('Smart Mobility')}>Smart Mobility</a>
                            <a className={styles.dropdownItem} onClick={() => openModalWithTrack('Robotics & IoT')}>Robotics & IoT</a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className={styles.hero} id="home">
                <img src="https://www.krmangalam.edu.in/wp-content/uploads/2025/11/KRMU-Logo-NAAC.webp" alt="KRMU Logo" className={styles.collegeLogoTop} />
                
                <div className={styles.heroSubtitle}>K.R. Mangalam University Presents</div>
                <h1 className={styles.heroTitle}>IDEAS 4.0</h1>
                <div className={styles.heroTagline}>Innovation • Design • Engineering • Application • Science</div>
                <h3 className={styles.heroDate}>6-7 November 2026</h3>

                <div className={styles.heroInfoBox}>
                    <p>IDEAS 4.0 is KRMU's flagship mega fest—a celebration of innovation, academic excellence, and cultural vibrancy. Featuring <strong>120 canopies</strong>, <strong>28 intense competitions</strong>, and a massive prize pool of <strong>₹10 Lakhs</strong>, we bring together over <strong>18,000 participants</strong> to shape the future.</p>
                    <span className={styles.highlight}>JOIN THE LEGACY.</span>
                </div>

                {/* Countdown */}
                <div className={styles.countdownContainer}>
                    <div className={styles.countBox}>
                        <CountdownCircle offset={getOffset(timeLeft.days, 365)} />
                        <div className={styles.countContent}>
                            <div className={styles.countVal}>{String(timeLeft.days).padStart(3, '0')}</div>
                            <div className={styles.countLabel}>Days</div>
                        </div>
                    </div>
                    <div className={styles.countBox}>
                        <CountdownCircle offset={getOffset(timeLeft.hours, 24)} />
                        <div className={styles.countContent}>
                            <div className={styles.countVal}>{String(timeLeft.hours).padStart(2, '0')}</div>
                            <div className={styles.countLabel}>Hours</div>
                        </div>
                    </div>
                    <div className={styles.countBox}>
                        <CountdownCircle offset={getOffset(timeLeft.minutes, 60)} />
                        <div className={styles.countContent}>
                            <div className={styles.countVal}>{String(timeLeft.minutes).padStart(2, '0')}</div>
                            <div className={styles.countLabel}>Mins</div>
                        </div>
                    </div>
                    <div className={styles.countBox}>
                        <CountdownCircle offset={getOffset(timeLeft.seconds, 60)} />
                        <div className={styles.countContent}>
                            <div className={styles.countVal}>{String(timeLeft.seconds).padStart(2, '0')}</div>
                            <div className={styles.countLabel}>Secs</div>
                        </div>
                    </div>
                </div>

                <a href="#tracks" className={`${styles.btn} ${styles.btnPrimary}`} style={{ fontSize: '1.1rem', padding: '15px 40px' }}>
                    Explore Tracks →
                </a>
            </section>

            {/* Tracks Section */}
            <section id="tracks" className={styles.section}>
                <h2 className={styles.sectionTitle}>Event <span>Tracks</span></h2>
                <div className={styles.tracksGrid}>
                    <div className={styles.trackCard} onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
                        <div className={styles.trackInner}></div>
                        <div className={styles.trackIcon}>🧠</div>
                        <h3>Artificial Intelligence</h3>
                        <p>Explore deep learning, neural networks, and the future of intelligent machines.</p>
                    </div>
                    <div className={styles.trackCard} onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
                        <div className={styles.trackInner}></div>
                        <div className={styles.trackIcon}>💻</div>
                        <h3>Web 3.0 & Blockchain</h3>
                        <p>Decentralized applications, smart contracts, and the future of the internet.</p>
                    </div>
                    <div className={styles.trackCard} onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
                        <div className={styles.trackInner}></div>
                        <div className={styles.trackIcon}>🚗</div>
                        <h3>Smart Mobility</h3>
                        <p>Electric vehicles, autonomous driving, and next-gen transport solutions.</p>
                    </div>
                    <div className={styles.trackCard} onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
                        <div className={styles.trackInner}></div>
                        <div className={styles.trackIcon}>🤖</div>
                        <h3>Robotics & IoT</h3>
                        <p>Automation, smart devices, and bridging the gap between digital and physical.</p>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section id="schedule" className={`${styles.section} ${styles.scheduleSection}`}>
                <h2 className={styles.sectionTitle}>Event <span>Schedule</span></h2>
                <div className={styles.timelineContainer}>
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDot}></div>
                        <div className={styles.timelineContent}>
                            <div className={styles.timelineDate}>Nov 6, 2026 - 09:00 AM</div>
                            <h3>Opening Ceremony</h3>
                            <p>Grand inauguration by industry leaders and keynote speakers.</p>
                        </div>
                    </div>
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDot}></div>
                        <div className={styles.timelineContent}>
                            <div className={styles.timelineDate}>Nov 7, 2026 - 10:00 AM</div>
                            <h3>Hackathon & Workshops</h3>
                            <p>24-hour coding challenge and hands-on tech workshops.</p>
                        </div>
                    </div>
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDot}></div>
                        <div className={styles.timelineContent}>
                            <div className={styles.timelineDate}>Nov 8, 2026 - 04:00 PM</div>
                            <h3>Project Showcase & Awards</h3>
                            <p>Final presentations and prize distribution ceremony.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className={`${styles.section} ${styles.faqSection}`}>
                <h2 className={styles.sectionTitle}>Frequently Asked <span>Questions</span></h2>
                <div className={styles.faqContainer}>
                    {[
                        { q: "Who can participate in IDEAS 4.0?", a: "IDEAS 4.0 is open to all university students across India. Both undergraduate and postgraduate students from any discipline are welcome to register and showcase their innovative ideas." },
                        { q: "Is there a registration fee?", a: "No, participation in IDEAS 4.0 is completely free. The university provides accommodation and food for all selected participants during the fest days." },
                        { q: "What should I bring to the event?", a: "Participants should bring their college ID card, laptop, chargers, and any specific hardware required for their project. We will provide Wi-Fi, power strips, and basic prototyping tools." },
                        { q: "Can I participate individually?", a: "Yes, you can register individually. However, we encourage team participation (2-4 members) to foster collaboration. If you register alone, we can help you find teammates during the team formation session." }
                    ].map((faq, idx) => (
                        <div key={idx} className={`${styles.faqItem} ${activeFaq === idx ? styles.active : ''}`}>
                            <div className={styles.faqQuestion} onClick={() => toggleFaq(idx)}>
                                {faq.q} <span style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: '0.3s' }}>▼</span>
                            </div>
                            <div className={styles.faqAnswer}>
                                <p>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>© 2026 K.R. Mangalam University | IDEAS 4.0 Team. All Rights Reserved.</p>
                <Link href="/dashboard" className={styles.footerLink}>
                    🔒 Admin Dashboard
                </Link>
            </footer>

            {/* Registration Modal */}
            {isModalOpen && (
                <div className={styles.modal} onClick={(e) => { if(e.target.classList.contains(styles.modal)) closeModal() }}>
                    <div className={styles.modalContent}>
                        <span className={styles.closeBtn} onClick={closeModal}>&times;</span>
                        <h2>Register Your Team</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="name" placeholder="Team Leader Name" value={formData.name} onChange={handleMainChange} required />
                            <input type="email" name="email" placeholder="Email Address (@krmu.edu.in)" pattern=".+@krmu\.edu\.in$" title="Please use your official @krmu.edu.in email address" value={formData.email} onChange={handleMainChange} required />
                            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleMainChange} required />
                            
                            <select name="track" value={formData.track} onChange={handleMainChange} required>
                                <option value="" disabled>Select Track</option>
                                <option value="Artificial Intelligence">Artificial Intelligence</option>
                                <option value="Web 3.0 & Blockchain">Web 3.0 & Blockchain</option>
                                <option value="Smart Mobility">Smart Mobility</option>
                                <option value="Robotics & IoT">Robotics & IoT</option>
                            </select>

                            <div className={styles.teamMembersContainer}>
                                {members.map((m, index) => (
                                    <div key={m.id} className={styles.memberBlock}>
                                        <div className={styles.removeMember} onClick={() => removeMember(m.id)}>✖</div>
                                        <h4>Team Member {index + 1}</h4>
                                        <input type="text" placeholder="Member Name" value={m.name} onChange={(e) => handleMemberChange(m.id, 'name', e.target.value)} required />
                                        <input type="email" placeholder="Member Email (@krmu.edu.in)" pattern=".+@krmu\.edu\.in$" title="Please use your official @krmu.edu.in email address" value={m.email} onChange={(e) => handleMemberChange(m.id, 'email', e.target.value)} required />
                                        <input type="tel" placeholder="Member Phone" value={m.phone} onChange={(e) => handleMemberChange(m.id, 'phone', e.target.value)} required />
                                    </div>
                                ))}
                            </div>

                            {members.length < 4 && (
                                <button type="button" className={styles.btnSecondary} onClick={addMember}>
                                    + Add Team Member (Max 4)
                                </button>
                            )}

                            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '100%', marginTop: '10px' }} disabled={isSubmitting}>
                                {isSubmitting ? 'Registering...' : 'Submit Registration'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
