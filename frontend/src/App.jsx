import React, { useState } from 'react';
import { MessageSquare, Cpu, ShieldCheck, Terminal, Layers, Radio } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({ route: 'Idle', latency: '0ms', cache: 'Miss', steps: [] });
  const API_URL = "https://enterprise-agent-grid.onrender.com";

  // Helper function to clean text formatting so it displays cleanly in the UI bubbles
  const cleanResponseText = (rawText) => {
    if (!rawText) return '';
    return rawText
      .replace(/\[\[\d+\]\]\(http.*?\)/g, '') // Remove markdown links
      .replace(/---\s*/g, '')               // Remove dividers
      .replace(/###/g, '')                  // Remove headers
      .replace(/\*\*/g, '')                 // Remove bold marks
      .replace(/\|/g, ' ')                  // Clean up table markers
      .trim();
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setLoading(true);
    if (!textToSend) setInput('');

    const startTime = performance.now();

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await response.json();
      const endTime = performance.now();

      setMessages((prev) => [...prev, { sender: 'agent', text: cleanResponseText(data.response || data.message) }]);
      setMetrics({
        route: data.route_taken || 'General Agent',
        latency: `${Math.round(endTime - startTime)}ms`,
        cache: data.cache_hit ? 'HIT' : 'MISS',
        steps: data.execution_steps || ['Router Node', 'Evaluation Node', 'Final Response']
      });
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'agent', text: "❌ Connection Error: Cloud agent is unreachable. Verify Render application service health settings." }]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0b0f19', color: '#e2e8f0', fontFamily: '"Segoe UI", Roboto, sans-serif', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    header: { width: '100%', maxWidth: '1100px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '20px' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '12px' },
    title: { color: '#38bdf8', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' },
    glowIndicator: { width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px #10b981' },
    metricsWrapper: { display: 'flex', gap: '16px' },
    card: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' },
    gridContainer: { width: '100%', maxWidth: '1100px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px', flex: 1 },
    sidebar: { display: 'flex', flexDirection: 'column', gap: '20px' },
    btnList: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' },
    testBtn: { width: '100%', textAlign: 'left', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#cbd5e1', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: '500' },
    chatContainer: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', display: 'flex', flexDirection: 'column', height: '560px', overflow: 'hidden' },
    chatHeader: { padding: '16px 20px', borderBottom: '1px solid #1f2937', backgroundColor: '#151e31', display: 'flex', alignItems: 'center', gap: '10px' },
    chatBody: { flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#0f172a' },
    userBubble: { alignSelf: 'flex-end', backgroundColor: '#0284c7', color: '#ffffff', padding: '12px 16px', borderRadius: '16px 16px 2px 16px', maxWidth: '75%', fontSize: '14px', lineHeight: '1.5', boxShadow: '0 2px 8px rgba(2,132,199,0.3)' },
    agentBubble: { alignSelf: 'flex-start', backgroundColor: '#1e293b', color: '#f1f5f9', padding: '12px 16px', borderRadius: '16px 16px 16px 2px', border: '1px solid #334155', maxWidth: '85%', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-line' },
    inputWrapper: { padding: '18px 20px', borderTop: '1px solid #1f2937', backgroundColor: '#111827', display: 'flex', gap: '12px' },
    inputField: { flex: 1, backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' },
    submitBtn: { backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <div style={styles.glowIndicator}></div>
          <div>
            <h1 style={styles.title}><Cpu size={24} /> AI AGENT COMMAND NODE</h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b', fontWeight: '500' }}>LangGraph Stateful Orchestration Pipeline</p>
          </div>
        </div>
        <div style={styles.metricsWrapper}>
          <div style={{...styles.card, padding: '10px 16px', display: 'flex', gap: '20px', fontSize: '12px', backgroundColor: '#151e31'}}>
            <div><span style={{color: '#64748b'}}>ROUTER:</span> <strong style={{color: '#4ade80'}}>{metrics.route}</strong></div>
            <div style={{width: '1px', backgroundColor: '#1e293b'}}></div>
            <div><span style={{color: '#64748b'}}>LATENCY:</span> <strong style={{color: '#facc15'}}>{metrics.latency}</strong></div>
            <div style={{width: '1px', backgroundColor: '#1e293b'}}></div>
            <div><span style={{color: '#64748b'}}>CACHE:</span> <strong style={{color: '#c084fc'}}>{metrics.cache}</strong></div>
          </div>
        </div>
      </header>

      <main style={styles.gridContainer}>
        <div style={styles.sidebar}>
          <div style={styles.card}>
            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#38bdf8', margin: '0 0 8px 0', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={16} /> Showcase Prompts</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>Click to run production test loops directly through the multi-agent execution pipeline.</p>
            <div style={styles.btnList}>
              <button style={styles.testBtn} onClick={() => handleSendMessage("How do I configure the API token?")}>🛠️ Technical: Config API</button>
              <button style={styles.testBtn} onClick={() => handleSendMessage("My billing statement looks wrong for this month.")}>💳 Financial: Billing Audit</button>
              <button style={styles.testBtn} onClick={() => handleSendMessage("Neymar")}>🌍 Knowledge: General Query</button>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Terminal size={16} /> Live Graph Execution Trace</h3>
            {metrics.steps.length === 0 ? (
              <p style={{fontSize: '12px', color: '#4b5563', fontStyle: 'italic'}}>Awaiting sequence initialization...</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {metrics.steps.map((step, i) => (
                  <div key={i} style={{fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{color: '#38bdf8'}}>➔</span>
                    <span style={{fontFamily: 'monospace', color: '#e2e8f0'}}>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <Radio size={16} style={{color: loading ? '#ef4444' : '#10b981'}} />
            <span style={{fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px', color: '#94a3b8'}}>AGENT ACTIVE LIVE CONSOLE</span>
          </div>
          
          <div style={styles.chatBody}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#4b5563', marginTop: '100px' }}>
                <MessageSquare style={{ margin: '0 auto 12px auto', opacity: 0.3 }} size={40} />
                <p style={{fontSize: '14px', margin: 0}}>Initialize system query to start execution tracing.</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} style={msg.sender === 'user' ? styles.userBubble : styles.agentBubble}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', color: '#38bdf8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace' }}>
                <Layers size={14} className="animate-spin" /> executing Graph state paths...
              </div>
            )}
          </div>

          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject statement into agent node network..."
              style={styles.inputField}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button style={styles.submitBtn} onClick={() => handleSendMessage()}>Execute</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
