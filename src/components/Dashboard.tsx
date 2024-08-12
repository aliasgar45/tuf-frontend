import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { BannerData } from "../App";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Label } from "../../@/components/ui/label";

interface DashboardProps {
  bannerData: BannerData | null;
  onUpdateBanner: (updatedData: Partial<BannerData>) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({
  bannerData,
  onUpdateBanner,
}) => {
  const [formData, setFormData] = useState<BannerData>({
    description: "",
    link: "",
    timer: 60,
    isVisible: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bannerData) {
      setFormData(bannerData);
    }
  }, [bannerData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      setError("Description is required.");
      return false;
    }
    if (
      !/^https?:\/\/.+/.test(formData.link) &&
      !/^www\..+/.test(formData.link)
    ) {
      setError("Link must be a valid URL.");
      return false;
    }
    if (formData.timer < 0 || !Number.isInteger(formData.timer)) {
      setError("Timer must be a non-negative integer.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onUpdateBanner(formData);
    } catch (err) {
      setError("Failed to update banner. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter banner description"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="link">Link</Label>
          <Input
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Enter banner link"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="timer">Timer (seconds)</Label>
          <Input
            id="timer"
            name="timer"
            type="number"
            value={formData.timer}
            onChange={handleChange}
            min={0}
            step={1}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="isVisible"
            name="isVisible"
            type="checkbox"
            checked={formData.isVisible}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <Label htmlFor="isVisible">Banner Visible</Label>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Banner"}
        </Button>
      </form>
    </div>
  );
};

export default Dashboard;
