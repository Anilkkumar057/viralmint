"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: string | null;
  is_premium: boolean | null;
  is_admin: boolean | null;
  is_locked: boolean | null;
  creator_dna: unknown | null;
  message_count: number | null;
  approved_at: string | null;
  created_at: string | null;
};

type UserProfileUpdates = Partial<
  Pick<UserProfile, "is_premium" | "is_locked" | "plan" | "approved_at">
>;

const ADMIN_EMAILS = ["mystocktradesk@gmail.com"];
const PLANS = ["free", "starter", "pro", "elite"];

export default function AdminApprovalDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, []);

  async function checkAdminAndLoadUsers() {
    setLoading(true);
    setStatus("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setIsAdmin(false);
      setStatus("Please login first.");
      setLoading(false);
      return;
    }

    const isAllowedAdmin = ADMIN_EMAILS.includes(user.email || "");

    if (!isAllowedAdmin) {
      setIsAdmin(false);
      setStatus("Access denied. Admin only.");
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      setUsers([]);
    } else {
      setUsers((data || []) as UserProfile[]);
    }

    setLoading(false);
  }

  async function updateUser(id: string, updates: UserProfileUpdates) {
    setStatus("Updating...");

    const { error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...updates } : user))
    );

    setStatus("Updated successfully.");
  }

  async function changePlan(id: string, plan: string) {
    await updateUser(id, {
      plan,
      is_premium: plan !== "free",
      is_locked: false,
      approved_at: plan !== "free" ? new Date().toISOString() : null,
    });
  }

  async function approveUser(user: UserProfile) {
    const selectedPlan = user.plan && user.plan !== "free" ? user.plan : "elite";

    await updateUser(user.id, {
      is_premium: true,
      is_locked: false,
      plan: selectedPlan,
      approved_at: new Date().toISOString(),
    });
  }

  async function makeElite(user: UserProfile) {
    await updateUser(user.id, {
      is_premium: true,
      is_locked: false,
      plan: "elite",
      approved_at: new Date().toISOString(),
    });
  }

  async function rejectUser(id: string) {
    await updateUser(id, {
      is_premium: false,
      plan: "free",
      approved_at: null,
    });
  }

  async function lockUser(id: string, value: boolean) {
    await updateUser(id, {
      is_locked: value,
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-white/70">Loading admin dashboard...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
        <div className="max-w-md rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <h1 className="mb-2 text-2xl font-bold">Admin Access Only</h1>
          <p className="text-white/70">{status}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] p-6 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
          <p className="mb-2 text-sm text-emerald-300">Viral Mint Control Room</p>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            Admin Approval Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-white/60">
            Approve premium users, switch plans, lock misuse, and control access without touching code.
          </p>

          {status && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/70">
              {status}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-7 gap-4 border-b border-white/10 bg-white/[0.05] px-5 py-4 text-xs font-bold uppercase tracking-wider text-white/50">
            <div>User</div>
            <div>Plan</div>
            <div>Premium</div>
            <div>Messages</div>
            <div>Status</div>
            <div>DNA</div>
            <div>Actions</div>
          </div>

          {users.length === 0 ? (
            <div className="p-8 text-center text-white/50">No users found yet.</div>
          ) : (
            users.map((user) => {
              const currentPlan = user.plan || "free";
              const isElite = currentPlan === "elite";

              return (
                <div
                  key={user.id}
                  className="grid grid-cols-7 items-center gap-4 border-b border-white/10 px-5 py-4 text-sm hover:bg-white/[0.03]"
                >
                  <div>
                    <p className="font-semibold">{user.full_name || "Unnamed"}</p>
                    <p className="text-xs text-white/40">{user.email || "No email"}</p>
                  </div>

                  <div>
                    <select
                      value={currentPlan}
                      onChange={(event) => changePlan(user.id, event.target.value)}
                      className="rounded-xl border border-white/10 bg-black px-3 py-2 text-white outline-none"
                    >
                      {PLANS.map((plan) => (
                        <option key={plan} value={plan}>
                          {plan.charAt(0).toUpperCase() + plan.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        user.is_premium
                          ? "bg-emerald-400/15 text-emerald-300"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {user.is_premium ? `${currentPlan.toUpperCase()} Unlocked` : "Free"}
                    </span>
                  </div>

                  <div className="text-white/70">{user.message_count || 0}</div>

                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        user.is_locked
                          ? "bg-red-400/15 text-red-300"
                          : "bg-blue-400/15 text-blue-300"
                      }`}
                    >
                      {user.is_locked ? "Locked" : "Active"}
                    </span>
                  </div>

                  <div className="text-xs text-white/50">
                    {user.creator_dna ? "Connected" : "Not set"}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => approveUser(user)}
                      className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-black hover:bg-emerald-300"
                    >
                      Approve
                    </button>

                    {!isElite && (
                      <button
                        onClick={() => makeElite(user)}
                        className="rounded-xl bg-yellow-300 px-3 py-2 text-xs font-black text-black hover:bg-yellow-200"
                      >
                        Elite
                      </button>
                    )}

                    <button
                      onClick={() => rejectUser(user.id)}
                      className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => lockUser(user.id, !user.is_locked)}
                      className={`rounded-xl px-3 py-2 text-xs font-bold ${
                        user.is_locked
                          ? "bg-blue-400 text-black"
                          : "bg-red-500/80 text-white"
                      }`}
                    >
                      {user.is_locked ? "Unlock" : "Lock"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
