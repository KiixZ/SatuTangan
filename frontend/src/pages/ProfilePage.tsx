import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import DonationHistory from "../components/profile/DonationHistory";
import VerificationForm from "../components/profile/VerificationForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "donations" | "verification"
  >("profile");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profil Saya</h1>
          <p className="text-gray-600">
            Kelola profil dan lihat riwayat donasi Anda
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "profile"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Informasi Profil
          </button>
          <button
            onClick={() => setActiveTab("donations")}
            className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "donations"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Riwayat Donasi
          </button>
          {user.role === "DONOR" && (
            <button
              onClick={() => setActiveTab("verification")}
              className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "verification"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Verifikasi Creator
            </button>
          )}
        </div>

        {/* Content */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Nama Lengkap
                </label>
                <p className="text-lg">{user.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Nomor Telepon
                </label>
                <p className="text-lg">{user.phone_number || "-"}</p>
              </div>
              <div className="pt-4">
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "donations" && <DonationHistory />}

        {activeTab === "verification" && <VerificationForm />}
      </div>
      <Footer />
    </div>
  );
}
