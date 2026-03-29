import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, MoreVertical, Play, Trash2, Download, 
  ChevronRight, Calendar, Tag, Shield, Clock, AlertCircle, RefreshCcw, Video, Star
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';



export default function ReviewDashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [summary, setSummary] = useState({
      totalVideos: 0,
      totalUsers: 0,
      averageRating: 0,
      pendingReviews: 0,
      approvedReviews: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, vidRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/review-videos/my')
      ]);
      
      // Defensive check for summary data
      if (sumRes.data && typeof sumRes.data === 'object') {
          setSummary(sumRes.data);
      }
      
      // Defensive check for video list
      if (Array.isArray(vidRes.data)) {
          setVideos(vidRes.data);
      }
    } catch (err) {
      console.error('Sync failed:', err);
      toast.error('Failed to sync dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
      try {
          toast.loading('Seeding sample data...', { id: 'seed' });
          await api.post('/dashboard/seed');
          toast.success('Samples added! Refreshing...', { id: 'seed' });
          fetchData();
      } catch (err) {
          toast.error('Sync error. Try again later.', { id: 'seed' });
      }
  };

  const handleDelete = async (id) => {
      if (!window.confirm('Delete this review record?')) return;
      try {
          await api.delete(`/review-videos/${id}`);
          toast.success('Deleted');
          fetchData();
      } catch (err) {
          toast.error('Deletion failed');
      }
  };

  const filteredVideos = videos.filter(v => {
      const matchesSearch = (v.productName?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                           (v.reviewerName?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                           (v.title?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'All' || v.category === filterCategory;
      return matchesSearch && matchesCategory;
  });

  const getStatusStyle = (status) => {
      switch (status?.toUpperCase()) {
          case 'APPROVED': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
          case 'REJECTED': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
          default: return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
      }
  };

  if (loading) return (
      <div className="flex-center" style={{height:'80vh', flexDirection:'column', gap:'1.5rem'}}>
          <div className="rd-spin" style={{width:'48px', height:'48px', border:'4px solid var(--primary-soft)', borderTopColor:'var(--primary)', borderRadius:'50%'}}></div>
          <p style={{color:'var(--text-sub)', fontWeight:500}}>Synchronizing Hub...</p>
      </div>
  );

  return (
    <div className="animate-slide-up">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem'}}>
            <div>
                <h2 style={{fontSize:'2.5rem', marginBottom:'0.5rem', fontWeight:800}}>Data <span className="gradient-text">Command</span></h2>
                <p style={{color:'var(--text-sub)'}}>Welcome back. Here is your platform overview.</p>
            </div>
            <div style={{display:'flex', gap:'1rem'}}>
                <button className="btn-outline" onClick={handleSeed}>Seed Samples</button>
                <NavLink to="/dashboard/upload" className="btn-wow">
                    <Plus size={18} style={{marginRight:'8px'}}/> New Analysis
                </NavLink>
            </div>
        </div>

        {/* Overview Stats */}
        <div className="dashboard-grid" style={{marginBottom:'2.5rem'}}>
            <div className="glass-card" style={{padding:'2rem'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1.5rem'}}>
                    <div style={{width:'48px', height:'48px', borderRadius:'14px', background:'var(--primary-glow)', color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Video size={24}/>
                    </div>
                    <span style={{fontSize:'0.85rem', color:'#10b981', fontWeight:700}}>+12.5%</span>
                </div>
                <h3 style={{fontSize:'2rem', fontWeight:800, margin:0}}>{summary.totalVideos}</h3>
                <p style={{color:'var(--text-sub)', fontSize:'0.9rem', marginTop:'0.5rem'}}>Review Videos</p>
            </div>

            <div className="glass-card" style={{padding:'2rem'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1.5rem'}}>
                    <div style={{width:'48px', height:'48px', borderRadius:'14px', background:'var(--secondary-glow)', color:'var(--secondary)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <RefreshCcw size={24}/>
                    </div>
                    <span style={{fontSize:'0.85rem', color:'#10b981', fontWeight:700}}>{summary.pendingReviews} pending</span>
                </div>
                <h3 style={{fontSize:'2rem', fontWeight:800, margin:0}}>{summary.approvedReviews}</h3>
                <p style={{color:'var(--text-sub)', fontSize:'0.9rem', marginTop:'0.5rem'}}>Approved Media</p>
            </div>

            <div className="glass-card" style={{padding:'2rem'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1.5rem'}}>
                    <div style={{width:'48px', height:'48px', borderRadius:'14px', background:'rgba(245, 158, 11, 0.1)', color:'#f59e0b', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Star size={24} fill="#f59e0b"/>
                    </div>
                </div>
                <h3 style={{fontSize:'2rem', fontWeight:800, margin:0}}>{summary.averageRating.toFixed(1)}</h3>
                <p style={{color:'var(--text-sub)', fontSize:'0.9rem', marginTop:'0.5rem'}}>Average Rating</p>
            </div>

            <div className="glass-card" style={{padding:'2rem'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1.5rem'}}>
                    <div style={{width:'48px', height:'48px', borderRadius:'14px', background:'rgba(16, 185, 129, 0.1)', color:'#10b981', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Shield size={24}/>
                    </div>
                </div>
                <h3 style={{fontSize:'2rem', fontWeight:800, margin:0}}>{summary.totalUsers}</h3>
                <p style={{color:'var(--text-sub)', fontSize:'0.9rem', marginTop:'0.5rem'}}>Active Stakeholders</p>
            </div>
        </div>

        {/* Search and Filters */}
        <div style={{display:'flex', gap:'1.5rem', marginBottom:'2rem', alignItems:'center', position:'relative', zIndex:50}}>
            <div style={{position:'relative', flex:1}}>
                <Search size={18} style={{position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none'}}/>
                <input 
                    type="text" 
                    placeholder="Search anything..." 
                    value={searchTerm}
                    onChange={e=>setSearchTerm(e.target.value)}
                    style={{width:'100%', padding:'1rem 1rem 1rem 3.5rem', borderRadius:'16px', border:'1px solid var(--border-light)', background:'var(--bg-soft)', color:'white'}}
                />
            </div>
            <select 
                value={filterCategory}
                onChange={e=>setFilterCategory(e.target.value)}
                style={{padding:'1rem 2rem', borderRadius:'16px', border:'1px solid var(--border-light)', background:'var(--bg-soft)', fontWeight:600, color:'white', cursor:'pointer'}}
            >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Audio">Audio</option>
                <option value="Beauty">Beauty</option>
                <option value="Tech">Tech</option>
                <option value="Lifestyle">Lifestyle</option>
            </select>
        </div>

        {/* Data Table */}
        <div className="glass-card" style={{overflow:'hidden'}}>
            <div style={{overflowX:'auto'}}>
                <table style={{width:'100%', borderCollapse:'collapse'}}>
                    <thead>
                        <tr style={{textAlign:'left', borderBottom:'1px solid var(--border-light)'}}>
                            <th style={{padding:'1.5rem', color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase'}}>Reviewer</th>
                            <th style={{padding:'1.5rem', color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase'}}>Product</th>
                            <th style={{padding:'1.5rem', color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase'}}>Rating</th>
                            <th style={{padding:'1.5rem', color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase'}}>Date</th>
                            <th style={{padding:'1.5rem', color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase'}}>Status</th>
                            <th style={{padding:'1.5rem', color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVideos.length > 0 ? filteredVideos.map(v => (
                            <tr key={v.id} style={{borderBottom:'1px solid var(--border-light)'}}>
                                <td style={{padding:'1.5rem'}}>
                                    <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                                        <div style={{width:'40px', height:'40px', borderRadius:'10px', background:'var(--bg-main)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'var(--primary)'}}>
                                            {v.reviewerName?.charAt(0) || 'U'}
                                        </div>
                                        <span style={{fontWeight:600}}>{v.reviewerName || 'Anonymous'}</span>
                                    </div>
                                </td>
                                <td style={{padding:'1.5rem'}}>
                                    <div style={{fontWeight:600}}>{v.productName || 'N/A'}</div>
                                    <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{v.category || 'Uncategorized'}</div>
                                </td>
                                <td style={{padding:'1.5rem'}}>
                                    <div style={{display:'flex', alignItems:'center', gap:'6px', color:'#f59e0b', fontWeight:700}}>
                                        <Star size={16} fill="#f59e0b"/> {v.rating?.toFixed(1) || '—'}
                                    </div>
                                </td>
                                <td style={{padding:'1.5rem', color:'var(--text-sub)', fontSize:'0.9rem'}}>
                                    {v.uploadedAt ? new Date(v.uploadedAt).toLocaleDateString() : '—'}
                                </td>
                                <td style={{padding:'1.5rem'}}>
                                    <span style={{
                                        padding:'6px 12px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:800,
                                        background: getStatusStyle(v.approvalStatus).bg, color: getStatusStyle(v.approvalStatus).color
                                    }}>
                                        {v.approvalStatus || 'PENDING'}
                                    </span>
                                </td>
                                <td style={{padding:'1.5rem'}}>
                                    <div style={{display:'flex', gap:'0.5rem'}}>
                                        <button className="btn-tab" style={{padding:'6px'}}><Play size={18}/></button>
                                        <button className="btn-tab" onClick={()=>handleDelete(v.id)} style={{padding:'6px', color:'#ef4444'}}><Trash2 size={18}/></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{padding:'5rem', textAlign:'center'}}>
                                    <div style={{opacity:0.5, marginBottom:'1rem'}}><AlertCircle size={48} style={{margin:'0 auto'}}/></div>
                                    <h4 style={{margin:0}}>No Intelligence Detected</h4>
                                    <p style={{color:'var(--text-sub)', marginTop:'0.5rem'}}>Get started by uploading a customer video or seed demo samples to explore the platform.</p>
                                    <div style={{marginTop:'1.5rem', display:'flex', justifyContent:'center', gap:'1rem'}}>
                                        <button className="btn-wow" onClick={handleSeed} style={{padding:'0.6rem 1.2rem', fontSize:'0.85rem'}}>Seed Experience</button>
                                        <NavLink to="/dashboard/upload" className="btn-outline" style={{padding:'0.6rem 1.2rem', fontSize:'0.85rem'}}>Manual Upload</NavLink>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
