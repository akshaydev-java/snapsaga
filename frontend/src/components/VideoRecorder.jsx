import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './VideoRecorder.css';

const VideoRecorder = () => {
  const { id } = useParams(); // Survey ID
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      };

      mediaRecorder.start();
      setRecording(true);
      setUploadStatus('');

      setTimeout(() => {
        if (mediaRecorder.state === 'recording') stopRecording();
      }, 60000);

    } catch (err) {
      console.error("Device error:", err);
      setUploadStatus('Error accessing camera/microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const uploadVideo = async () => {
    if (!videoBlob) return;
    const formData = new FormData();
    formData.append('video', videoBlob, `survey_${id}_response.webm`);

    try {
      setUploadStatus('Uploading...');
      await api.post(`/surveys/${id}/responses`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('success');
      setVideoBlob(null);
    } catch (err) {
      setUploadStatus('Upload failed. Try again.');
    }
  };

  return (
    <div className="page-container" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="video-recorder-card">
        <h2>Provide Media Feedback</h2>
        <p>Your camera will automatically stop recording after 60 seconds.</p>

        <div className="video-preview-container">
          {videoBlob && !recording ? (
            <video className="video-element" controls src={URL.createObjectURL(videoBlob)} />
          ) : (
            <video ref={videoRef} className="video-element flip" muted />
          )}
          {recording && <div className="recording-badge"><span className="dot"></span> Recording</div>}
        </div>

        <div className="video-controls">
          {!recording && !videoBlob && uploadStatus !== 'success' && (
            <button onClick={startRecording} className="btn-primary">Start Recording</button>
          )}
          {recording && (
            <button onClick={stopRecording} className="btn-delete" style={{padding: '1rem 2rem'}}>Stop Recording</button>
          )}
          {videoBlob && !recording && (
            <>
              <button onClick={() => setVideoBlob(null)} className="btn-outline">Retake</button>
              <button onClick={uploadVideo} className="btn-primary" style={{backgroundColor: '#10b981'}}>Submit Video</button>
            </>
          )}
        </div>

        {uploadStatus === 'success' && (
          <div className="alert alert-success">Feedback submitted successfully! Thank you.</div>
        )}
        {uploadStatus && uploadStatus !== 'success' && uploadStatus !== 'Uploading...' && (
          <div className="alert alert-error">{uploadStatus}</div>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
