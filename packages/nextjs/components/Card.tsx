import Image from "next/image";
import { MapPin, Check } from "lucide-react";
import { Button } from "~~/components/ui/button";
import type { RewardData } from "~~/types/reward";
import { sampleRewards } from "~~/mockup/sample-rewards";

interface RewardsCardProps {
    data: RewardData
};

export default function RewardsCard({data}: RewardsCardProps) {
  const {
      name,
      subtitle,
      address,
      message,
      rewardAmount,
      completedSteps,
      totalSteps,
      consumptionNote,
    } = data    

  return (
    <div className="max-w-md mx-auto p-4 bg-white/15 rounded-lg">
      {/* Rewards Text */}
      <p className="text-gray-200 mb-4">Complete to get rewards</p>

      {/* Rewards Card */}
      <div className="rounded-lg bg-[#e86216] text-white p-6 relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-white rounded-full p-1 w-12 h-12 flex items-center justify-center">
                <Image src={"/placeholder.svg"} alt={name} width={40} height={40} className="object-contain" />
            </div>
            <div>
                <h3 className="text-2xl font-bold">
                    {name}
                </h3>
                {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
            </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-1 mb-6 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{address}</span>
        </div>

        {/* Congrats Text */}
        <p className="text-lg mb-4">{message}</p>

        {/* Checkboxes */}
        <div className="flex gap-2 mb-6">
        {[...Array(totalSteps)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-md flex items-center justify-center ${
              i < completedSteps ? "bg-white" : "bg-white/50"
            }`}
          >
            {i < completedSteps && <Check className="w-5 h-5 text-[#e86216]" />}
          </div>
        ))}
      </div>

        {/* Reward Amount */}
        <div className="mb-1">
          <p className="text-sm">Reward</p>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">${rewardAmount}</span>
          </div>
          <p className="text-sm opacity-80">{consumptionNote}</p>
        </div>

        {/* Redeem Button */}
        <Button className={"w-full mt-6"} variant="redeem">Redeem</Button>
      </div>
    </div>
  )
}
