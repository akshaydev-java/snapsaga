import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Video, Star, CheckCircle, Clock, ArrowRight, Package, Users, 
  Download, Filter, Calendar, TrendingUp, Search, Info, RefreshCcw
} from 'lucide-react';
import api from '../services/api';

import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend 
} from 'recharts';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../layouts/DashboardLayout.css';


const COLORS = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];


export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/dashboard/analytics');
      setData(res.data);
    } catch (err) {
      toast.error('Network error during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(139, 92, 246); // Primary Color
      doc.text('Snapsage Research Insights', 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${timestamp}`, 20, 28);
      doc.text('Confidential Business Intelligence Report', 140, 28);
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(230);
      doc.line(20, 32, 190, 32);
      
      // Overview Section
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('1. Executive Summary', 20, 45);
      
      autoTable(doc, {
          startY: 50,
          head: [['Metric', 'Value', 'Status']],
          body: [
              ['Total Review Videos', data.totalVideos.toString(), 'Active'],
              ['Average Rating', `${data.averageRating?.toFixed(1)} / 5.0`, 'Optimal'],
              ['Approved Reviews', data.approvedReviewsCount.toString(), 'Verified'],
              ['Market Reach', `${data.totalUniqueProducts} Products`, 'Expanding'],
              ['Sentiment Index', 'Strongly Positive', 'Healthy']
          ],
          theme: 'striped',
          headStyles: { fillStyle: [139, 92, 246] }
      });
      
      // Product Distribution
      doc.text('2. Top Performing Products', 20, doc.lastAutoTable.finalY + 15);
      const productBody = Object.keys(data.reviewsPerProduct || {}).map(k => [k, data.reviewsPerProduct[k]]);
      autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 20,
          head: [['Product Name', 'Total Reviews']],
          body: productBody,
          theme: 'grid'
      });
      
      // Detailed Review Insights
      doc.addPage();
      doc.text('3. Detailed Review Insights (AI Summaries)', 20, 20);
      
      const reviewBody = (data.recentVideos || []).map(rv => [
          rv.productName || 'N/A',
          rv.reviewerName || 'N/A',
          `${rv.rating || 0}/5`,
          rv.category || 'N/A',
          rv.remarks || 'No summary generated.'
      ]);
      
      autoTable(doc, {
          startY: 25,
          head: [['Product', 'Reviewer', 'Rating', 'Category', 'AI Summary']],
          body: reviewBody,
          columnStyles: {
              4: { cellWidth: 70 } // Summary column width
          },
          headStyles: { fillColor: [139, 92, 246] }
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(`Snapsage Intelligence Report - Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      }
      
      doc.save(`snapsage_report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Professional PDF Report Generated!');
  };

  if (loading) return (
    <div className="flex-center" style={{height:'100%', flexDirection:'column', gap:'1rem'}}>
        <div className="rd-spin" style={{width:'40px', height:'40px', border:'3px solid var(--primary-soft)', borderTopColor:'var(--primary)', borderRadius:'50%'}}></div>
        <p style={{color:'var(--text-sub)'}}>Generating Business Insights...</p>
    </div>
  );

  if (!data || data.totalVideos === 0) return (
      <div className="analytics-page animate-slide-up flex-center" style={{height:'80vh', flexDirection:'column', gap:'2rem'}}>
          <div className="glass-card flex-center" style={{padding:'4rem', flexDirection:'column', maxWidth:'500px', textAlign:'center'}}>
              <div style={{background:'var(--primary-glow)', padding:'2rem', borderRadius:'50%', marginBottom:'2rem'}}>
                  <BarChart3 size={64} color="var(--primary)" />
              </div>
              <h3 style={{fontSize:'1.75rem', marginBottom:'1rem'}}>Insights Playground Empty</h3>
              <p style={{color:'var(--text-sub)', marginBottom:'2rem'}}>You need data to generate insights. Return to the dashboard and Seed Samples or Upload a review video.</p>
              <div style={{display:'flex', gap:'1rem'}}>
                  <button className="btn-wow" onClick={fetchAnalytics}>Refresh</button>
                  <NavLink to="/dashboard" className="btn-outline">Go to Data Command</NavLink>
              </div>
          </div>
      </div>
  );

  const categoryArray = Object.keys(data.categoryDistribution || {}).map(k => ({
    name: k,
    value: data.categoryDistribution[k]
  }));

  const productArray = Object.keys(data.reviewsPerProduct || {}).map(k => ({
    name: k,
    count: data.reviewsPerProduct[k]
  })).sort((a,b) => b.count - a.count).slice(0, 5);

  const trendArray = Object.keys(data.uploadTrends || {}).sort().map(k => ({
    date: k,
    uploads: data.uploadTrends[k]
  }));

  const sentimentArray = Object.keys(data.sentimentTrend || {}).sort().map(k => ({
    date: k,
    score: parseFloat((data.sentimentTrend[k] * 10).toFixed(1))
  }));

  return (
    <div className="analytics-page animate-slide-up">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem'}}>
          <div>
              <h2 style={{fontSize:'2.5rem', marginBottom:'0.5rem', fontWeight:800}}>Market <span className="gradient-text">Insights</span></h2>
              <p style={{color:'var(--text-sub)'}}>Intelligence report generated from customer sentiment and ratings.</p>
          </div>
          <div style={{display:'flex', gap:'1rem'}}>
              <button className="btn-outline" onClick={fetchAnalytics}><RefreshCcw size={18}/></button>
              <button className="btn-wow" onClick={handleExport} style={{padding:'0.75rem 1.25rem'}}>
                  <Download size={18} style={{marginRight:'8px'}}/> Generate PDF Report
              </button>
          </div>
      </div>
      
      {/* Metric Cards */}
      <div className="dashboard-grid" style={{marginBottom: '2.5rem'}}>
        <div className="glass-card" style={{padding:'2.5rem', position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:'-10px', right:'-10px', opacity:0.05}}><Star size={100} fill="var(--primary)"/></div>
          <div style={{fontSize:'0.9rem', color:'var(--text-sub)', marginBottom:'0.5rem'}}>Product Satisfaction</div>
          <div style={{display:'flex', alignItems:'baseline', gap:'8px'}}>
              <h3 style={{fontSize:'3rem', margin:0, fontWeight:800}}>{data.averageRating?.toFixed(1) || '0.0'}</h3>
              <Star size={24} fill="#f59e0b" color="#f59e0b" style={{marginBottom:'8px'}}/>
          </div>
          <div style={{marginTop:'1rem', fontSize:'0.85rem', color:'#10b981', display:'flex', alignItems:'center', gap:'4px'}}>
              <TrendingUp size={14}/> Top 5% in category
          </div>
        </div>
        
        <div className="glass-card" style={{padding:'2.5rem', borderLeft:'5px solid var(--primary)'}}>
          <div style={{fontSize:'0.9rem', color:'var(--text-sub)', marginBottom:'0.5rem'}}>Market Reach</div>
          <h3 style={{fontSize:'3rem', margin:0, fontWeight:800}}>{data.totalVideos}</h3>
          <div style={{marginTop:'1rem', fontSize:'0.85rem', color:'var(--text-muted)'}}>Across {data.totalUniqueProducts} unique items</div>
        </div>

        <div className="glass-card" style={{padding:'2.5rem', borderLeft:'5px solid #10b981'}}>
          <div style={{fontSize:'0.9rem', color:'var(--text-sub)', marginBottom:'0.5rem'}}>Brand Loyalty</div>
          <h3 style={{fontSize:'3rem', margin:0, fontWeight:800}}>{(data.approvedReviewsCount / (data.totalVideos || 1) * 100).toFixed(0)}%</h3>
          <div style={{marginTop:'1rem', fontSize:'0.85rem', color:'var(--text-muted)'}}>Approval conversion rate</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'2rem', marginBottom:'2.5rem'}}>
        <div className="glass-card" style={{padding:'2.5rem'}}>
          <h3 style={{fontSize:'1.25rem', fontWeight:700, marginBottom:'2rem'}}>Growth Momentum</h3>
          <div style={{height:'350px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentArray}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{fill: 'var(--text-sub)'}} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-sub)'}} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{backgroundColor:'var(--bg-soft)', borderRadius:'12px', border:'1px solid var(--border-light)', color:'var(--text-main)'}} 
                  itemStyle={{color:'var(--text-main)'}}
                />
                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={4} dot={{r: 6, fill:'var(--primary)'}} activeDot={{r: 8}} animate={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{padding:'2.5rem'}}>
          <h3 style={{fontSize:'1.25rem', fontWeight:700, marginBottom:'2rem'}}>Segment Split</h3>
          <div style={{height:'300px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryArray}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryArray.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-soft)', 
                      borderColor: 'var(--border-light)',
                      borderRadius: '12px',
                      color: 'var(--text-main)'
                    }} 
                    itemStyle={{ color: 'var(--text-main)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:'0.75rem', marginTop:'1.5rem'}}>
             {categoryArray.map((entry, idx) => (
                 <div key={entry.name} style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.85rem'}}>
                     <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div style={{width:'8px', height:'8px', borderRadius:'50%', background:COLORS[idx%COLORS.length]}}></div>
                        <span>{entry.name}</span>
                     </div>
                     <span style={{fontWeight:700}}>{entry.value} units</span>
                 </div>
             ))}
          </div>
        </div>
      </div>

      {/* Bottom Insights Row */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:'2rem'}}>
          <div className="glass-card" style={{padding:'2.5rem'}}>
              <h3 style={{fontSize:'1.25rem', fontWeight:700, marginBottom:'2rem'}}>Popular Products</h3>
              <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
                  {productArray.map((p, idx) => (
                      <div key={p.name}>
                          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem', fontSize:'0.9rem'}}>
                              <span style={{fontWeight:600}}>{p.name}</span>
                              <span style={{color:'var(--text-muted)'}}>{p.count} reviews</span>
                          </div>
                          <div style={{height:'8px', background:'var(--bg-main)', borderRadius:'4px', overflow:'hidden'}}>
                              <div style={{height:'100%', width:`${(p.count / productArray[0].count) * 100}%`, background:COLORS[idx % COLORS.length], borderRadius:'4px'}} />
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="glass-card" style={{padding:'2.5rem'}}>
              <h3 style={{fontSize:'1.25rem', fontWeight:700, marginBottom:'2rem'}}>Review Velocity</h3>
              <div style={{height:'300px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendArray}>
                      <XAxis dataKey="date" hide />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--bg-soft)', 
                          borderColor: 'var(--border-light)',
                          borderRadius: '12px',
                          color: 'var(--text-main)'
                        }} 
                        itemStyle={{ color: 'var(--text-main)' }}
                      />
                      <Bar dataKey="uploads" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>
    </div>
  );
}
