'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './dashboard.module.css'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const ADMIN_PASS = "ideas2026"

export default function Dashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [passwordInput, setPasswordInput] = useState('')
    const [showError, setShowError] = useState(false)
    const [registrations, setRegistrations] = useState([])
    const authBoxRef = useRef(null)

    // Stats
    const total = registrations.length
    const stats = {
        total,
        ai: registrations.filter(r => r.track && r.track.includes("Artificial Intelligence")).length,
        web3: registrations.filter(r => r.track && r.track.includes("Web 3.0")).length,
        mobility: registrations.filter(r => r.track && r.track.includes("Mobility")).length,
        robotics: registrations.filter(r => r.track && r.track.includes("Robotics")).length
    }

    const checkPassword = () => {
        if (passwordInput === ADMIN_PASS) {
            setIsAuthenticated(true)
            fetchRegistrations()
        } else {
            setShowError(true)
            setPasswordInput('')
            
            // Shake animation for error
            if (authBoxRef.current) {
                authBoxRef.current.style.transform = 'translate(5px, 0)'
                setTimeout(() => { if(authBoxRef.current) authBoxRef.current.style.transform = 'translate(-5px, 0)' }, 50)
                setTimeout(() => { if(authBoxRef.current) authBoxRef.current.style.transform = 'translate(5px, 0)' }, 100)
                setTimeout(() => { if(authBoxRef.current) authBoxRef.current.style.transform = 'translate(0, 0)' }, 150)
            }
        }
    }

    const handleEncrypt = (e) => {
        if (e.key === "Enter") {
            checkPassword()
        }
    }

    const fetchRegistrations = async () => {
        try {
            const res = await fetch('/api/registrations')
            const data = await res.json()
            setRegistrations(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error fetching data:', err)
        }
    }

    const exportTableToCSV = (filename) => {
        let csv = []
        const rows = document.querySelectorAll("table tr")
        
        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll("td, th")
            for (let j = 0; j < cols.length; j++) 
                row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"')
            csv.push(row.join(","))
        }

        const csvFile = new Blob([csv.join("\n")], {type: "text/csv"})
        const downloadLink = document.createElement("a")
        downloadLink.download = filename
        downloadLink.href = window.URL.createObjectURL(csvFile)
        downloadLink.style.display = "none"
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    const exportTableToPDF = (filename) => {
        const doc = new jsPDF('landscape')
        
        doc.setFontSize(16)
        doc.text("IDEAS 4.0 - Registration Dashboard", 14, 15)
        
        autoTable(doc, {
            html: '#regTable',
            startY: 25,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [0, 243, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [240, 240, 240] }
        })

        doc.save(filename)
    }

    const renderMembersHtml = (membersJSON) => {
        if (!membersJSON) return "None"
        try {
            const parsedMembers = JSON.parse(membersJSON)
            if (parsedMembers.length > 0) {
                return (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {parsedMembers.map((mem, index) => (
                            <li key={index}>{mem.name} ({mem.phone})</li>
                        ))}
                    </ul>
                )
            }
        } catch (e) {
            console.error("Error parsing members:", e)
        }
        return "None"
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.authOverlay}>
                    <div className={styles.authBox} ref={authBoxRef}>
                        <h2 className={styles.authTitle}>Admin Access Required</h2>
                        <p className={styles.authSub}>Please enter the dashboard password to view registrations.</p>
                        <input 
                            type="password" 
                            placeholder="Enter Password" 
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            onKeyDown={handleEncrypt}
                        />
                        <button onClick={checkPassword}>Unlock Dashboard</button>
                        {showError && <div className={styles.errorMsg}>Incorrect password. Access Denied.</div>}
                        <Link href="/" className={styles.backLink}>← Go back to main site</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>

            <div className={styles.mainContent}>
                <div className={styles.headerControls}>
                    <Link href="/" className={styles.btnBack}>← Back to Home</Link>
                    <div>
                        <button className={styles.btnExport} onClick={() => exportTableToCSV('Ideas_Registrations.csv')}>Export CSV</button>
                        <button className={`${styles.btnExport}`} style={{ background: '#bc13fe', marginLeft: '10px' }} onClick={() => exportTableToPDF('Ideas_Registrations.pdf')}>Export PDF</button>
                    </div>
                </div>
                <h1 className={styles.heading}>Registration Dashboard</h1>
                
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.total}</div>
                        <div className={styles.statLabel}>Total Teams</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.ai}</div>
                        <div className={styles.statLabel}>AI Track</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.web3}</div>
                        <div className={styles.statLabel}>Web 3.0 Track</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.mobility}</div>
                        <div className={styles.statLabel}>Mobility Track</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.robotics}</div>
                        <div className={styles.statLabel}>Robotics Track</div>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <table id="regTable">
                        <thead>
                            <tr>
                                <th>Team ID</th>
                                <th>Team Leader</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Track</th>
                                <th>Team Members</th>
                                <th>Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No registrations yet.</td></tr>
                            ) : (
                                registrations.map(reg => {
                                    // Parse Firestore ISO string
                                    const dateObj = new Date(reg.timestamp)
                                    const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString()

                                    return (
                                        <tr key={reg.id}>
                                            <td><strong>{reg.teamId || 'N/A'}</strong></td>
                                            <td>{reg.name}</td>
                                            <td>{reg.email}</td>
                                            <td>{reg.phone}</td>
                                            <td>{reg.track}</td>
                                            <td>{renderMembersHtml(reg.membersJSON)}</td>
                                            <td>{formattedDate}</td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
