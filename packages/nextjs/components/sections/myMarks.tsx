'use client'

import RewardsCard from "~~/components/Card";
import { sampleRewards } from "~~/mockup/sample-rewards";
import { useAuth } from "~~/context/AuthContext";

const MyMarks = () => {
    const { user } = useAuth();
    return (
        <section className="container mx-auto px-4 py-8">
            <div>
                <h1 className="text-2xl font-bold"> <span className="text-blue-300">{user?.name}</span> - My Marks</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4 bg-gray-900 rounded-lg">
                {sampleRewards.map((reward) => (
                    <RewardsCard key={reward.id} data={reward} />
                ))}
            </div>

        </section>
    )
}

export default MyMarks;