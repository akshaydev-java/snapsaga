import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Eye, MessageSquare, ClipboardList, X, Users, Video, ShieldCheck, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);

  const [activeTab, setActiveTab] = useState('users');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [responses, setResponses] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [newSurvey, setNewSurvey] = useState({ title: '', description: '' });

  useEffect(() => {
    if (activeTab === 'inquiries') fetchInquiries();
    if (activeTab === 'surveys') fetchSurveys();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'videos') fetchVideos();
  }, [activeTab]);

  const fetchInquiries = () => api.get('/contact').then(res => setInquiries(res.data)).catch(console.error);
  const fetchSurveys = () => api.get('/surveys').then(res => setSurveys(res.data)).catch(console.error);
  const fetchUsers = () => api.get('/admin/users').then(res => setUsers(res.data)).catch(console.error);
  const fetchVideos = () => api.get('/admin/videos').then(res => setVideos(res.data)).catch(console.error);

  // -- Handlers --
  const grantPremium = async (id) => {
    try {
      await api.post(`/admin/grant-premium/${id}`);
      toast.success('Premium Access Granted');
      fetchUsers();
    } catch {
      toast.error('Failed to grant premium access');
    }
  };

  const updateVideoStatus = async (id, status) => {
    try {
      await api.post(`/admin/videos/${id}/status`, { status });
      toast.success(`Video marked as ${status}`);
      fetchVideos();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteAdminVideo = async (id) => {
    if(!window.confirm('Delete this video from the system?')) return;
    try {
      await api.delete(`/admin/videos/${id}`);
      toast.success('Video Deleted');
      fetchVideos();
    } catch {
      toast.error('Failed to delete video');
    }
  };

  const deleteInquiry = async (id) => {
    if(window.confirm('Delete this inquiry?')) {
      await api.delete(`/contact/${id}`);
      fetchInquiries();
    }
  };

  const handleDeleteSurvey = async (id) => {
    if(window.confirm('Are you sure you want to delete this survey? All associated responses will also be lost.')) {
      try {
        await api.delete(`/surveys/${id}`);
        fetchSurveys();
      } catch (error) {
        console.error('Error deleting survey:', error);
      }
    }
  };

  const handleCreateSurvey = async (e) => {
    e.preventDefault();
    try {
      await api.post('/surveys', newSurvey);
      setIsCreateModalOpen(false);
      setNewSurvey({ title: '', description: '' });
      fetchSurveys();
    } catch (error) {
      toast.error('Failed to create survey');
    }
  };

  const handleSeed = async () => {
    if(!window.confirm('Populate the database with 15 mock product reviews for analytics demonstration?')) return;
    try {
      const res = await api.post('/admin/seed');
      toast.success(res.data.message || 'Seeding successful!');
      if (activeTab === 'videos') fetchVideos();
    } catch (err) {
      toast.error('Seeding failed');
    }
  };

  const viewResponses = async (survey) => {
    setSelectedSurvey(survey);
    try {
      const res = await api.get(`/surveys/${survey.id}/responses`);
      setResponses(res.data);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar glass-card" style={{borderRight:'none'}}>
        <h2 className="gradient-text outfit" style={{marginBottom:'2rem'}}>Admin Panel</h2>
        <ul style={{display:'flex', flexDirection:'column', gap:'0.5rem', listStyle:'none', padding:0}}>
          <li className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={18} /> Manage Users
          </li>
          <li className={`nav-item ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>
            <Video size={18} /> Content Moderation
          </li>
          <li className={`nav-item ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>
            <MessageSquare size={18} /> Inquiries
          </li>
          <li className={`nav-item ${activeTab === 'surveys' ? 'active' : ''}`} onClick={() => setActiveTab('surveys')}>
            <ClipboardList size={18} /> Surveys
          </li>
        </ul>
      </div>
      
      <div className="admin-content">
        <div className="admin-header glass-card" style={{padding:'1.5rem', marginBottom:'1.5rem'}}>
          <h1 style={{fontSize:'1.5rem', margin:0}}>
            {activeTab === 'users' && 'System Users'}
            {activeTab === 'videos' && 'Content Moderation'}
            {activeTab === 'inquiries' && 'Contact Inquiries'}
            {activeTab === 'surveys' && 'Manage Surveys'}
          </h1>
          {activeTab === 'surveys' && (
            <button className="btn-wow" onClick={() => setIsCreateModalOpen(true)} style={{padding:'0.5rem 1rem'}}>
              <Plus size={18} style={{marginRight: '0.4rem'}} /> Create
            </button>
          )}
          <button className="btn-outline" onClick={handleSeed} style={{padding:'0.5rem 1rem', marginLeft:'auto', borderColor:'var(--secondary)', color:'var(--secondary)'}}>
              <RefreshCcw size={16} style={{marginRight:'8px'}}/> Seed Mock Data
          </button>
        </div>

        <div className="glass-card table-container" style={{padding:'1px', overflow:'hidden', minHeight:'500px'}}>
            {/* USERS TAB */}
            {activeTab === 'users' && (
              <table className="styled-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Access</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.firstName} {u.lastName}</td>
                      <td>{u.email}</td>
                      <td>{u.roles?.map(r => r.name).join(', ')}</td>
                      <td>
                         {u.hasPaidAccess ? <span style={{color:'#10b981'}}>Premium</span> : <span style={{color:'#ef4444'}}>Free</span>}
                         {u.purchasePlan && <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>{u.purchasePlan}</div>}
                      </td>
                      <td>
                        {!u.hasPaidAccess ? (
                          <button onClick={() => grantPremium(u.id)} className="btn-outline" style={{padding:'0.4rem 0.8rem', fontSize:'0.85rem'}}>
                             <ShieldCheck size={14} style={{marginRight:'4px'}}/> Grant Premium
                          </button>
                        ) : (
                          <span style={{color:'var(--text-muted)'}}>Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* VIDEOS MODERATION TAB */}
            {activeTab === 'videos' && (
              <table className="styled-table">
                <thead><tr><th>Video</th><th>User</th><th>Status</th><th>Score</th><th>Moderation</th></tr></thead>
                <tbody>
                  {videos.map(v => (
                    <tr key={v.id}>
                      <td>
                         <strong>{v.title || 'Untitled'}</strong>
                         <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{v.category}</div>
                      </td>
                      <td>{v.email}</td>
                      <td>{v.status}</td>
                      <td>{v.sentimentScore ? v.sentimentScore.toFixed(1) : '-'}</td>
                      <td>
                        <div style={{display:'flex', gap:'0.5rem'}}>
                           <button onClick={() => updateVideoStatus(v.id, 'APPROVED')} title="Approve" style={{padding:'0.4rem', border:'1px solid #10b981', background:'transparent', color:'#10b981', borderRadius:'4px', cursor:'pointer'}}><CheckCircle size={14}/></button>
                           <button onClick={() => updateVideoStatus(v.id, 'REJECTED')} title="Reject" style={{padding:'0.4rem', border:'1px solid #ef4444', background:'transparent', color:'#ef4444', borderRadius:'4px', cursor:'pointer'}}><AlertCircle size={14}/></button>
                           <button onClick={() => deleteAdminVideo(v.id)} title="Delete" style={{padding:'0.4rem', border:'1px solid var(--border-light)', background:'transparent', color:'var(--text-sub)', borderRadius:'4px', cursor:'pointer'}}><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <table className="styled-table">
                <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Message</th><th>Actions</th></tr></thead>
                <tbody>
                  {inquiries.map(inq => (
                    <tr key={inq.id}>
                      <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                      <td>{inq.firstName} {inq.lastName}</td>
                      <td>{inq.email}</td>
                      <td title={inq.message}>{inq.message.substring(0, 30)}...</td>
                      <td>
                        <button style={{color:'#ef4444', background:'transparent', border:'none', cursor:'pointer'}} onClick={() => deleteInquiry(inq.id)}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* SURVEYS TAB */}
            {activeTab === 'surveys' && (
              <table className="styled-table">
                <thead><tr><th>Title</th><th>Description</th><th>Created At</th><th>Actions</th></tr></thead>
                <tbody>
                  {surveys.map(s => (
                    <tr key={s.id}>
                      <td style={{fontWeight: 600}}>{s.title}</td>
                      <td>{s.description}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <button className="btn-outline" style={{padding:'0.3rem 0.6rem'}} onClick={() => viewResponses(s)}>
                            <Eye size={14} style={{marginRight: '0.2rem'}}/> View
                          </button>
                          <button style={{color:'#ef4444', background:'transparent', border:'none', cursor:'pointer'}} onClick={() => handleDeleteSurvey(s.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>

      {/* Modals from before remain unchanged essentially */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1.5rem'}}>
              <h2 style={{margin:0}}>New Survey</h2>
              <X size={24} style={{cursor:'pointer'}} onClick={() => setIsCreateModalOpen(false)} />
            </div>
            <form onSubmit={handleCreateSurvey}>
              <div style={{marginBottom:'1rem'}}>
                <label style={{display:'block', marginBottom:'0.5rem'}}>Survey Title</label>
                <input type="text" required placeholder="e.g. User Experience Survey" style={{width:'100%', padding:'0.75rem', borderRadius:'8px'}} value={newSurvey.title} onChange={(e) => setNewSurvey({...newSurvey, title: e.target.value})} />
              </div>
              <div style={{marginBottom:'1rem'}}>
                <label style={{display:'block', marginBottom:'0.5rem'}}>Description</label>
                <textarea rows="4" required placeholder="Describe the goal of this survey..." style={{width:'100%', padding:'0.75rem', borderRadius:'8px'}} value={newSurvey.description} onChange={(e) => setNewSurvey({...newSurvey, description: e.target.value})}></textarea>
              </div>
              <div style={{display:'flex', gap:'1rem', justifyContent:'flex-end'}}>
                <button type="button" className="btn-outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-wow">Create Survey</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{maxWidth: '900px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1.5rem'}}>
              <h2 style={{margin:0}}>Responses: {selectedSurvey?.title}</h2>
              <X size={24} style={{cursor:'pointer'}} onClick={() => setIsViewModalOpen(false)} />
            </div>
            {responses.length === 0 ? (
              <p style={{padding: '3rem', textAlign:'center', color:'var(--text-muted)'}}>No video responses yet for this survey.</p>
            ) : (
              <div className="dashboard-grid">
                {responses.map(res => (
                  <div key={res.id} style={{padding:'1rem', border:'1px solid var(--border-light)', borderRadius:'8px'}}>
                    <video controls src={`http://localhost:8081${res.videoPath}`} style={{width:'100%', borderRadius:'4px'}} />
                    <p style={{fontSize:'0.85rem', color:'var(--text-sub)', marginTop:'0.5rem'}}>Submitted: {new Date(res.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
