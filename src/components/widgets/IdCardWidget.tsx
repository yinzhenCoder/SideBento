import React, { useState } from 'react';
import { CreditCard, Copy, Check, RefreshCw, ShieldCheck, UserCheck } from 'lucide-react';
import { AREA_CODES, generateIdCard, verifyIdCard } from '../../utils/idCard';

interface Props {
  onCopy: (text: string, label: string) => void;
}

export const IdCardWidget: React.FC<Props> = ({ onCopy }) => {
  const [selectedArea, setSelectedArea] = useState(AREA_CODES[0].code);
  const [birthDate, setBirthDate] = useState('1996-05-20');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  // Generated result
  const [generatedId, setGeneratedId] = useState(() =>
    generateIdCard({ areaCode: AREA_CODES[0].code, birthDate: '1996-05-20', gender: 'male' })
  );
  const [copied, setCopied] = useState(false);

  // Manual verify mode toggle
  const [customInput, setCustomInput] = useState('');
  const [verifyMode, setVerifyMode] = useState(false);

  const handleGenerate = () => {
    try {
      const id = generateIdCard({
        areaCode: selectedArea,
        birthDate,
        gender,
      });
      setGeneratedId(id);
    } catch {
      // fallback
    }
  };

  const handleCopy = (idText: string) => {
    onCopy(idText, '身份证号码');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const currentInfo = verifyIdCard(verifyMode && customInput ? customInput : generatedId);

  return (
    <div className="bg-white/70 dark:bg-zinc-800/60 rounded-2xl p-4 border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-zinc-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              身份证号码生成器
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded border border-blue-200/50 dark:border-blue-800/50">
                GB 11643
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">符合 ISO 7064:1983.MOD 11-2 校验位标准</p>
          </div>
        </div>

        <button
          onClick={() => setVerifyMode(!verifyMode)}
          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors ${
            verifyMode
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
          }`}
        >
          {verifyMode ? '返回生成' : '验证已有'}
        </button>
      </div>

      {!verifyMode ? (
        <div className="mt-3.5 space-y-3">
          {/* Inputs Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 block mb-1">
                行政区划 (前6位)
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {AREA_CODES.map((area) => (
                  <option key={area.code} value={area.code}>
                    {area.name} ({area.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 block mb-1">
                出生日期 (中间8位)
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Gender and Trigger */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400">性别:</span>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === 'male'}
                  onChange={() => setGender('male')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 dark:text-zinc-200">男 (奇数)</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === 'female'}
                  onChange={() => setGender('female')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 dark:text-zinc-200">女 (偶数)</span>
              </label>
            </div>

            <button
              onClick={handleGenerate}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>重新生成</span>
            </button>
          </div>

          {/* Result Card */}
          <div className="p-3 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-950/25 dark:to-indigo-950/20 rounded-xl border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium block mb-0.5">
                18位合规测试身份证号
              </span>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-zinc-100 tracking-wide">
                <span>{generatedId.slice(0, 6)}</span>{' '}
                <span className="text-blue-600 dark:text-blue-400">{generatedId.slice(6, 14)}</span>{' '}
                <span>{generatedId.slice(14, 17)}</span>
                <span className="text-amber-600 dark:text-amber-400 font-black">
                  {generatedId.slice(17)}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleCopy(generatedId)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium shadow-sm transition-all active:scale-95 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制' : '复制'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Verify mode */
        <div className="mt-3.5 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">
              输入待校验的 18 位身份证号码
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="如 11010119900307237X"
              className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Info Breakdown Footer */}
      {currentInfo.valid && currentInfo.info && (
        <div className="mt-3 p-2.5 rounded-xl bg-slate-100/70 dark:bg-zinc-900/50 border border-slate-200/50 dark:border-zinc-800 text-[11px] text-slate-600 dark:text-zinc-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MOD 11-2 校验通过</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{currentInfo.info.province}</span>
            <span>·</span>
            <span>{currentInfo.info.gender}</span>
            <span>·</span>
            <span>{currentInfo.info.age}岁</span>
          </div>
        </div>
      )}

      {!currentInfo.valid && (
        <div className="mt-3 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <span>⚠️ {currentInfo.reason}</span>
        </div>
      )}
    </div>
  );
};
