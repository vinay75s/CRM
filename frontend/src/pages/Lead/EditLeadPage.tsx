import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, User, MapPin, Building, Home, DollarSign, MessageSquare } from "lucide-react";
import { leadService } from "../../services/leadService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Lead } from "@/types";

const OPTIONS = {
  visaResidencyStatus: ["Citizen (no visa required)", "Permanent Resident / Green Card", "Work Visa", "Student Visa", "Business Visa", "Tourist Visa", "OCI (Overseas Citizen of India)", "PIO (Person of Indian Origin)", "Dependent Visa", "Retired / Pensioner Visa", "Digital Nomad Visa", "Other"],
  leadSource: ["I've used Avacasa before", "Friend / Family referral", "Colleague referral", "Google Search", "Facebook", "Instagram", "LinkedIn", "YouTube", "Twitter/X", "Property portal (99acres, MagicBricks, etc.)", "News article / Blog", "Podcast", "Real estate event / Expo", "WhatsApp group", "Email newsletter", "Print advertisement", "TV advertisement", "Radio", "SMS campaign", "Other"],
  profession: ["Salaried - Private Sector", "Salaried - Government / PSU", "Business Owner / Entrepreneur", "Self-employed / Freelancer", "Medical Professional", "Legal Professional", "Retired", "Other"],
  householdSize: ["1", "2", "3", "4", "5", "6", "7", "8+"],
  householdIncomeBandInr: ["Under ₹10 Lakhs", "₹10-25 Lakhs", "₹25-50 Lakhs", "₹50-75 Lakhs", "₹75 Lakhs - ₹1 Crore", "₹1-1.5 Crores", "₹1.5-2 Crores", "₹2-3 Crores", "₹3-5 Crores", "Above ₹5 Crores"],
  priorPropertiesPurchased: ["0 (this is my first)", "1", "2", "3", "4", "5", "6-10", "More than 10"],
  propertyRolePrimary: ["Primary residence", "Second home / Weekend getaway", "Vacation home", "Retirement home", "Investment property", "Rental income property", "Short-term rental (Airbnb)", "Agricultural / Farming", "Commercial use", "Land banking", "For children / Family", "Holiday home for family", "Other"],
  searchTrigger: ["Peace & relaxation", "Retirement planning", "Investment / Wealth building", "Rental income", "Nature / Clean air", "Escape from city", "Work from anywhere lifestyle", "Family gatherings", "Health reasons", "Children's future", "Other"],
  buyingJourneyStage: ["Just exploring / Early research", "Actively searching", "Ready to buy soon"],
  explorationDuration: ["Less than 1 month", "1-3 months", "3-6 months", "6-12 months", "1-2 years", "More than 2 years"],
  purchaseTimeline: ["Immediately / ASAP", "Within 3 months", "3-6 months", "6-12 months", "1-2 years", "2-3 years", "3-5 years", "No fixed timeline", "Just exploring"],
  totalBudgetBandInr: ["Less than ₹25 Lakhs", "₹25-50 Lakhs", "₹50-75 Lakhs", "₹75 Lakhs - ₹1 Crore", "₹1-1.5 Crores", "₹1.5-2 Crores", "₹2-3 Crores", "₹3-5 Crores", "₹5-10 Crores", "₹10-25 Crores", "Above ₹25 Crores"],
  buyingCountryFocus: ["India", "Indonesia", "Thailand", "Portugal", "Other"],
  targetStatesRegions: ["Haryana", "Himachal Pradesh", "Uttarakhand", "Rajasthan", "Punjab", "Uttar Pradesh", "Maharashtra", "Goa", "Karnataka", "Kerala", "Tamil Nadu", "Telangana", "Andhra Pradesh", "West Bengal", "Other"],
  climateRiskAvoidance: ["Flooding / Waterlogging", "Earthquakes", "Cyclones / Hurricanes", "Extreme heat", "Extreme cold", "Drought", "Landslides", "Air pollution", "None - not concerned"],
  preferredClimate: ["Cool / Pleasant year-round", "Warm & tropical", "Four distinct seasons", "Dry / Arid", "Coastal / Humid", "Mountain / Alpine", "Mediterranean"],
  locationPriorities: ["Easy flight access", "Good road connectivity", "Close to major city", "Close to healthcare", "Good schools nearby", "Low cost of living", "Safety & security", "Expat-friendly community", "Cultural activities", "Nightlife & entertainment", "Outdoor activities", "Water activities", "Golf courses", "Spiritual / Religious sites", "Business opportunities", "Tax benefits", "Other"],
  areaTypePreference: ["Urban city center", "Suburban", "Semi-rural / Countryside", "Rural / Remote", "Beachfront / Coastal", "Hill station / Mountains"],
  naturalFeatureClosest: ["Beachfront / Ocean view", "Lake view / Lakefront", "River view / Riverside", "Mountain view", "Valley view", "Forest / Jungle", "Farmland / Agriculture", "Desert landscape", "Vineyard / Orchard", "Golf course view", "City skyline view", "Garden / Park view", "No preference"],
  strPermissionImportance: ["Must-have (deal breaker)", "Nice to have", "Not important", "Prefer not to have STR"],
  assetTypeInterest: ["Apartment / Flat", "Villa / Independent house", "Row house / Townhouse", "Farmhouse", "Agricultural land", "Plotted land", "Commercial property", "Other"],
  farmlandWaterSourcePreference: ["Groundwater / Borewell", "Canal irrigation", "River / Stream", "Rainwater harvesting", "No preference"],
  unitConfiguration: ["Studio", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "6+ BHK", "Flexible"],
  farmlandLandSizeBucket: ["Under 0.25 acres", "0.25-0.5 acres", "0.5-1 acre", "1-2 acres", "2-5 acres", "5-10 acres", "10-25 acres", "25+ acres"],
  ownershipStructurePreference: ["Full ownership (Freehold)", "Leasehold", "Fractional ownership", "Co-ownership", "Trust ownership", "Company ownership"],
  possessionStagePreference: ["Ready to move", "Under construction", "Pre-launch", "Resale", "Land only", "Any"],
  possessionTimelineBucket: ["Immediate", "Within 3 months", "3-6 months", "6-12 months", "1-2 years", "2-3 years", "3-5 years", "5+ years", "Flexible", "Not sure"],
  managementModelPreference: ["Professional property management", "Self-managed", "Caretaker / On-site staff", "Developer-managed", "Undecided"],
  fundingPreference: ["Loan / Mortgage", "Self-funded", "Part loan, part self", "Undecided"],
  communityFormatPreference: ["Gated community", "Standalone property", "Apartment complex", "Township", "Farm community", "No preference"],
  communityFriendlyFor: ["Pet-friendly", "Senior-friendly", "Child-friendly", "Family-oriented", "Singles / Couples", "Work from home", "Wellness focused"],
  vastuPreferredDirections: ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"],
  furnishingLevelPreference: ["Fully furnished", "Semi-furnished", "Unfurnished", "Modular ready", "Shell only", "Flexible"],
  interiorFinishLevel: ["Standard / Basic", "Premium", "Luxury / Ultra-premium"],
  communityOutdoorAmenitiesTop: ["Swimming pool", "Clubhouse", "Gym / Fitness center", "Tennis court", "Basketball court", "Badminton court", "Jogging track", "Walking paths", "Cycling track", "Children's play area", "Garden / Landscaping", "BBQ area", "Party lawn", "Open-air theater", "Gazebo / Pavilion", "Lake / Pond", "Water fountain", "Yoga deck", "Meditation garden", "Sports complex", "Cricket pitch", "Football field", "Volleyball court", "Skating rink", "Adventure zone", "Tree house", "Pet park", "Bird watching area", "Organic farm", "Fruit orchard", "Herb garden", "Amphitheater"],
  homeMustHaveFeatures: ["Open-plan living", "Modular kitchen", "Island kitchen", "Breakfast counter", "Utility / Service area", "Store room", "Puja room", "Home office / Study", "Walk-in wardrobe", "Attached bathroom (all rooms)", "Guest bathroom", "Servant room", "Balcony / Terrace", "Covered parking", "Visitor parking"],
  homeNiceToHaveFeatures: ["Private gym / Workout room", "Home theater", "Wine cellar", "Bar counter", "Spa / Jacuzzi room", "Steam / Sauna room", "Games room", "Library / Reading room", "Art studio", "Music room", "Kids playroom", "Meditation room", "Guest suite", "Separate living areas", "Double-height ceiling", "Floor-to-ceiling windows", "Skylight", "Fireplace", "Private elevator", "Rooftop access", "Basement", "Attic", "Safe room / Panic room", "EV charging point"],
  smartHomeSecurityFeatures: ["Smart locks", "Video doorbell", "CCTV cameras", "Motion sensors", "Smart lighting", "Smart thermostat", "Voice assistant integration", "Automated blinds / Curtains", "Intruder alarm system"],
  privateOutdoorFeatures: ["Private swimming pool", "Private garden", "Terrace garden", "Outdoor kitchen / BBQ", "Gazebo", "Fire pit", "Outdoor shower", "Hammock area", "Treehouse", "Koi pond", "Putting green", "Hot tub / Jacuzzi", "Outdoor gym"],
};

const EditLeadPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", email: "", homeCountry: "", taxResidencyCountry: "",
    visaResidencyStatus: "", leadSource: "", ageYears: "", profession: "", householdSize: "",
    householdIncomeBandInr: "", priorPropertiesPurchased: "", propertyRolePrimary: [] as string[],
    searchTrigger: [] as string[], buyingJourneyStage: "", explorationDuration: "", purchaseTimeline: "",
    totalBudgetBandInr: "", propertyVisionNotes: "", aboutYouNotes: "", ownershipTimelineNotes: "",
    locationDealbreakerNotes: "", finalNotes: "", currentHomeCity: "", currentHomeState: "",
    currentHomeCountry: "", buyingCountryFocus: "", targetStatesRegions: [] as string[],
    climateRiskAvoidance: [] as string[], targetLocations: [] as string[], preferredClimate: [] as string[],
    locationPriorities: [] as string[], areaTypePreference: [] as string[], naturalFeatureClosest: [] as string[],
    strPermissionImportance: "", assetTypeInterest: [] as string[], farmlandWaterSourcePreference: "",
    unitConfiguration: [] as string[], farmlandLandSizeBucket: [] as string[], ownershipStructurePreference: "",
    possessionStagePreference: "", possessionTimelineBucket: "", managementModelPreference: "",
    fundingPreference: "", communityFormatPreference: "", communityFriendlyFor: [] as string[],
    communityOutdoorAmenitiesTop: [] as string[], vastuPreferredDirections: [] as string[],
    furnishingLevelPreference: "", homeMustHaveFeatures: [] as string[], homeNiceToHaveFeatures: [] as string[],
    interiorFinishLevel: "", smartHomeSecurityFeatures: [] as string[], privateOutdoorFeatures: [] as string[],
    idealHomeNotes: "",
  });

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      try {
        const response = await leadService.getLeadById(id);
        const l = response.data;
        setLead(l);
        setFormData({
          firstName: l.firstName || "", lastName: l.lastName || "", phone: l.phone || "", email: l.email || "",
          homeCountry: l.homeCountry || "", taxResidencyCountry: l.taxResidencyCountry || "",
          visaResidencyStatus: l.visaResidencyStatus || "", leadSource: l.leadSource || "",
          ageYears: l.ageYears?.toString() || "", profession: l.profession || "", householdSize: l.householdSize || "",
          householdIncomeBandInr: l.householdIncomeBandInr || "", priorPropertiesPurchased: l.priorPropertiesPurchased || "",
          propertyRolePrimary: l.propertyRolePrimary || [], searchTrigger: l.searchTrigger || [],
          buyingJourneyStage: l.buyingJourneyStage || "", explorationDuration: l.explorationDuration || "",
          purchaseTimeline: l.purchaseTimeline || "", totalBudgetBandInr: l.totalBudgetBandInr || "",
          propertyVisionNotes: l.propertyVisionNotes || "", aboutYouNotes: l.aboutYouNotes || "",
          ownershipTimelineNotes: l.ownershipTimelineNotes || "", locationDealbreakerNotes: l.locationDealbreakerNotes || "",
          finalNotes: l.finalNotes || "", currentHomeCity: l.currentHomeCity || "", currentHomeState: l.currentHomeState || "",
          currentHomeCountry: l.currentHomeCountry || "", buyingCountryFocus: l.buyingCountryFocus || "",
          targetStatesRegions: l.targetStatesRegions || [], climateRiskAvoidance: l.climateRiskAvoidance || [],
          targetLocations: l.targetLocations || [], preferredClimate: l.preferredClimate || [],
          locationPriorities: l.locationPriorities || [], areaTypePreference: l.areaTypePreference || [],
          naturalFeatureClosest: l.naturalFeatureClosest || [], strPermissionImportance: l.strPermissionImportance || "",
          assetTypeInterest: l.assetTypeInterest || [], farmlandWaterSourcePreference: l.farmlandWaterSourcePreference || "",
          unitConfiguration: l.unitConfiguration || [], farmlandLandSizeBucket: l.farmlandLandSizeBucket || [],
          ownershipStructurePreference: l.ownershipStructurePreference || "", possessionStagePreference: l.possessionStagePreference || "",
          possessionTimelineBucket: l.possessionTimelineBucket || "", managementModelPreference: l.managementModelPreference || "",
          fundingPreference: l.fundingPreference || "", communityFormatPreference: l.communityFormatPreference || "",
          communityFriendlyFor: l.communityFriendlyFor || [], communityOutdoorAmenitiesTop: l.communityOutdoorAmenitiesTop || [],
          vastuPreferredDirections: l.vastuPreferredDirections || [], furnishingLevelPreference: l.furnishingLevelPreference || "",
          homeMustHaveFeatures: l.homeMustHaveFeatures || [], homeNiceToHaveFeatures: l.homeNiceToHaveFeatures || [],
          interiorFinishLevel: l.interiorFinishLevel || "", smartHomeSecurityFeatures: l.smartHomeSecurityFeatures || [],
          privateOutdoorFeatures: l.privateOutdoorFeatures || [], idealHomeNotes: l.idealHomeNotes || "",
        });
      } catch (err) {
        setError("Failed to load lead");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const handleChange = (field: string, value: string | string[] | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleCheckbox = (field: string, value: string, checked: boolean) => {
    const current = formData[field as keyof typeof formData] as string[];
    if (checked) handleChange(field, [...current, value]);
    else handleChange(field, current.filter(v => v !== value));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !validateForm()) return;
    setLoading(true);
    setError(null);
    try {
      const payload = { ...formData, ageYears: formData.ageYears ? parseInt(formData.ageYears) : undefined };
      await leadService.updateLead(id, payload);
      navigate(`/leads/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update lead");
    } finally {
      setLoading(false);
    }
  };

  const CheckboxGroup = ({ field, options, cols = 3 }: { field: string; options: string[]; cols?: number }) => (
    <div className={`grid grid-cols-2 md:grid-cols-${cols} gap-2`}>
      {options.map(opt => (
        <label key={opt} className="flex items-center space-x-2 cursor-pointer text-sm">
          <Checkbox checked={(formData[field as keyof typeof formData] as string[]).includes(opt)} onCheckedChange={(c) => handleCheckbox(field, opt, !!c)} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );

  const SelectField = ({ field, label, options, required }: { field: string; label: string; options: string[]; required?: boolean }) => (
    <div className="space-y-2">
      <Label>{label} {required && <span className="text-red-400">*</span>}</Label>
      <Select value={formData[field as keyof typeof formData] as string} onChange={(e) => handleChange(field, e.target.value)} className={errors[field] ? 'border-red-500' : ''}>
        <option value="">Select...</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </Select>
      {errors[field] && <p className="text-red-400 text-sm">{errors[field]}</p>}
    </div>
  );

  if (fetchLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  if (!lead) return <div className="min-h-screen bg-background flex items-center justify-center text-gray-400">Lead not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gray-900/50 border-b border-gray-800 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate(`/leads/${id}`)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" /><span className="text-sm">Back to Lead</span>
          </button>
          <h1 className="text-2xl font-bold">Edit Lead</h1>
          <p className="text-gray-400 text-sm">Update {lead.firstName} {lead.lastName}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center"><User className="h-4 w-4 text-blue-400" /></div>Customer Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>First Name <span className="text-red-400">*</span></Label><Input value={formData.firstName} onChange={e => handleChange("firstName", e.target.value)} className={errors.firstName ? 'border-red-500' : ''} />{errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}</div>
                <div className="space-y-2"><Label>Last Name</Label><Input value={formData.lastName} onChange={e => handleChange("lastName", e.target.value)} /></div>
                <div className="space-y-2"><Label>Email <span className="text-red-400">*</span></Label><Input type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} className={errors.email ? 'border-red-500' : ''} />{errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}</div>
                <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={e => handleChange("phone", e.target.value)} /></div>
                <div className="space-y-2"><Label>Home Country</Label><Input value={formData.homeCountry} onChange={e => handleChange("homeCountry", e.target.value)} /></div>
                <div className="space-y-2"><Label>Tax Residency Country</Label><Input value={formData.taxResidencyCountry} onChange={e => handleChange("taxResidencyCountry", e.target.value)} /></div>
                <SelectField field="visaResidencyStatus" label="Visa / Residency Status" options={OPTIONS.visaResidencyStatus} />
                <SelectField field="leadSource" label="Lead Source" options={OPTIONS.leadSource} />
                <div className="space-y-2"><Label>Age</Label><Input type="number" value={formData.ageYears} onChange={e => handleChange("ageYears", e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>

          {/* About You */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center"><User className="h-4 w-4 text-green-400" /></div>About You</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField field="profession" label="Profession" options={OPTIONS.profession} />
                <SelectField field="householdSize" label="Household Size" options={OPTIONS.householdSize} />
                <SelectField field="householdIncomeBandInr" label="Household Income" options={OPTIONS.householdIncomeBandInr} />
              </div>
              <div className="space-y-2"><Label>About You Notes</Label><Textarea value={formData.aboutYouNotes} onChange={e => handleChange("aboutYouNotes", e.target.value)} rows={2} /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Current City</Label><Input value={formData.currentHomeCity} onChange={e => handleChange("currentHomeCity", e.target.value)} /></div>
                <div className="space-y-2"><Label>Current State</Label><Input value={formData.currentHomeState} onChange={e => handleChange("currentHomeState", e.target.value)} /></div>
                <div className="space-y-2"><Label>Current Country</Label><Input value={formData.currentHomeCountry} onChange={e => handleChange("currentHomeCountry", e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>

          {/* Buying Journey */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center"><DollarSign className="h-4 w-4 text-purple-400" /></div>Buying Journey</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField field="priorPropertiesPurchased" label="Properties Purchased Before" options={OPTIONS.priorPropertiesPurchased} />
                <SelectField field="buyingJourneyStage" label="Journey Stage" options={OPTIONS.buyingJourneyStage} />
                <SelectField field="explorationDuration" label="Exploration Duration" options={OPTIONS.explorationDuration} />
                <SelectField field="purchaseTimeline" label="Purchase Timeline" options={OPTIONS.purchaseTimeline} />
                <SelectField field="totalBudgetBandInr" label="Total Budget" options={OPTIONS.totalBudgetBandInr} />
              </div>
              <div className="space-y-2"><Label>Property Role</Label><CheckboxGroup field="propertyRolePrimary" options={OPTIONS.propertyRolePrimary} cols={4} /></div>
              <div className="space-y-2"><Label>Search Trigger</Label><CheckboxGroup field="searchTrigger" options={OPTIONS.searchTrigger} cols={4} /></div>
              <div className="space-y-2"><Label>Property Vision Notes</Label><Textarea value={formData.propertyVisionNotes} onChange={e => handleChange("propertyVisionNotes", e.target.value)} rows={2} /></div>
              <div className="space-y-2"><Label>Ownership Timeline Notes</Label><Textarea value={formData.ownershipTimelineNotes} onChange={e => handleChange("ownershipTimelineNotes", e.target.value)} rows={2} /></div>
            </CardContent>
          </Card>

          {/* Location Preferences */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center"><MapPin className="h-4 w-4 text-orange-400" /></div>Location Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <SelectField field="buyingCountryFocus" label="Country Focus" options={OPTIONS.buyingCountryFocus} />
              <div className="space-y-2"><Label>Target States/Regions</Label><CheckboxGroup field="targetStatesRegions" options={OPTIONS.targetStatesRegions} cols={5} /></div>
              <div className="space-y-2"><Label>Target Locations</Label><Input value={formData.targetLocations.join(", ")} onChange={e => handleChange("targetLocations", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="Comma separated" /></div>
              <div className="space-y-2"><Label>Climate Risks to Avoid</Label><CheckboxGroup field="climateRiskAvoidance" options={OPTIONS.climateRiskAvoidance} cols={3} /></div>
              <div className="space-y-2"><Label>Preferred Climate</Label><CheckboxGroup field="preferredClimate" options={OPTIONS.preferredClimate} cols={4} /></div>
              <div className="space-y-2"><Label>Location Priorities</Label><CheckboxGroup field="locationPriorities" options={OPTIONS.locationPriorities} cols={4} /></div>
              <div className="space-y-2"><Label>Area Type Preference</Label><CheckboxGroup field="areaTypePreference" options={OPTIONS.areaTypePreference} cols={3} /></div>
              <div className="space-y-2"><Label>Natural Features Closest</Label><CheckboxGroup field="naturalFeatureClosest" options={OPTIONS.naturalFeatureClosest} cols={4} /></div>
              <div className="space-y-2"><Label>Location Deal-breakers</Label><Textarea value={formData.locationDealbreakerNotes} onChange={e => handleChange("locationDealbreakerNotes", e.target.value)} rows={2} /></div>
            </CardContent>
          </Card>

          {/* Property Preferences */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center"><Building className="h-4 w-4 text-pink-400" /></div>Property Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField field="strPermissionImportance" label="STR Importance" options={OPTIONS.strPermissionImportance} />
                <SelectField field="farmlandWaterSourcePreference" label="Water Source" options={OPTIONS.farmlandWaterSourcePreference} />
                <SelectField field="ownershipStructurePreference" label="Ownership Structure" options={OPTIONS.ownershipStructurePreference} />
                <SelectField field="possessionStagePreference" label="Possession Stage" options={OPTIONS.possessionStagePreference} />
                <SelectField field="possessionTimelineBucket" label="Possession Timeline" options={OPTIONS.possessionTimelineBucket} />
                <SelectField field="managementModelPreference" label="Management Model" options={OPTIONS.managementModelPreference} />
                <SelectField field="fundingPreference" label="Funding" options={OPTIONS.fundingPreference} />
                <SelectField field="communityFormatPreference" label="Community Format" options={OPTIONS.communityFormatPreference} />
              </div>
              <div className="space-y-2"><Label>Asset Type Interest</Label><CheckboxGroup field="assetTypeInterest" options={OPTIONS.assetTypeInterest} cols={4} /></div>
              <div className="space-y-2"><Label>Unit Configuration</Label><CheckboxGroup field="unitConfiguration" options={OPTIONS.unitConfiguration} cols={4} /></div>
              <div className="space-y-2"><Label>Farmland/Land Size</Label><CheckboxGroup field="farmlandLandSizeBucket" options={OPTIONS.farmlandLandSizeBucket} cols={4} /></div>
              <div className="space-y-2"><Label>Community Friendly For</Label><CheckboxGroup field="communityFriendlyFor" options={OPTIONS.communityFriendlyFor} cols={4} /></div>
            </CardContent>
          </Card>

          {/* Home Features */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Home className="h-4 w-4 text-indigo-400" /></div>Home Features</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField field="furnishingLevelPreference" label="Furnishing Level" options={OPTIONS.furnishingLevelPreference} />
                <SelectField field="interiorFinishLevel" label="Interior Finish" options={OPTIONS.interiorFinishLevel} />
              </div>
              <div className="space-y-2"><Label>Vastu Directions</Label><CheckboxGroup field="vastuPreferredDirections" options={OPTIONS.vastuPreferredDirections} cols={4} /></div>
              <div className="space-y-2"><Label>Must-Have Features</Label><CheckboxGroup field="homeMustHaveFeatures" options={OPTIONS.homeMustHaveFeatures} cols={4} /></div>
              <div className="space-y-2"><Label>Nice-to-Have Features</Label><CheckboxGroup field="homeNiceToHaveFeatures" options={OPTIONS.homeNiceToHaveFeatures} cols={4} /></div>
              <div className="space-y-2"><Label>Smart Home & Security</Label><CheckboxGroup field="smartHomeSecurityFeatures" options={OPTIONS.smartHomeSecurityFeatures} cols={3} /></div>
              <div className="space-y-2"><Label>Private Outdoor Features</Label><CheckboxGroup field="privateOutdoorFeatures" options={OPTIONS.privateOutdoorFeatures} cols={4} /></div>
              <div className="space-y-2"><Label>Community Amenities</Label><CheckboxGroup field="communityOutdoorAmenitiesTop" options={OPTIONS.communityOutdoorAmenitiesTop} cols={5} /></div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center"><MessageSquare className="h-4 w-4 text-cyan-400" /></div>Additional Notes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Ideal Home Notes</Label><Textarea value={formData.idealHomeNotes} onChange={e => handleChange("idealHomeNotes", e.target.value)} rows={3} /></div>
              <div className="space-y-2"><Label>Final Notes</Label><Textarea value={formData.finalNotes} onChange={e => handleChange("finalNotes", e.target.value)} rows={3} /></div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
            <Button type="button" variant="outline" onClick={() => navigate(`/leads/${id}`)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadPage;
