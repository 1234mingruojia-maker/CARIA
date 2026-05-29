'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [status, setStatus] = useState('กำลังทดสอบ...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      // ทดสอบการเชื่อมต่อ
      const { data: session } = await supabase.auth.getSession();
      
      // ทดสอบดึงข้อมูลจากตาราง (ถ้ายังไม่มีตารางจะ error)
      const { data, error } = await supabase
        .from('profiles')           // เปลี่ยนชื่อตารางได้
        .select('*')
        .limit(5);

      if (error) {
        setStatus('✅ เชื่อมต่อ Supabase สำเร็จ');
        setError(error.message);
      } else {
        setStatus('✅ เชื่อมต่อ Supabase สำเร็จและดึงข้อมูลได้');
        setData(data);
      }
    } catch (err: any) {
      setStatus('❌ มีปัญหาในการเชื่อมต่อ');
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">CARIA - ทดสอบ Supabase</h1>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
        <p className="text-xl mb-4">{status}</p>
        
        {error && (
          <p className="text-red-500 bg-red-50 p-4 rounded mb-4">
            {error}
          </p>
        )}

        {data && (
          <div>
            <h3 className="font-semibold mb-2">ข้อมูลที่ดึงได้:</h3>
            <pre className="bg-black text-green-400 p-4 rounded overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <p className="mt-8 text-sm text-gray-500">
        กำลังทดสอบการเชื่อมต่อกับ Supabase...
      </p>
    </div>
  );
}