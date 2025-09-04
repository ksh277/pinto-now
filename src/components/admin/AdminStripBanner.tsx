import { useState } from 'react';
import { useStripBanner } from '@/contexts/StripBannerContext';

export default function AdminStripBanner() {
  const { config, setConfig } = useStripBanner();
  const [message, setMessage] = useState(config.message);
  const [bgColor, setBgColor] = useState(config.bgColor);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div style={{ maxWidth: 400, margin: '32px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>띠배너 등록/관리</h2>
      <label style={{ display: 'block', marginBottom: 12 }}>
        배너 텍스트
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{ width: '100%', marginTop: 4, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
      </label>
      <label style={{ display: 'block', marginBottom: 12 }}>
        배경 색상
        <input
          type="color"
          value={bgColor}
          onChange={e => setBgColor(e.target.value)}
          style={{ marginLeft: 8, verticalAlign: 'middle' }}
        />
      </label>
      <button
        type="button"
        onClick={() => {
          setShowPreview(true);
          setConfig({ message, bgColor });
        }}
        style={{ padding: '8px 16px', background: '#222', color: '#fff', borderRadius: 4, border: 'none', cursor: 'pointer' }}
      >
        적용 및 미리보기
      </button>
      {showPreview && (
        <div style={{ marginTop: 24 }}>
          <div
            style={{ background: bgColor, color: '#222', padding: '12px 0', textAlign: 'center', fontWeight: 500, borderRadius: 4 }}
          >
            {message || '띠배너 텍스트를 입력하세요'}
          </div>
        </div>
      )}
    </div>
  );
}
