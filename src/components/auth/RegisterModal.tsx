import { useState } from "react";
import RegisterStep1 from "./registration/RegisterStep1";
import RegisterStep2 from "./registration/RegisterStep2";
import { authService } from "@/services/authService";
import { toast } from "react-hot-toast";

interface RegisterModalProps {
  onClose: () => void;
}

const RegisterModal = ({ onClose }: RegisterModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Step 1 data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2 data
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [occupation, setOccupation] = useState("");
  const [smoker, setSmoker] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Move to step 2
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register the user
      await authService.register({
        name,
        email,
        password,
        phone,
        age,
        gender,
        nationality,
        occupation,
        smoker,
      });

      // Login is now handled inside the register method in authService
      toast.success("Registration successful! You are now logged in.");
      // Success - close modal
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative shadow-soft">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
            RF
          </div>
          <h2 className="text-2xl font-bold text-gradient">RoommateFinder</h2>
        </div>

        <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">
          {step === 1 ? "Create Your Account" : "Complete Your Profile"}
          <div className="flex justify-center mt-2">
            <span
              className={`w-3 h-3 rounded-full mx-1 ${
                step === 1 ? "bg-primary" : "bg-gray-300"
              }`}
            ></span>
            <span
              className={`w-3 h-3 rounded-full mx-1 ${
                step === 2 ? "bg-primary" : "bg-gray-300"
              }`}
            ></span>
          </div>
        </h3>

        {step === 1 ? (
          <RegisterStep1
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            onSubmit={handleStep1Submit}
          />
        ) : (
          <RegisterStep2
            phone={phone}
            setPhone={setPhone}
            age={age}
            setAge={setAge}
            gender={gender}
            setGender={setGender}
            nationality={nationality}
            setNationality={setNationality}
            occupation={occupation}
            setOccupation={setOccupation}
            smoker={smoker}
            setSmoker={setSmoker}
            onSubmit={handleStep2Submit}
            onBack={() => setStep(1)}
            loading={loading}
          />
        )}

        {step === 1 && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => {
                  onClose();
                }}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
