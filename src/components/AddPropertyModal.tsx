'use client';
import { useState, useEffect } from 'react';

interface AddPropertyModalProps {
  onClose: () => void;
}

type PropertyType = 'house' | 'room';
type RoomType = 'mixed' | 'single';
type RentTime = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annually';

interface PropertyFormData {
  title: string;
  type: PropertyType;
  roomType: RoomType;
  city: string;
  price: string;
  rentTime: RentTime;
  paymentTime: RentTime;
  totalRooms: string;
  availableRooms: string;
  size: string;
  floor: string;
  bathrooms: string;
  separatedBathroom: boolean;
  residentsCount: string;
  availablePersons: string;
  priceIncludeWaterAndElectricity: boolean;
  includeFurniture: boolean;
  airConditioning: boolean;
  includeWaterHeater: boolean;
  parking: boolean;
  internet: boolean;
  nearToMetro: boolean;
  nearToMarket: boolean;
  elevator: boolean;
  trialPeriod: boolean;
  goodForForeigners: boolean;
  termsAndConditions: string;
  images: File[];
}

interface FormErrors {
  [key: string]: string;
}

const AddPropertyModal = ({ onClose }: AddPropertyModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    type: 'house',
    roomType: 'single',
    city: '',
    price: '',
    rentTime: 'monthly',
    paymentTime: 'monthly',
    totalRooms: '',
    availableRooms: '',
    size: '',
    floor: '',
    bathrooms: '',
    separatedBathroom: false,
    residentsCount: '',
    availablePersons: '',
    priceIncludeWaterAndElectricity: false,
    includeFurniture: false,
    airConditioning: false,
    includeWaterHeater: false,
    parking: false,
    internet: false,
    nearToMetro: false,
    nearToMarket: false,
    elevator: false,
    trialPeriod: false,
    goodForForeigners: false,
    termsAndConditions: '',
    images: [],
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Validate form based on current step
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: FormErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.title.trim()) newErrors.title = 'Property title is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
    } else if (stepNumber === 2) {
      if (!formData.price.trim()) newErrors.price = 'Price is required';
      if (formData.totalRooms && isNaN(Number(formData.totalRooms))) {
        newErrors.totalRooms = 'Total rooms must be a number';
      }
      if (formData.availableRooms && isNaN(Number(formData.availableRooms))) {
        newErrors.availableRooms = 'Available rooms must be a number';
      }
    } else if (stepNumber === 3) {
      if (formData.size && isNaN(Number(formData.size))) {
        newErrors.size = 'Size must be a number';
      }
      if (formData.floor && isNaN(Number(formData.floor))) {
        newErrors.floor = 'Floor must be a number';
      }
      if (formData.bathrooms && isNaN(Number(formData.bathrooms))) {
        newErrors.bathrooms = 'Bathrooms must be a number';
      }
      if (formData.residentsCount && isNaN(Number(formData.residentsCount))) {
        newErrors.residentsCount = 'Residents count must be a number';
      }
      if (formData.availablePersons && isNaN(Number(formData.availablePersons))) {
        newErrors.availablePersons = 'Available persons must be a number';
      }
    } else if (stepNumber === 5) {
      if (formData.images.length === 0) {
        newErrors.images = 'At least one image is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, images: files });
      
      // Create preview URLs for the images
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
      
      // Clear error when user selects images
      if (errors.images) {
        setErrors({ ...errors, images: '' });
      }
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(5)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Implement property submission
      console.log('Property data:', formData);
      
      // Show success message
      alert('Property added successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting property:', error);
      alert('Failed to add property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-gradient">Basic Information</h3>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 mb-2 font-medium">Property Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Cozy Studio Apartment in Downtown"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700 mb-2 font-medium">Property Type</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.type === 'house' ? 'border-primary bg-gradient-subtle' : 'border-gray-300 hover:border-primary/50'}`}
                  onClick={() => setFormData({...formData, type: 'house'})}
                >
                  <div className="flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${formData.type === 'house' ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <p className={`text-center font-medium ${formData.type === 'house' ? 'text-primary' : 'text-gray-700'}`}>House</p>
                </div>
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.type === 'room' ? 'border-primary bg-gradient-subtle' : 'border-gray-300 hover:border-primary/50'}`}
                  onClick={() => setFormData({...formData, type: 'room'})}
                >
                  <div className="flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${formData.type === 'room' ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className={`text-center font-medium ${formData.type === 'room' ? 'text-primary' : 'text-gray-700'}`}>Room</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="roomType" className="block text-gray-700 mb-2 font-medium">Room Type</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.roomType === 'single' ? 'border-primary bg-gradient-subtle' : 'border-gray-300 hover:border-primary/50'}`}
                  onClick={() => setFormData({...formData, roomType: 'single'})}
                >
                  <div className="flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${formData.roomType === 'single' ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className={`text-center font-medium ${formData.roomType === 'single' ? 'text-primary' : 'text-gray-700'}`}>Single</p>
                </div>
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.roomType === 'mixed' ? 'border-primary bg-gradient-subtle' : 'border-gray-300 hover:border-primary/50'}`}
                  onClick={() => setFormData({...formData, roomType: 'mixed'})}
                >
                  <div className="flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${formData.roomType === 'mixed' ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className={`text-center font-medium ${formData.roomType === 'mixed' ? 'text-primary' : 'text-gray-700'}`}>Mixed</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="city" className="block text-gray-700 mb-2 font-medium">City</label>
              <input
                type="text"
                id="city"
                name="city"
                className={`w-full px-4 py-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., New York, Chicago, San Francisco"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-gradient">Pricing & Availability</h3>
            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700 mb-2 font-medium">Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  id="price"
                  name="price"
                  className={`w-full pl-8 pr-4 py-3 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 800"
                />
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="rentTime" className="block text-gray-700 mb-2 font-medium">Rent Time</label>
                <select
                  id="rentTime"
                  name="rentTime"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  value={formData.rentTime}
                  onChange={handleInputChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semiannual">Semi-annual</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="paymentTime" className="block text-gray-700 mb-2 font-medium">Payment Time</label>
                <select
                  id="paymentTime"
                  name="paymentTime"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  value={formData.paymentTime}
                  onChange={handleInputChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semiannual">Semi-annual</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="totalRooms" className="block text-gray-700 mb-2 font-medium">Total Rooms</label>
                <input
                  type="text"
                  id="totalRooms"
                  name="totalRooms"
                  className={`w-full px-4 py-3 border ${errors.totalRooms ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.totalRooms}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                />
                {errors.totalRooms && <p className="text-red-500 text-sm mt-1">{errors.totalRooms}</p>}
              </div>
              
              <div>
                <label htmlFor="availableRooms" className="block text-gray-700 mb-2 font-medium">Available Rooms</label>
                <input
                  type="text"
                  id="availableRooms"
                  name="availableRooms"
                  className={`w-full px-4 py-3 border ${errors.availableRooms ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.availableRooms}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                />
                {errors.availableRooms && <p className="text-red-500 text-sm mt-1">{errors.availableRooms}</p>}
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-gradient">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="size" className="block text-gray-700 mb-2 font-medium">Size (sq ft)</label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  className={`w-full px-4 py-3 border ${errors.size ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                />
                {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
              </div>
              
              <div>
                <label htmlFor="floor" className="block text-gray-700 mb-2 font-medium">Floor</label>
                <input
                  type="text"
                  id="floor"
                  name="floor"
                  className={`w-full px-4 py-3 border ${errors.floor ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                />
                {errors.floor && <p className="text-red-500 text-sm mt-1">{errors.floor}</p>}
              </div>
              
              <div>
                <label htmlFor="bathrooms" className="block text-gray-700 mb-2 font-medium">Bathrooms</label>
                <input
                  type="text"
                  id="bathrooms"
                  name="bathrooms"
                  className={`w-full px-4 py-3 border ${errors.bathrooms ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                />
                {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Bathroom Type</label>
                <div className="flex items-center h-12 px-4 border border-gray-300 rounded-lg">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="separatedBathroom"
                      className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                      checked={formData.separatedBathroom}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">Separated Bathroom</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label htmlFor="residentsCount" className="block text-gray-700 mb-2 font-medium">Current Residents Count</label>
                <input
                  type="text"
                  id="residentsCount"
                  name="residentsCount"
                  className={`w-full px-4 py-3 border ${errors.residentsCount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.residentsCount}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                />
                {errors.residentsCount && <p className="text-red-500 text-sm mt-1">{errors.residentsCount}</p>}
              </div>
              
              <div>
                <label htmlFor="availablePersons" className="block text-gray-700 mb-2 font-medium">Available Persons</label>
                <input
                  type="text"
                  id="availablePersons"
                  name="availablePersons"
                  className={`w-full px-4 py-3 border ${errors.availablePersons ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.availablePersons}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                />
                {errors.availablePersons && <p className="text-red-500 text-sm mt-1">{errors.availablePersons}</p>}
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-gradient">Amenities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="priceIncludeWaterAndElectricity"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.priceIncludeWaterAndElectricity}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Price includes water and electricity</span>
                </label>
              </div>
              
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="includeFurniture"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.includeFurniture}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Furniture included</span>
                </label>
              </div>
              
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="airConditioning"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.airConditioning}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Air conditioning</span>
                </label>
              </div>
              
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="includeWaterHeater"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.includeWaterHeater}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Water heater included</span>
                </label>
              </div>
              
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="parking"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.parking}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Parking available</span>
                </label>
              </div>
              
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="internet"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.internet}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Internet included</span>
                </label>
              </div>
              
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="nearToMetro"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.nearToMetro}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Near to metro</span>
                </label>
              </div>
              
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="nearToMarket"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.nearToMarket}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Near to market</span>
                </label>
              </div>
              
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="elevator"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.elevator}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Elevator available</span>
                </label>
              </div>
              
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="trialPeriod"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.trialPeriod}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Trial period available</span>
                </label>
              </div>
              
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="goodForForeigners"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.goodForForeigners}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Good for foreigners</span>
                </label>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-gradient">Additional Information</h3>
            <div className="mb-6">
              <label htmlFor="termsAndConditions" className="block text-gray-700 mb-2 font-medium">Terms and Conditions</label>
              <textarea
                id="termsAndConditions"
                name="termsAndConditions"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                value={formData.termsAndConditions}
                onChange={handleInputChange}
                placeholder="Enter any specific terms and conditions for your property..."
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="images" className="block text-gray-700 mb-2 font-medium">Property Images</label>
              <div className={`border-2 border-dashed ${errors.images ? 'border-red-500' : 'border-gray-300'} rounded-lg p-6 text-center transition-colors`}>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label htmlFor="images" className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 mb-1">Drag and drop your images here, or click to browse</p>
                  <p className="text-sm text-gray-500">You can select multiple images</p>
                </label>
              </div>
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
              
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-700 mb-2 font-medium">Selected Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button 
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const newImages = [...formData.images];
                            newImages.splice(index, 1);
                            setFormData({...formData, images: newImages});
                            
                            const newPreviews = [...previewImages];
                            newPreviews.splice(index, 1);
                            setPreviewImages(newPreviews);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto shadow-soft">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-gradient rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
            RF
          </div>
          <h2 className="text-2xl font-bold text-gradient">Add New Property</h2>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${
                  stepNumber < 5 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber
                      ? 'bg-gradient text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > stepNumber ? 'bg-gradient' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Basic Info</span>
            <span>Pricing</span>
            <span>Details</span>
            <span>Amenities</span>
            <span>Images</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
            )}
            
            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-5 py-2.5 bg-gradient text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-soft flex items-center"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto px-5 py-2.5 bg-gradient text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-soft flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal; 