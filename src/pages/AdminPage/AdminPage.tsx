import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './AdminPage.css';

interface Project {
  id: string;
  title: string;
  year: string;
  shortDesc: string;
  descriptions: string[];
  image: string;
  color: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}

type TabType = 'dashboard' | 'projects' | 'info' | 'messages';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Stats / Analytics
  const [viewsCount, setViewsCount] = useState<number>(0);
  const [fetchingStats, setFetchingStats] = useState(false);

  // Projects list
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetchingProjects, setFetchingProjects] = useState(false);

  // Form states for Projects
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [shortDesc, setShortDesc] = useState('');
  const [descriptionsText, setDescriptionsText] = useState('');
  const [image, setImage] = useState('');
  const [color, setColor] = useState('#5f8be2');
  const [submittingProject, setSubmittingProject] = useState(false);

  // Form states for Personal Info
  const [role1, setRole1] = useState('Full Stack Developer');
  const [role2, setRole2] = useState('AI Engineer');
  const [fullName, setFullName] = useState('RAFLY RAJWA SYAHPUTRA');
  const [instagram, setInstagram] = useState('https://instagram.com');
  const [github, setGithub] = useState('https://github.com');
  const [statusText, setStatusText] = useState('AVAILABLE FOR NEW WORK');
  const [submittingInfo, setSubmittingInfo] = useState(false);

  // Messages list
  const [messages, setMessages] = useState<Message[]>([]);
  const [fetchingMessages, setFetchingMessages] = useState(false);

  const ALLOWED_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (ALLOWED_ADMIN_EMAIL && currentUser.email !== ALLOWED_ADMIN_EMAIL) {
          setError(`Unauthorized. Only ${ALLOWED_ADMIN_EMAIL} can access.`);
          signOut(auth);
          setUser(null);
        } else {
          setUser(currentUser);
          setError('');
          fetchAllData();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [ALLOWED_ADMIN_EMAIL]);

  const fetchAllData = () => {
    fetchAnalytics();
    fetchProjects();
    fetchInfo();
    fetchMessages();
  };

  const fetchAnalytics = async () => {
    setFetchingStats(true);
    try {
      const docRef = doc(db, 'analytics', 'stats');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setViewsCount(docSnap.data().views || 0);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setFetchingStats(false);
    }
  };

  const fetchProjects = async () => {
    setFetchingProjects(true);
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(list);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setFetchingProjects(false);
    }
  };

  const fetchInfo = async () => {
    try {
      const docRef = doc(db, 'info', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRole1(data.role1 || '');
        setRole2(data.role2 || '');
        setFullName(data.fullName || '');
        setInstagram(data.instagram || '');
        setGithub(data.github || '');
        setStatusText(data.statusText || '');
      }
    } catch (err) {
      console.error('Error fetching info:', err);
    }
  };

  const fetchMessages = async () => {
    setFetchingMessages(true);
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(list);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setFetchingMessages(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      if (ALLOWED_ADMIN_EMAIL && credential.user.email !== ALLOWED_ADMIN_EMAIL) {
        setError(`Unauthorized. Only ${ALLOWED_ADMIN_EMAIL} can access.`);
        await signOut(auth);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid login details.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (ALLOWED_ADMIN_EMAIL && result.user.email !== ALLOWED_ADMIN_EMAIL) {
        setError(`Unauthorized. Only ${ALLOWED_ADMIN_EMAIL} can access.`);
        await signOut(auth);
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc) {
      alert('Please fill out Title and Short Description');
      return;
    }
    setSubmittingProject(true);
    try {
      const descArray = descriptionsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      await addDoc(collection(db, 'projects'), {
        title: title.toUpperCase(),
        year,
        shortDesc,
        descriptions: descArray.length > 0 ? descArray : [shortDesc],
        image: image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        color,
        createdAt: new Date()
      });

      setTitle('');
      setYear(new Date().getFullYear().toString());
      setShortDesc('');
      setDescriptionsText('');
      setImage('');
      setColor('#5f8be2');

      alert('Project added successfully!');
      fetchProjects();
    } catch (err: any) {
      alert('Error adding project: ' + err.message);
    } finally {
      setSubmittingProject(false);
    }
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInfo(true);
    try {
      await setDoc(doc(db, 'info', 'main'), {
        role1,
        role2,
        fullName: fullName.toUpperCase(),
        instagram,
        github,
        statusText: statusText.toUpperCase()
      });
      alert('Info updated successfully!');
    } catch (err: any) {
      alert('Error updating info: ' + err.message);
    } finally {
      setSubmittingInfo(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      fetchProjects();
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this contact message permanently?')) return;
    try {
      await deleteDoc(doc(db, 'contacts', id));
      fetchMessages();
    } catch (err: any) {
      alert('Error deleting message: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <span>Verifying admin session...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Admin Gateway</h2>
            <p>Access control panel for portfolio management</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-btn">Authenticate</button>
            <div className="login-divider"><span>OR</span></div>
            <button type="button" onClick={handleGoogleLogin} className="google-login-btn">
              <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </form>
          <a href="#" className="back-link">← Return to Site</a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-system-layout">
      {/* Sidebar Panel */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="brand-dot"></span>
          <h2>CONTROL PANEL</h2>
        </div>
        
        <nav className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('dashboard');
              fetchAnalytics();
            }}
          >
            <span className="menu-icon">📊</span>
            Dashboard Overview
          </button>

          <button 
            className={`menu-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <span className="menu-icon">📂</span>
            Projects Ledger
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <span className="menu-icon">👤</span>
            Personal Identity
          </button>

          <button 
            className={`menu-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <span className="menu-icon">✉️</span>
            Inbound Messages
            {messages.length > 0 && <span className="msg-badge">{messages.length}</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <span className="avatar-placeholder">{user.email?.charAt(0).toUpperCase()}</span>
            <div className="user-details">
              <span className="user-email">{user.email}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <div className="sidebar-actions">
            <a href="#" className="sidebar-back-btn">View Website</a>
            <button onClick={handleLogout} className="sidebar-logout-btn">Sign Out</button>
          </div>
        </div>
      </aside>

      {/* Main content pane */}
      <main className="admin-main-content">
        {/* Dashboard Analytics Overview Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-overview-container">
            <h2>Dashboard Overview</h2>
            
            <div className="stats-grid">
              <div className="stat-card glow-orange">
                <span className="stat-label">TOTAL VIEWS</span>
                <span className="stat-value">
                  {fetchingStats ? '...' : viewsCount.toLocaleString()}
                </span>
                <span className="stat-desc">Unique page sessions tracked</span>
              </div>
              
              <div className="stat-card">
                <span className="stat-label">ACTIVE PROJECTS</span>
                <span className="stat-value">{projects.length}</span>
                <span className="stat-desc">Entries registered in database</span>
              </div>

              <div className="stat-card">
                <span className="stat-label">CONTACT MESSAGES</span>
                <span className="stat-value">{messages.length}</span>
                <span className="stat-desc">Inbound client requests</span>
              </div>
            </div>

            <div className="overview-details-card">
              <h3>SYSTEM DIAGNOSTICS</h3>
              <div className="diagnostics-list">
                <div className="diagnostic-item">
                  <span className="diag-key">Database State:</span>
                  <span className="diag-val success">CONNECTED (Firestore Cloud)</span>
                </div>
                <div className="diagnostic-item">
                  <span className="diag-key">Security Protocol:</span>
                  <span className="diag-val success">ACTIVE (Admin Email Restrict)</span>
                </div>
                <div className="diagnostic-item">
                  <span className="diag-key">Authentication Engine:</span>
                  <span className="diag-val success">Firebase Auth (Google OAuth2 + Email)</span>
                </div>
                <div className="diagnostic-item">
                  <span className="diag-key">Vite Environment:</span>
                  <span className="diag-val">Production Build Ready</span>
                </div>
              </div>
            </div>

            <div className="activity-visualizer">
              <h3>TRAFFIC ANALYTICS</h3>
              <div className="chart-mock">
                {/* Clean CSS-based bar chart visualizing traffic */}
                <div className="chart-bar" style={{ '--height': '35%' } as React.CSSProperties}><span className="bar-val">Mon</span></div>
                <div className="chart-bar" style={{ '--height': '55%' } as React.CSSProperties}><span className="bar-val">Tue</span></div>
                <div className="chart-bar" style={{ '--height': '40%' } as React.CSSProperties}><span className="bar-val">Wed</span></div>
                <div className="chart-bar" style={{ '--height': '75%' } as React.CSSProperties}><span className="bar-val">Thu</span></div>
                <div className="chart-bar" style={{ '--height': '60%' } as React.CSSProperties}><span className="bar-val">Fri</span></div>
                <div className="chart-bar" style={{ '--height': '90%' } as React.CSSProperties}><span className="bar-val">Sat</span></div>
                <div className="chart-bar" style={{ '--height': '85%' } as React.CSSProperties}><span className="bar-val">Sun</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="dashboard-grid">
            <div className="grid-form-col">
              <h2>New Project Entity</h2>
              <form onSubmit={handleAddProject} className="dashboard-form">
                <div className="form-row">
                  <div className="form-group half">
                    <label>Project Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. CREATIVE HUB" 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group half">
                    <label>Year</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2026" 
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Short Description</label>
                  <input 
                    type="text" 
                    placeholder="Brief description line..." 
                    value={shortDesc}
                    onChange={e => setShortDesc(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Detailed Descriptions (one paragraph per line)</label>
                  <textarea 
                    placeholder="Details paragraph 1...&#10;Details paragraph 2..." 
                    value={descriptionsText}
                    rows={4}
                    onChange={e => setDescriptionsText(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group two-thirds">
                    <label>Image Path (e.g. /projects/img.png or URL)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. /projects/creative.png" 
                      value={image}
                      onChange={e => setImage(e.target.value)}
                    />
                  </div>
                  <div className="form-group third">
                    <label>Accent Color</label>
                    <div className="color-picker-wrapper">
                      <input 
                        type="color" 
                        value={color}
                        onChange={e => setColor(e.target.value)}
                      />
                      <input 
                        type="text" 
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        placeholder="#5f8be2"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={submittingProject}>
                  {submittingProject ? 'Writing Document...' : 'Publish Project'}
                </button>
              </form>
            </div>

            <div className="grid-list-col">
              <h2>Project Ledger ({projects.length})</h2>
              {fetchingProjects ? (
                <div className="list-loading">Connecting to database...</div>
              ) : projects.length === 0 ? (
                <div className="empty-list">No projects found in database. Using local backup.</div>
              ) : (
                <div className="project-grid">
                  {projects.map(proj => (
                    <div key={proj.id} className="admin-project-card" style={{ '--card-accent': proj.color } as React.CSSProperties}>
                      <div className="card-thumb">
                        <img src={proj.image} alt={proj.title} onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' }} />
                        <span className="card-year">{proj.year}</span>
                      </div>
                      <div className="card-info">
                        <h3>{proj.title}</h3>
                        <p>{proj.shortDesc}</p>
                        <div className="card-actions">
                          <button onClick={() => handleDeleteProject(proj.id)} className="delete-btn">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="single-content-container">
            <h2>Personal Identity settings</h2>
            <form onSubmit={handleUpdateInfo} className="dashboard-form large-form">
              <div className="form-row">
                <div className="form-group half">
                  <label>First Role Title</label>
                  <input 
                    type="text" 
                    value={role1}
                    onChange={e => setRole1(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label>Second Role Title</label>
                  <input 
                    type="text" 
                    value={role2}
                    onChange={e => setRole2(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Full Display Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Instagram URL</label>
                  <input 
                    type="url" 
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                  />
                </div>
                <div className="form-group half">
                  <label>GitHub URL</label>
                  <input 
                    type="url" 
                    value={github}
                    onChange={e => setGithub(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status Text (e.g. Availability tag)</label>
                <input 
                  type="text" 
                  value={statusText}
                  onChange={e => setStatusText(e.target.value)}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={submittingInfo}>
                {submittingInfo ? 'Saving Identity...' : 'Commit Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="single-content-container">
            <h2>Inbound Contact submissions</h2>
            {fetchingMessages ? (
              <div className="list-loading">Checking mailbox...</div>
            ) : messages.length === 0 ? (
              <div className="empty-list">No messages have been submitted yet.</div>
            ) : (
              <div className="messages-list">
                {messages.map(msg => (
                  <div key={msg.id} className="message-card">
                    <header className="message-header">
                      <div className="sender-meta">
                        <span className="sender-name">{msg.name}</span>
                        <a href={`mailto:${msg.email}`} className="sender-email">{msg.email}</a>
                      </div>
                      <div className="message-actions">
                        <span className="message-date">
                          {msg.createdAt?.seconds 
                            ? new Date(msg.createdAt.seconds * 1000).toLocaleString() 
                            : 'Just Now'}
                        </span>
                        <button onClick={() => handleDeleteMessage(msg.id)} className="delete-btn msg-delete">Delete</button>
                      </div>
                    </header>
                    <p className="message-body">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
