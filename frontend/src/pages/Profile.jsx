import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, CreditCard, Calendar, Edit3, Save, X, Loader, Shield, 
  Lock, Camera, ShieldCheck, ExternalLink, Activity, LogOut
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    phoneNumber: '', 
    profileImage: '' 
  });

  const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
      setFormData({
        firstName: res.data.firstName || '',
        lastName: res.data.lastName || '',
        phoneNumber: res.data.phoneNumber || '',
        profileImage: res.data.profileImage || ''
      });
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/me', formData);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Update failed. Please check your network.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
      e.preventDefault();
      if (passwordData.newPassword !== passwordData.confirmPassword) {
          toast.error('New passwords do not match');
          return;
      }
      setSaving(true);
      try {
          await api.post('/users/change-password', {
              currentPassword: passwordData.currentPassword,
              newPassword: passwordData.newPassword
          });
          toast.success('Password changed successfully');
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err) {
          toast.error(err.response?.data?.error || 'Password update failed');
      } finally {
          setSaving(false);
      }
  };

  if (loading) return (
    <div className="flex-center" style={{height:'80vh', flexDirection:'column', gap:'1.5rem'}}>
        <div className="rd-spin" style={{width:'40px', height:'40px', border:'4px solid var(--primary-soft)', borderTopColor:'var(--primary)', borderRadius:'50%'}}></div>
        <p style={{color:'var(--text-sub)'}}>Syncing Account Data...</p>
    </div>
  );

  const formatDate = (dateStr) => {
      if(!dateStr) return '—';
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const activePlan = user?.purchasePlan || 'Free Tier';
  const isAdmin = user?.roles?.some(r => r.name === 'ROLE_ADMIN');

  return (
    <div className="animate-slide-up" style={{maxWidth:'1000px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2.5rem'}}>
            <div>
                <h2 style={{fontSize:'2.5rem', marginBottom:'0.5rem', fontWeight:800}}>Account <span className="gradient-text">Command Center</span></h2>
                <p style={{color:'var(--text-sub)'}}>Manage your professional identity and security credentials.</p>
            </div>
            {!isEditing && (
                <button className="btn-wow" onClick={()=>setIsEditing(true)} style={{padding:'0.75rem 1.5rem'}}>
                    <Edit3 size={18} style={{marginRight:'8px'}}/> Refine Profile
                </button>
            )}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 350px', gap:'2.5rem'}}>
            <div className="flex-column" style={{gap:'2.5rem'}}>
                {/* Main Profile Card */}
                <div className="glass-card" style={{padding:'3rem', position:'relative', background:'rgba(17, 24, 39, 0.4)'}}>
                    <div style={{display:'flex', gap:'2.5rem', alignItems:'center', marginBottom:'3rem'}}>
                        <div style={{position:'relative'}}>
                            <div style={{
                                width:'150px', height:'150px', borderRadius:'28px', 
                                background:'linear-gradient(135deg, var(--primary), var(--secondary))', display:'flex', alignItems:'center', justifyContent:'center', 
                                fontSize:'4.5rem', fontWeight:800, color:'white',
                                overflow:'hidden', boxShadow:'0 20px 40px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.1)'
                            }}>
                               {user.profileImage ? (
                                   <img src={user.profileImage} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                               ) : (user.firstName?.charAt(0) || 'U')}
                            </div>
                            {isEditing && (
                                <button style={{position:'absolute', bottom:'-10px', right:'-10px', background:'var(--primary)', color:'white', border:'none', width:'44px', height:'44px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 8px 20px var(--primary-glow)'}}>
                                    <Camera size={20}/>
                                </button>
                            )}
                        </div>
                        
                        <div style={{flex:1}}>
                            {isEditing ? (
                                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1rem'}}>
                                    <div className="input-group">
                                        <label style={{fontSize:'0.85rem', fontWeight:600, color:'var(--text-muted)', marginBottom:'0.5rem', display:'block'}}>First Name</label>
                                        <input type="text" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} style={{width:'100%', padding:'1rem', borderRadius:'12px', border:'1px solid var(--glass-border)', background:'rgba(0,0,0,0.2)', color:'white'}} />
                                    </div>
                                    <div className="input-group">
                                        <label style={{fontSize:'0.85rem', fontWeight:600, color:'var(--text-muted)', marginBottom:'0.5rem', display:'block'}}>Last Name</label>
                                        <input type="text" value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} style={{width:'100%', padding:'1rem', borderRadius:'12px', border:'1px solid var(--glass-border)', background:'rgba(0,0,0,0.2)', color:'white'}} />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 style={{fontSize:'2.75rem', margin:0, fontWeight:800}}>{user.firstName} {user.lastName}</h3>
                                    <div style={{display:'flex', alignItems:'center', gap:'1.25rem', marginTop:'0.75rem'}}>
                                        <span style={{background:'var(--primary-glow)', color:'var(--primary)', padding:'6px 14px', borderRadius:'20px', fontSize:'0.8rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', border:'1px solid var(--primary-soft)'}}>
                                            {isAdmin ? 'Systems Admin' : 'Premium Analyst'}
                                        </span>
                                        <span style={{color:'var(--text-muted)', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'6px'}}>
                                           <Calendar size={16}/> Joined {formatDate(user.createdAt)}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2.5rem', padding:'2.5rem', background:'rgba(0,0,0,0.2)', borderRadius:'24px', border:'1px solid var(--glass-border)'}}>
                        <div className="detail-item">
                            <label style={{display:'flex', alignItems:'center', gap:'10px', color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'0.75rem', fontWeight:600}}>
                                <Mail size={18} className="gradient-text"/> Registered Email
                            </label>
                            <div style={{fontSize:'1.2rem', fontWeight:600}}>{user.email}</div>
                        </div>

                        <div className="detail-item">
                            <label style={{display:'flex', alignItems:'center', gap:'10px', color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'0.75rem', fontWeight:600}}>
                                <Phone size={18} className="gradient-text"/> Contact Verified
                            </label>
                            {isEditing ? (
                                <input type="text" value={formData.phoneNumber} onChange={e=>setFormData({...formData, phoneNumber: e.target.value})} placeholder="Enter mobile" style={{width:'100%', padding:'1rem', borderRadius:'12px', border:'1px solid var(--glass-border)', background:'rgba(0,0,0,0.2)', color:'white'}} />
                            ) : (
                                <div style={{fontSize:'1.2rem', fontWeight:600}}>{user.phoneNumber || '+1 (234) 567-890'}</div>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div style={{display:'flex', gap:'1.5rem', marginTop:'2.5rem', justifyContent:'flex-end'}}>
                            <button className="btn-outline" onClick={()=>setIsEditing(false)} disabled={saving}>Cancel</button>
                            <button className="btn-wow" onClick={handleSave} disabled={saving} style={{padding:'0.85rem 2.5rem'}}>
                                {saving ? <Loader className="rd-spin-inline" size={20}/> : <Save size={20} style={{marginRight:'10px'}}/>} Synchronize Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* Security Section */}
                <div className="glass-card" style={{padding:'2.5rem', background:'rgba(17, 24, 39, 0.4)'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2.5rem'}}>
                        <h4 style={{fontSize:'1.35rem', fontWeight:800, margin:0, display:'flex', alignItems:'center', gap:'12px'}}>
                            <ShieldCheck size={26} className="gradient-text"/> Security Protocol
                        </h4>
                        <button className="btn-tab active" onClick={()=>setShowPasswordModal(true)}>Rotate Credentials</button>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.5rem', border:'1px solid var(--glass-border)', borderRadius:'20px'}}>
                            <div>
                                <div style={{fontWeight:700, fontSize:'1.1rem'}}>Encrypted 2FA</div>
                                <div style={{fontSize:'0.9rem', color:'var(--text-muted)', marginTop:'4px'}}>Secure your dashboard with biometric or device authentication</div>
                            </div>
                            <span style={{color:'var(--text-sub)', fontSize:'0.85rem', fontWeight:800, letterSpacing:'1px'}}>INACTIVE</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.5rem', border:'1px solid var(--glass-border)', borderRadius:'20px', background:'rgba(16, 185, 129, 0.03)'}}>
                            <div>
                                <div style={{fontWeight:700, fontSize:'1.1rem'}}>Threat Monitoring</div>
                                <div style={{fontSize:'0.9rem', color:'var(--text-muted)', marginTop:'4px'}}>Automated alerts for unauthorized access attempts</div>
                            </div>
                            <span style={{color:'#10b981', fontSize:'0.85rem', fontWeight:800, letterSpacing:'1px'}}>ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-column" style={{gap:'2.5rem'}}>
                <div className="glass-card" style={{padding:'2.5rem', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', background:'rgba(17, 24, 39, 0.4)'}}>
                    <div style={{width:'64px', height:'64px', borderRadius:'18px', background:'var(--primary-glow)', color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.75rem', border:'1px solid var(--primary-soft)'}}>
                        <CreditCard size={32}/>
                    </div>
                    <h5 style={{fontSize:'1.25rem', fontWeight:700, margin:'0 0 0.5rem 0'}}>Service Tier: <span className="gradient-text">{activePlan}</span></h5>
                    <p style={{fontSize:'0.9rem', color:'var(--text-sub)', marginBottom:'2rem'}}>Premium Enterprise Subscription</p>
                    <button className="btn-wow" style={{width:'100%', fontSize:'0.95rem', padding:'1rem'}}>Upgrade Ecosystem</button>
                    <div style={{marginTop:'1.5rem', fontSize:'0.8rem', color:'var(--text-muted)'}}>Next billing cycle: April 22, 2026</div>
                </div>

                <div className="glass-card" style={{padding:'2rem', background:'rgba(17, 24, 39, 0.4)'}}>
                    <h5 style={{fontSize:'1.1rem', fontWeight:700, marginBottom:'1.75rem', display:'flex', alignItems:'center', gap:'10px'}}>
                        <Activity size={20} className="gradient-text"/> System Logs
                    </h5>
                    <div style={{display:'flex', flexDirection:'column', gap:'1.75rem'}}>
                        <div style={{display:'flex', gap:'12px'}}>
                            <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'var(--primary)', marginTop:'6px', boxShadow:'0 0 10px var(--primary)'}}></div>
                            <div style={{fontSize:'0.9rem'}}>
                                <div style={{fontWeight:700}}>Credential Rotation</div>
                                <div style={{color:'var(--text-muted)', fontSize:'0.8rem', marginTop:'2px'}}>March 27, 2026</div>
                            </div>
                        </div>
                        <div style={{display:'flex', gap:'12px'}}>
                            <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#10b981', marginTop:'6px', boxShadow:'0 0 10px #10b981'}}></div>
                            <div style={{fontSize:'0.9rem'}}>
                                <div style={{fontWeight:700}}>Authorized Entry</div>
                                <div style={{color:'var(--text-muted)', fontSize:'0.8rem', marginTop:'2px'}}>Chrome Browser • Today</div>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                  onClick={()=>{localStorage.clear(); window.location.href='/login'}}
                  style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', padding:'1.25rem', borderRadius:'20px', border:'1px solid rgba(239, 68, 68, 0.3)', background:'rgba(239, 68, 68, 0.05)', color:'#ef4444', fontWeight:700, cursor:'pointer', transition:'all 0.3s', fontSize:'1rem'}}
                  onMouseOver={(e)=>e.currentTarget.style.background='rgba(239, 68, 68, 0.15)'}
                  onMouseOut={(e)=>e.currentTarget.style.background='rgba(239, 68, 68, 0.05)'}
                >
                    <LogOut size={20}/> Decommission Session
                </button>
            </div>
        </div>

        {/* Change Password Modal */}
        {showPasswordModal && (
            <div className="modal-overlay flex-center" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.85)', zIndex:2000, backdropFilter:'blur(12px)'}}>
                <div className="glass-card animate-slide-up" style={{width:'100%', maxWidth:'480px', padding:'3rem', background:'var(--bg-darker)'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2.5rem'}}>
                        <h3 style={{fontSize:'1.75rem', margin:0, fontWeight:800}}>Rotate <span className="gradient-text">Credentials</span></h3>
                        <button onClick={()=>setShowPasswordModal(false)} style={{background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer'}}><X size={32}/></button>
                    </div>
                    <form onSubmit={handleChangePassword} style={{display:'flex', flexDirection:'column', gap:'1.75rem'}}>
                        <div className="input-group">
                            <label style={{fontSize:'0.9rem', marginBottom:'0.6rem', display:'block', color:'var(--text-sub)', fontWeight:600}}>Current Access Key</label>
                            <input type="password" required value={passwordData.currentPassword} onChange={e=>setPasswordData({...passwordData, currentPassword: e.target.value})} style={{width:'100%', padding:'1rem', borderRadius:'14px', border:'1px solid var(--glass-border)', background:'rgba(255,255,255,0.03)', color:'white'}} />
                        </div>
                        <div className="input-group">
                            <label style={{fontSize:'0.9rem', marginBottom:'0.6rem', display:'block', color:'var(--text-sub)', fontWeight:600}}>New Secure Password</label>
                            <input type="password" required value={passwordData.newPassword} onChange={e=>setPasswordData({...passwordData, newPassword: e.target.value})} style={{width:'100%', padding:'1rem', borderRadius:'14px', border:'1px solid var(--glass-border)', background:'rgba(255,255,255,0.03)', color:'white'}} />
                        </div>
                        <div className="input-group">
                            <label style={{fontSize:'0.9rem', marginBottom:'0.6rem', display:'block', color:'var(--text-sub)', fontWeight:600}}>Confirm Secure Password</label>
                            <input type="password" required value={passwordData.confirmPassword} onChange={e=>setPasswordData({...passwordData, confirmPassword: e.target.value})} style={{width:'100%', padding:'1rem', borderRadius:'14px', border:'1px solid var(--glass-border)', background:'rgba(255,255,255,0.03)', color:'white'}} />
                        </div>
                        <button className="btn-wow" type="submit" disabled={saving} style={{marginTop:'1.5rem', width:'100%', padding:'1.1rem', fontSize:'1.1rem'}}>
                            {saving ? <Loader className="rd-spin-inline" size={22}/> : 'Authorize Security Update'}
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
