import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface MathCaptchaProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
  error?: string;
}

export function MathCaptcha({
  value,
  onChange,
  onValidationChange,
  error,
}: MathCaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState<"+" | "-">("+");

  const generateCaptcha = () => {
    const newNum1 = Math.floor(Math.random() * 9) + 1; // 1-9
    const newNum2 = Math.floor(Math.random() * 9) + 1; // 1-9
    const newOperation = Math.random() > 0.5 ? "+" : "-";

    // Ensure result is always positive for subtraction
    if (newOperation === "-" && newNum1 < newNum2) {
      setNum1(newNum2);
      setNum2(newNum1);
    } else {
      setNum1(newNum1);
      setNum2(newNum2);
    }
    setOperation(newOperation);
    onChange(""); // Reset input when captcha is regenerated
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    const correctAnswer = operation === "+" ? num1 + num2 : num1 - num2;
    const userAnswer = parseInt(value);
    const isValid = !isNaN(userAnswer) && userAnswer === correctAnswer;

    onValidationChange(isValid);
  }, [value, num1, num2, operation, onValidationChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Verifikasi Keamanan *
      </label>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-gray-50 px-6 py-3 font-mono text-xl font-bold text-gray-800">
          <span>{num1}</span>
          <span className="text-2xl">{operation}</span>
          <span>{num2}</span>
          <span className="text-2xl">=</span>
          <span className="text-gray-400">?</span>
        </div>
        <button
          type="button"
          onClick={generateCaptcha}
          className="rounded-lg border border-gray-300 bg-white p-2 hover:bg-gray-50 transition-colors"
          title="Generate captcha baru"
        >
          <RefreshCw className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <input
        type="number"
        placeholder="Masukkan hasil perhitungan"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
