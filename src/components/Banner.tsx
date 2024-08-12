import React, { useState, useEffect } from "react";
import { Button } from "../../@/components/ui/button"; // Simplified imports
import { XIcon } from "lucide-react";

interface BannerProps {
  description: string;
  link: string;
  timer: number;
  onTimerEnd: () => void;
}

const Banner: React.FC<BannerProps> = ({
  description,
  link,
  timer,
  onTimerEnd,
}) => {
  const [timeLeft, setTimeLeft] = useState(timer);

  useEffect(() => {
    setTimeLeft(timer);
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, onTimerEnd]);

  const handleClose = () => {
    setTimeLeft(0);
    onTimerEnd();
  };

  return (
    <div className="bg-blue-100 border border-blue-500 p-4 rounded mb-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium text-blue-700">{description}</p>
          {link && (
            <Button
              variant="link"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => window.open(link, "_blank")}
            >
              Click Here
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-blue-600">Time left: {timeLeft}s</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6 rounded-full bg-blue-200 hover:bg-blue-300"
          >
            <XIcon className="h-4 w-4 text-blue-700" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
