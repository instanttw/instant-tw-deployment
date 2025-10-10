"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarLayout } from "@/components/dashboard/sidebar-layout";
import { User, Lock, Bell, CreditCard, Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
  const [twoFAUrl, setTwoFAUrl] = useState<string | null>(null);
  const [twoFAToken, setTwoFAToken] = useState("");
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [notifEmail, setNotifEmail] = useState("");
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifEmails, setNotifEmails] = useState<Array<{email:string; verified:boolean; created_at:string}>>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/dashboard/settings");
    }
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [status, router, session]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("/api/user/notifications/emails");
        const data = await res.json();
        if (Array.isArray(data.emails)) setNotifEmails(data.emails);
      } catch {}
    };
    if (status === "authenticated") fetchEmails();
  }, [status]);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        await update(); // Refresh session
        toast.success("Profile updated successfully!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      toast.success("Password updated");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (e:any) {
      toast.error(e?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    try {
      const res = await fetch("/api/user/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start 2FA");
      setTwoFASecret(data.secret);
      setTwoFAUrl(data.otpauthUrl);
      toast.success("Scan the QR code or use the secret below");
    } catch (e:any) {
      toast.error(e?.message || "Failed to start 2FA");
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFASecret || !twoFAToken) {
      toast.error("Enter the code from your authenticator app");
      return;
    }
    setIsVerifying2FA(true);
    try {
      const res = await fetch("/api/user/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: twoFAToken, secret: twoFASecret }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      toast.success("Two-factor authentication enabled");
      setTwoFAToken("");
    } catch (e:any) {
      toast.error(e?.message || "Failed to verify 2FA");
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsDisabling2FA(true);
    try {
      const res = await fetch("/api/user/2fa/disable", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to disable 2FA");
      setTwoFASecret(null);
      setTwoFAUrl(null);
      setTwoFAToken("");
      toast.success("Two-factor authentication disabled");
    } catch (e:any) {
      toast.error(e?.message || "Failed to disable 2FA");
    } finally {
      setIsDisabling2FA(false);
    }
  };

  const addNotificationEmail = async () => {
    if (!notifEmail) return;
    setNotifLoading(true);
    try {
      const res = await fetch("/api/user/notifications/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: notifEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add email");
      setNotifEmail("");
      const list = await fetch("/api/user/notifications/emails").then(r=>r.json());
      setNotifEmails(list.emails || []);
      toast.success("Notification email added");
    } catch (e:any) {
      toast.error(e?.message || "Failed to add email");
    } finally {
      setNotifLoading(false);
    }
  };

  const removeNotificationEmail = async (email: string) => {
    setNotifLoading(true);
    try {
      const res = await fetch("/api/user/notifications/emails", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove email");
      const list = await fetch("/api/user/notifications/emails").then(r=>r.json());
      setNotifEmails(list.emails || []);
      toast.success("Email removed");
    } catch (e:any) {
      toast.error(e?.message || "Failed to remove email");
    } finally {
      setNotifLoading(false);
    }
  };

  const sendTestNotification = async (email: string) => {
    try {
      const res = await fetch("/api/user/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send test");
      toast.success("Test email sent");
    } catch (e:any) {
      toast.error(e?.message || "Failed to send test");
    }
  };

  const handleBillingAction = (action: string) => {
    if (action === "payment-methods") {
      toast.info("Payment methods management coming soon!");
    } else if (action === "billing-history") {
      router.push("/dashboard/purchases");
    } else if (action === "download-invoices") {
      toast.info("Invoice download feature coming soon!");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <SidebarLayout type="user">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={session.user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  Change Password
                </Button>
                {showPasswordForm && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-1">
                      <Label htmlFor="oldPassword">Current Password</Label>
                      <div className="relative">
                        <Input id="oldPassword" type={showOld ? "text" : "password"} value={oldPassword} onChange={e=>setOldPassword(e.target.value)} />
                        <button type="button" onClick={()=>setShowOld(v=>!v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showOld?"Hide password":"Show password"}>
                          {showOld ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input id="newPassword" type={showNew ? "text" : "password"} value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
                        <button type="button" onClick={()=>setShowNew(v=>!v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showNew?"Hide password":"Show password"}>
                          {showNew ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input id="confirmPassword" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
                        <button type="button" onClick={()=>setShowConfirm(v=>!v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showConfirm?"Hide password":"Show password"}>
                          {showConfirm ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <Button onClick={handleChangePassword} disabled={isChangingPassword}>
                        {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleEnable2FA}
              >
                <Shield className="mr-2 h-4 w-4" />
                Enable Two-Factor Authentication
              </Button>
              {twoFAUrl && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Scan this QR code in your authenticator app, or use the secret below.</p>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <img
                      alt="2FA QR"
                      className="border rounded p-2 bg-white"
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(twoFAUrl)}`}
                    />
                    <div className="space-y-2">
                      <Label>Secret</Label>
                      <Input readOnly value={twoFASecret || ""} />
                      <div className="flex items-center gap-2">
                        <Input placeholder="Enter 6-digit code" value={twoFAToken} onChange={e=>setTwoFAToken(e.target.value)} />
                        <Button onClick={handleVerify2FA} disabled={isVerifying2FA}>
                          {isVerifying2FA && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Verify & Enable
                        </Button>
                      </div>
                      <Button variant="ghost" onClick={handleDisable2FA} disabled={isDisabling2FA}>
                        Disable 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Notification Emails</p>
                <p className="text-sm text-muted-foreground">Add additional emails to receive notifications</p>
                <div className="flex gap-2">
                  <Input placeholder="you+alerts@example.com" value={notifEmail} onChange={e=>setNotifEmail(e.target.value)} />
                  <Button onClick={addNotificationEmail} disabled={notifLoading}>Add</Button>
                </div>
                {notifEmails.length > 0 && (
                  <div className="space-y-2">
                    {notifEmails.map((e) => (
                      <div key={e.email} className="flex items-center justify-between rounded border p-2">
                        <div>
                          <p className="text-sm font-medium">{e.email}</p>
                          <p className="text-xs text-muted-foreground">{e.verified ? "Verified" : "Unverified"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={()=>sendTestNotification(e.email)}>Send Test</Button>
                          <Button size="sm" variant="destructive" onClick={()=>removeNotificationEmail(e.email)}>Remove</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
            </CardContent>
          </Card>

          {/* Billing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Payments
              </CardTitle>
              <CardDescription>Manage subscriptions and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleBillingAction("billing-history")}
              >
                View Billing History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
