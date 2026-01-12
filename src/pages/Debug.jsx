
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Debug = () => {
    const [logs, setLogs] = useState([]);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [...prev, { timestamp: new Date().toISOString(), msg, type }]);
    };

    const runTests = async () => {
        setLogs([]);
        addLog("Starting Diagnostics...", 'info');

        // 1. Check Config
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        addLog(`Config Check: URL present? ${!!url}, Key present? ${!!key}`, url && key ? 'success' : 'error');

        if (!url || !key) return;

        // 2. Test Connection (Read Profiles)
        try {
            const connectionPromise = supabase.from('profiles').select('count', { count: 'exact', head: true });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timed out")), 5000));

            const { data, error, status } = await Promise.race([connectionPromise, timeoutPromise]);

            if (error) {
                addLog(`Connection Test (Public Read): Failed (${status}) - ${error.message}`, 'warning');
            } else {
                addLog(`Connection Test (Public Read): Success (${status})`, 'success');
            }
        } catch (e) {
            addLog(`Connection Test: CRITICAL FAILURE - ${e.message}`, 'error');
        }

        // 3. Test Sign Up (Random User)
        const testEmail = `debug_${Math.floor(Math.random() * 10000)}@test.com`;
        const testPass = 'password123';
        addLog(`Attempting Sign Up with ${testEmail}...`, 'info');

        try {
            const { data, error } = await supabase.auth.signUp({
                email: testEmail,
                password: testPass,
                options: {
                    data: { full_name: 'Debug User' } // Sending metadata to see if it causes 500
                }
            });

            if (error) {
                addLog(`Sign Up Failed: ${error.message} (Status: ${error.status})`, 'error');
                console.error(error);
            } else {
                addLog(`Sign Up Success! User ID: ${data.user?.id}`, 'success');
                addLog(`Is Session Active? ${!!data.session}`, data.session ? 'success' : 'warning');
            }
        } catch (e) {
            addLog(`Sign Up Exception: ${e.message}`, 'error');
        }
    };

    return (
        <div className="pt-32 px-6 pb-20 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>
            <button
                onClick={runTests}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold mb-8 hover:bg-emerald-700 transition"
            >
                RUN DIAGNOSTICS
            </button>

            <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm overflow-hidden shadow-2xl">
                {logs.length === 0 && <span className="text-gray-500">Ready to run tests...</span>}
                {logs.map((log, i) => (
                    <div key={i} className={`mb-2 border-b border-gray-800 pb-1 ${log.type === 'error' ? 'text-red-400' :
                        log.type === 'success' ? 'text-green-400' :
                            log.type === 'warning' ? 'text-yellow-400' : 'text-gray-300'
                        }`}>
                        <span className="text-gray-600 mr-4">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                        {log.msg}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Debug;
