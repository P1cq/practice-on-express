import { useRef, useEffect } from 'react';

export default function OtpInput({ length = 6, value, onChange }) {
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;

    const newOtp = value.split('');
    newOtp[index] = val[val.length - 1];
    const joined = newOtp.join('').slice(0, length);
    onChange(joined);

    if (index < length - 1 && val) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = value.split('');
      if (newOtp[index]) {
        newOtp[index] = '';
        onChange(newOtp.join(''));
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        newOtp[index - 1] = '';
        onChange(newOtp.join(''));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="otp-box"
        />
      ))}
    </div>
  );
}
