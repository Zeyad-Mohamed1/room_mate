import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterStep2Props {
  phone: string;
  setPhone: (value: string) => void;
  age: string;
  setAge: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  nationality: string;
  setNationality: (value: string) => void;
  occupation: string;
  setOccupation: (value: string) => void;
  smoker: boolean;
  setSmoker: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
}

const RegisterStep2: React.FC<RegisterStep2Props> = ({
  phone,
  setPhone,
  age,
  setAge,
  gender,
  setGender,
  nationality,
  setNationality,
  occupation,
  setOccupation,
  smoker,
  setSmoker,
  onSubmit,
  onBack,
  loading,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          type="text"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select value={gender} onValueChange={(value) => setGender(value)}>
          <SelectTrigger className="w-full h-11 px-3 border border-input rounded-md focus:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-transparent">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationality">Nationality</Label>
        <Input
          type="text"
          id="nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder="Enter your nationality"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="occupation">Occupation</Label>
        <Input
          type="text"
          id="occupation"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          placeholder="Enter your occupation"
          className="h-11"
        />
      </div>

      <div className="flex items-center">
        <input
          id="smoker"
          type="checkbox"
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          checked={smoker}
          onChange={(e) => setSmoker(e.target.checked)}
        />
        <Label htmlFor="smoker" className="ml-2">
          I am a smoker
        </Label>
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-1/2 h-11"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="w-1/2 bg-gradient text-white hover:opacity-90 transition-opacity shadow-soft h-11 disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterStep2;
