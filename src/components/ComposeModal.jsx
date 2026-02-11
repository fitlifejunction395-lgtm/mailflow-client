import { useState, useEffect } from 'react';
import { useEmail } from '../context/EmailContext';
import api from '../services/api';

const ComposeModal = () => {
    const {
        composeData,
        setComposeOpen,
        setComposeData,
        sendEmail,
        saveDraft,
        replyToEmail,
        forwardEmail,
    } = useEmail();

    const [to, setTo] = useState('');
    const [cc, setCc] = useState('');
    const [bcc, setBcc] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [showCcBcc, setShowCcBcc] = useState(false);
    const [sending, setSending] = useState(false);
    const [minimized, setMinimized] = useState(false);

    // AI State
    const [showAiInput, setShowAiInput] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [generatingAi, setGeneratingAi] = useState(false);

    // Prefill fields for reply/forward
    useEffect(() => {
        if (composeData) {
            setTo(composeData.to?.join(', ') || '');
            setSubject(composeData.subject || '');
            if (composeData.mode === 'forward') {
                setBody(composeData.body || '');
            }
        }
    }, [composeData]);

    const handleSend = async () => {
        if (!to.trim()) return;
        setSending(true);

        const recipients = to.split(',').map((e) => e.trim()).filter(Boolean);
        const ccList = cc ? cc.split(',').map((e) => e.trim()).filter(Boolean) : [];
        const bccList = bcc ? bcc.split(',').map((e) => e.trim()).filter(Boolean) : [];

        let success = false;

        if (composeData?.mode === 'reply' || composeData?.mode === 'replyAll') {
            success = await replyToEmail(
                composeData.inReplyTo,
                body,
                composeData.mode === 'replyAll'
            );
        } else if (composeData?.mode === 'forward') {
            success = await forwardEmail(composeData.emailId, recipients, body);
        } else {
            success = await sendEmail({
                to: recipients,
                cc: ccList,
                bcc: bccList,
                subject,
                body,
            });
        }

        setSending(false);
        if (success) {
            handleClose();
        }
    };

    const handleSaveDraft = async () => {
        const recipients = to ? to.split(',').map((e) => e.trim()).filter(Boolean) : [];
        await saveDraft({
            to: recipients,
            subject,
            body,
        });
        handleClose();
    };

    const handleClose = () => {
        setComposeOpen(false);
        setComposeData(null);
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setGeneratingAi(true);
        try {
            const { data } = await api.post('/api/ai/draft', { prompt: aiPrompt });
            if (data.success) {
                setBody((prev) => (prev ? prev + '\n\n' + data.data : data.data));
                setShowAiInput(false);
                setAiPrompt('');
            }
        } catch (error) {
            console.error('AI Draft failed:', error);
        } finally {
            setGeneratingAi(false);
        }
    };

    if (minimized) {
        return (
            <div
                className="fixed bottom-0 right-6 w-72 bg-surface-light border border-border rounded-t-xl shadow-2xl cursor-pointer z-50"
                onClick={() => setMinimized(false)}
            >
                <div className="flex items-center justify-between px-4 py-3 bg-primary/20 rounded-t-xl">
                    <span className="text-sm font-medium text-text-primary truncate">
                        {subject || 'New Message'}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); setMinimized(false); }}
                            className="p-1 hover:bg-surface-hover rounded text-text-muted"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleClose(); }}
                            className="p-1 hover:bg-surface-hover rounded text-text-muted"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 right-6 w-full max-w-lg bg-surface border border-border rounded-t-2xl shadow-2xl shadow-black/30 z-50 flex flex-col animate-slide-up" style={{ maxHeight: '80vh' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-surface-light rounded-t-2xl border-b border-border shrink-0">
                <span className="text-sm font-semibold text-text-primary">
                    {composeData?.mode === 'reply' ? 'Reply' :
                        composeData?.mode === 'replyAll' ? 'Reply All' :
                            composeData?.mode === 'forward' ? 'Forward' : 'New Message'}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setMinimized(true)}
                        className="p-1.5 hover:bg-surface-hover rounded-lg text-text-muted transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-1.5 hover:bg-surface-hover rounded-lg text-text-muted transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Fields */}
            <div className="px-4 py-2 space-y-0 border-b border-border shrink-0">
                <div className="flex items-center border-b border-border/50 py-2">
                    <label className="text-sm text-text-muted w-12 shrink-0">To</label>
                    <input
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                        placeholder="recipient@email.com"
                        autoFocus
                    />
                    {!showCcBcc && (
                        <button
                            onClick={() => setShowCcBcc(true)}
                            className="text-xs text-text-muted hover:text-primary-light transition-colors ml-2"
                        >
                            Cc/Bcc
                        </button>
                    )}
                </div>

                {showCcBcc && (
                    <>
                        <div className="flex items-center border-b border-border/50 py-2">
                            <label className="text-sm text-text-muted w-12 shrink-0">Cc</label>
                            <input
                                type="text"
                                value={cc}
                                onChange={(e) => setCc(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                                placeholder="cc@email.com"
                            />
                        </div>
                        <div className="flex items-center border-b border-border/50 py-2">
                            <label className="text-sm text-text-muted w-12 shrink-0">Bcc</label>
                            <input
                                type="text"
                                value={bcc}
                                onChange={(e) => setBcc(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                                placeholder="bcc@email.com"
                            />
                        </div>
                    </>
                )}

                <div className="flex items-center py-2">
                    <label className="text-sm text-text-muted w-12 shrink-0">Sub</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                        placeholder="Subject"
                    />
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 relative">
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full h-full min-h-[200px] bg-transparent text-sm text-text-primary outline-none resize-none py-4 placeholder:text-text-muted leading-relaxed"
                    placeholder="Write your email..."
                />

                {/* AI Input Popover */}
                {showAiInput && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl border border-border p-3 flex flex-col gap-2 animate-slide-up z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs">
                                ✨
                            </div>
                            <span className="text-xs font-semibold text-text-primary">Help me write</span>
                            <button onClick={() => setShowAiInput(false)} className="ml-auto text-text-muted hover:text-text-primary">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            className="w-full bg-surface-light rounded p-2 text-sm outline-none resize-none"
                            placeholder="e.g. Ask for a meeting next Tuesday..."
                            rows={2}
                            autoFocus
                        />
                        <button
                            onClick={handleAiGenerate}
                            disabled={!aiPrompt.trim() || generatingAi}
                            className="self-end bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-all disabled:opacity-50"
                        >
                            {generatingAi ? 'Generating...' : 'Create Draft'}
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border shrink-0">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSend}
                        disabled={!to.trim() || sending}
                        className="btn btn-primary text-sm px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <span className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Sending...
                            </span>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Send
                            </>
                        )}
                    </button>

                    {/* AI Button */}
                    <button
                        onClick={() => setShowAiInput(!showAiInput)}
                        className="p-2 rounded-full hover:bg-surface-hover text-text-secondary transition-colors"
                        title="Help me write"
                    >
                        <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleSaveDraft}
                        className="p-2 rounded-lg hover:bg-surface-hover text-text-muted transition-colors"
                        title="Save as draft"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-danger transition-colors"
                        title="Discard"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComposeModal;
