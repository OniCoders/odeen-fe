"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "~~/components/ui/button";
import { useAuth } from "~~/context/AuthContext";

import { devnet } from "@starknet-react/chains";
import { useAccount, useNetwork, useProvider } from "@starknet-react/core";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.network === devnet.network;

  const { provider } = useProvider();
  const { address, status, chainId } = useAccount();
  const { chain } = useNetwork();
  const [isDeployed, setIsDeployed] = useState(true);

  useEffect(() => {
    if (
      status === "connected" &&
      address &&
      chainId === targetNetwork.id &&
      chain.network === targetNetwork.network
    ) {
      provider
        .getClassHashAt(address)
        .then((classHash) => {
          if (classHash) setIsDeployed(true);
          else setIsDeployed(false);
        })
        .catch((e) => {
          console.error("contract check", e);
          if (e.toString().includes("Contract not found")) {
            setIsDeployed(false);
          }
        });
    }
  }, [
    status,
    address,
    provider,
    chainId,
    targetNetwork.id,
    targetNetwork.network,
    chain.network,
  ]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          variant="outline"
          onClick={logout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>

      <div className="bg-gray-600 p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gray-200 p-4 rounded-full">
            <User className="h-8 w-8 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <div className="gap-2">
              <p className="block text-gray-200">{user.email}</p>
              <p className="block text-green-400 font-bold">
                {status === "connected" ? (
                  <>
                    <span className="text-gray-200 font-normal">Address:</span>{" "}
                    ...{address?.slice(-4)}
                  </>
                ) : (
                  <p className="text-gray-200 font-normal">
                    Address:{" "}
                    <span className="text-red-500 font-bold">
                      Not connected
                    </span>
                  </p>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2">Session Information</h3>
          <p className="text-sm text-gray-200">
            Login Time:{" "}
            {user.loginTime
              ? new Date(user.loginTime).toLocaleString()
              : "Not available"}
          </p>
          <button
            onClick={() => router.push("/dashboard/my-marks")}
            className="text-blue-300 hover:underline"
          >
            My Marks
          </button>
        </div>
      </div>
    </div>
  );
}
