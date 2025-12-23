'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartPhotoUploaderProps {
    onUploadComplete: (imageUrl: string) => void;
    t: any;
}

export const SmartPhotoUploader: React.FC<SmartPhotoUploaderProps> = ({ onUploadComplete, t }) => {
    const [mode, setMode] = useState<'idle' | 'camera' | 'uploading' | 'preview'>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // --- FILE UPLOAD LOGIC ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                startUploadSimulation(result);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- CAMERA LOGIC ---
    const startCamera = async () => {
        setMode('camera');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 640 },
                audio: false
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setIsCameraReady(true);
                };
            }
        } catch (err) {
            console.error("Camera access denied", err);
            setMode('idle');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraReady(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                // Square crop logic
                const size = Math.min(video.videoWidth, video.videoHeight);
                const startX = (video.videoWidth - size) / 2;
                const startY = (video.videoHeight - size) / 2;

                canvas.width = 600;
                canvas.height = 600;
                context.drawImage(video, startX, startY, size, size, 0, 0, 600, 600);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                stopCamera();
                startUploadSimulation(dataUrl);
            }
        }
    };

    // --- UPLOAD SIMULATION ---
    const startUploadSimulation = (imageUrl: string) => {
        setMode('uploading');
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setPreviewUrl(imageUrl);
                        setMode('preview');
                        onUploadComplete(imageUrl);
                    }, 500);
                    return 100;
                }
                return prev + Math.floor(Math.random() * 15) + 5;
            });
        }, 300);
    };

    const reset = () => {
        stopCamera();
        setMode('idle');
        setPreviewUrl(null);
        setUploadProgress(0);
    };

    return (
        <div className="relative w-full max-w-sm mx-auto">
            <div className="relative w-64 h-64 mx-auto mb-8 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-[3.5rem] animate-pulse opacity-20 blur-xl" />
                <div className="relative w-full h-full bg-slate-900 border-2 border-dashed border-white/10 rounded-[3.5rem] overflow-hidden flex flex-col items-center justify-center transition-all group-hover:border-primary/30">

                    <AnimatePresence mode="wait">
                        {/* IDLE state */}
                        {mode === 'idle' && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-4 p-6"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                                    <Camera className="w-8 h-8 text-white/20" />
                                </div>
                                <div className="flex flex-col gap-3 w-full">
                                    <button
                                        onClick={startCamera}
                                        className="flex items-center justify-center gap-2 py-3 bg-primary/10 border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-all active:scale-95"
                                    >
                                        <Camera className="w-4 h-4" />
                                        Take Photo
                                    </button>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload File
                                    </button>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </motion.div>
                        )}

                        {/* CAMERA state */}
                        {mode === 'camera' && (
                            <motion.div
                                key="camera"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black flex items-center justify-center"
                            >
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover scale-x-[-1]"
                                />
                                {!isCameraReady && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                                        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                                    </div>
                                )}
                                <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-4">
                                    <button
                                        onClick={capturePhoto}
                                        className="w-14 h-14 bg-white rounded-full border-4 border-primary/20 shadow-2xl active:scale-90 transition-all"
                                    />
                                    <button
                                        onClick={() => { stopCamera(); setMode('idle'); }}
                                        className="absolute right-6 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* UPLOADING state */}
                        {mode === 'uploading' && (
                            <motion.div
                                key="uploading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="w-full px-10 flex flex-col items-center"
                            >
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/5">
                                    <motion.div
                                        className="h-full bg-primary shadow-[0_0_15px_rgba(234,30,99,0.5)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">
                                    Syncing Frequency... {uploadProgress}%
                                </span>
                            </motion.div>
                        )}

                        {/* PREVIEW state */}
                        {mode === 'preview' && (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="w-full h-full relative"
                            >
                                {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />}
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4">
                                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                                        <Check className="w-8 h-8 text-white" />
                                    </div>
                                    <button
                                        onClick={reset}
                                        className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                                    >
                                        Change Photo
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};
