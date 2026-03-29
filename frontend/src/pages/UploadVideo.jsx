import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader, Video, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../services/api';

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Feedback');
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const [previewSrc, setPreviewSrc] = useState(null);
  const [duration, setDuration] = useState(0);
  
  const [processingStep, setProcessingStep] = useState(0); // 0: idle, 1: uploading, 2: audio, 3: sentiment, 4: saving
  const [analysisResult, setAnalysisResult] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const steps = [
      { id: 1, label: 'Uploading Video', icon: <Video size={18}/> },
      { id: 2, label: 'Extracting Audio & Content', icon: <Loader className="rd-spin-inline" size={18}/> },
      { id: 3, label: 'AI Sentiment Analysis', icon: <Activity size={18}/> },
      { id: 4, label: 'Syncing Insights', icon: <CheckCircle size={18}/> }
  ];

  const handleFileSelect = (targetFile) => {
    if (!targetFile) return;
    if (targetFile.size > 500 * 1024 * 1024) {
      toast.error('File exceeds 500MB');
      return;
    }
    setFile(targetFile);
    const url = URL.createObjectURL(targetFile);
    setPreviewSrc(url);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        setDuration(Math.round(video.duration));
    };
    video.src = url;
  };

  useEffect(() => {
     return () => {
         if (previewSrc) URL.revokeObjectURL(previewSrc);
     }
  }, [previewSrc]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    setProcessingStep(1);

    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    formData.append('category', category);
    formData.append('productId', productId || 'N/A');
    formData.append('productName', productName || 'N/A');
    formData.append('reviewerName', reviewerName || 'Premium User');
    formData.append('rating', rating);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${api.defaults.baseURL}/review-videos/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = async () => {
        try {
            const response = JSON.parse(xhr.responseText);
                if (xhr.status === 200 && response.success) {
                   setProcessingStep(2);
                   await new Promise(r => setTimeout(r, 1500));
                   setProcessingStep(3);
                   await new Promise(r => setTimeout(r, 1500));
                   setProcessingStep(4);
                   await new Promise(r => setTimeout(r, 1000));
                   
                   toast.success('Analysis Complete!');
                   setAnalysisResult(response);
                   setTimeout(() => navigate('/dashboard'), 1000);
                } else {
                  const errorMsg = response.message || response.error || 'Upload failed with status ' + xhr.status;
                  toast.error(errorMsg);
                  setProcessingStep(0);
                }
        } catch(e) {
            toast.error('Server response error');
            setProcessingStep(0);
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        toast.error('Network error during upload');
        setUploading(false);
        setProcessingStep(0);
      };

      xhr.send(formData);
    } catch (err) {
      toast.error('Upload error: ' + err.message);
      setUploading(false);
      setProcessingStep(0);
    }
  };

  if (processingStep > 1 && !analysisResult) {
      return (
          <div className="flex-center" style={{height:'70vh', flexDirection:'column', gap:'2.5rem'}}>
              <div style={{textAlign:'center'}}>
                  <h2 style={{fontSize:'2.5rem', marginBottom:'1rem'}}>Snapsage <span className="gradient-text">AI Brain</span></h2>
                  <p style={{color:'var(--text-sub)'}}>Processing your video for professional insights.</p>
              </div>
              <div className="glass-card" style={{padding:'3rem', width:'100%', maxWidth:'500px'}}>
                  <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
                      {steps.map((step) => (
                          <div key={step.id} style={{
                              display:'flex', 
                              alignItems:'center', 
                              gap:'1rem', 
                              opacity: processingStep >= step.id ? 1 : 0.3,
                              transform: processingStep === step.id ? 'scale(1.05)' : 'scale(1)',
                              transition: 'all 0.3s ease'
                          }}>
                              <div style={{
                                  width: '40px', height:'40px', borderRadius:'10px', 
                                  background: processingStep > step.id ? '#10b981' : (processingStep === step.id ? 'var(--primary-glow)' : 'var(--bg-soft)'),
                                  color: processingStep > step.id ? 'white' : (processingStep === step.id ? 'var(--primary)' : 'var(--text-muted)'),
                                  display:'flex', alignItems:'center', justifyContent:'center',
                                  border: processingStep === step.id ? '1px solid var(--primary-soft)' : '1px solid transparent'
                              }}>
                                  {processingStep > step.id ? <CheckCircle size={20}/> : step.icon}
                              </div>
                              <span style={{fontWeight: processingStep === step.id ? 700 : 500, fontSize:'1.1rem'}}>
                                  {step.label}
                                  {processingStep === step.id && <span className="rd-spin-inline" style={{marginLeft:'10px', display:'inline-block'}}>...</span>}
                              </span>
                          </div>
                      ))}
                  </div>
              </div>
              <div style={{width:'100%', maxWidth:'400px', height:'4px', background:'var(--bg-soft)', borderRadius:'2px', overflow:'hidden'}}>
                   <div style={{height:'100%', width: `${(processingStep/4)*100}%`, background:'linear-gradient(90deg, var(--primary), var(--secondary))', transition:'width 0.5s ease'}} />
              </div>
          </div>
      );
  }

  return (
    <div className="animate-slide-up" style={{maxWidth: '800px', margin: '0 auto'}}>
      <h2 style={{fontSize:'2.5rem', marginBottom:'0.5rem', fontWeight:800}}>New <span className="gradient-text">Analysis</span></h2>
      <p style={{color:'var(--text-sub)', marginBottom:'2.5rem'}}>Upload a customer review video to extract premium AI insights.</p>
      <div className="glass-card" style={{padding: '2.5rem'}}>
         {!file ? (
            <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{e.preventDefault(); handleFileSelect(e.dataTransfer.files[0])}}
               style={{ border: '2px dashed var(--glass-border)', borderRadius: '24px', padding: '5rem 2rem', textAlign:'center', cursor: 'pointer', background: 'rgba(255,255,255,0.01)', marginBottom: '2.5rem', transition: 'all 0.3s' }}>
               <input type="file" ref={fileInputRef} style={{display:'none'}} accept="video/*" onChange={(e) => handleFileSelect(e.target.files[0])} />
               <div style={{background:'var(--primary-glow)', width:'80px', height:'80px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 2rem'}}>
                  <Upload size={40} color="var(--primary)" />
               </div>
               <h3 style={{fontSize:'1.5rem', marginBottom:'0.5rem'}}>Click or drag review video</h3>
               <p style={{color:'var(--text-muted)'}}>High-definition video for better sentiment results (Max 500MB)</p>
            </div>
         ) : (
            <div style={{marginBottom:'2.5rem', borderRadius:'24px', overflow:'hidden', background:'black', position:'relative', boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
               <video src={previewSrc} controls style={{width:'100%', maxHeight:'400px'}} />
               <button onClick={()=>setFile(null)} className="btn-tab" style={{position:'absolute', top:'20px', right:'20px', background:'rgba(0,0,0,0.6)', color:'white', backdropFilter:'blur(4px)'}}>Change File</button>
            </div>
         )}
         <div style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem'}}>
                <div>
                   <label style={{display:'block', marginBottom:'0.75rem', fontWeight:600, color:'var(--text-sub)'}}>Analysis Title</label>
                   <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Q3 Mobile Performance Review" style={{width:'100%', padding:'1rem', borderRadius:'12px', background:'rgba(255,255,255,0.03)', border:'1px solid var(--glass-border)', color:'white'}} />
                </div>
                <div>
                   <label style={{display:'block', marginBottom:'0.75rem', fontWeight:600, color:'var(--text-sub)'}}>Category</label>
                   <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:'100%', padding:'1rem', borderRadius:'12px', background:'rgba(255,255,255,0.03)', border:'1px solid var(--glass-border)', color:'white'}}>
                      <option value="Electronics">Electronics</option>
                      <option value="Audio">Audio</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Tech">Tech</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Feedback">General Feedback</option>
                   </select>
                </div>
            </div>
             <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem'}}>
                <div>
                   <label style={{display:'block', marginBottom:'0.75rem', fontWeight:600, color:'var(--text-sub)'}}>Product Name</label>
                   <input type="text" value={productName} onChange={e=>setProductName(e.target.value)} placeholder="e.g. UltraVision Pro" style={{width:'100%', padding:'1rem', borderRadius:'12px', background:'rgba(255,255,255,0.03)', border:'1px solid var(--glass-border)', color:'white'}} />
                </div>
                <div>
                   <label style={{display:'block', marginBottom:'0.75rem', fontWeight:600, color:'var(--text-sub)'}}>Reviewer Name</label>
                   <input type="text" value={reviewerName} onChange={e=>setReviewerName(e.target.value)} placeholder="e.g. Alex Rivera" style={{width:'100%', padding:'1rem', borderRadius:'12px', background:'rgba(255,255,255,0.03)', border:'1px solid var(--glass-border)', color:'white'}} />
                </div>
             </div>
             <div style={{padding:'2rem', background:'rgba(255,255,255,0.02)', borderRadius:'20px', border:'1px solid var(--glass-border)'}}>
                <label style={{display:'block', marginBottom:'1rem', fontWeight:600, color:'var(--text-sub)', textAlign:'center'}}>Client Rating Estimate</label>
                <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
                   {[1,2,3,4,5].map(num => (
                      <button key={num} onClick={()=>setRating(num)} style={{ background: rating >= num ? 'var(--primary)' : 'rgba(255,255,255,0.03)', color: rating >= num ? 'white' : 'var(--text-muted)', border: '1px solid var(--glass-border)', width:'54px', height:'54px', borderRadius:'14px', cursor:'pointer', fontWeight:700, fontSize:'1.2rem', transition:'all 0.2s', boxShadow: rating >= num ? '0 8px 16px var(--primary-glow)' : 'none' }}>
                         {num}
                      </button>
                   ))}
                </div>
             </div>
            {uploading && processingStep === 1 && (
                <div style={{marginTop:'1rem', padding:'1.5rem', background:'var(--primary-glow)', borderRadius:'16px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                        <span style={{fontWeight:600}}>Transmitting Encrypted Packets...</span>
                        <span style={{fontWeight:800, color:'var(--primary)'}}>{uploadProgress}%</span>
                    </div>
                    <div style={{height:'10px', background:'rgba(255,255,255,0.05)', borderRadius:'5px', overflow:'hidden'}}>
                        <div style={{height:'100%', width:`${uploadProgress}%`, background:'var(--primary)', transition:'width 0.2s'}} />
                    </div>
                </div>
            )}
            <button className="btn-wow" onClick={handleUpload} disabled={!file || uploading} style={{width:'100%', marginTop:'1rem', padding:'1.25rem', fontSize:'1.1rem'}}>
                {uploading ? 'Contacting AI Brain...' : 'Initiate Analysis Workflow'}
            </button>
         </div>
      </div>
    </div>
  );
}
