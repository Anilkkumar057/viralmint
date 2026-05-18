"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type AdminUser = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  plan?: string | null;
  is_premium?: boolean | null;
  is_admin?: boolean | null;
  is_locked?: boolean | null;
  creator_dna?: unknown;
  message_count?: number | null;
  approved_at?: string | null;
  created_at?: string | null;
};

const ADMIN_EMAILS = ["mystocktradesk@gmail.com"];

export default function AdminApprovalDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
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
      setStatus("Please login first.");
      setLoading(false);
      return;
    }

    const email = (user.email || "").toLowerCase();
    const directAdmin = ADMIN_EMAILS.includes(email);

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const profileAdmin =
      profile?.is_admin === true ||
      profile?.plan === "elite" ||
      profile?.is_premium === true;

    if (!directAdmin && (profileError || !profileAdmin)) {
      setIsAdmin(false);
      setStatus("Access denied. Admin only.");
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    if (directAdmin) {
      await supabase.from("user_profiles").upsert(
        {
          id: user.id,
          email,
          plan: "elite",
          is_premium: true,
          is_admin: true,
          is_locked: false,
        },
        { onConflict: "id" }
      );
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
    } else {
      setUsers((data || []) as AdminUser[]);
      setStatus("Admin dashboard loaded.");
    }

    setLoading(false);
  }

  async function updateUser(id: string, updates: Partial<AdminUser>) {
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

  async function approveUser(id: string, plan = "elite") {
    await updateUser(id, {
      is_premium: true,
      is_locked: false,
      plan,
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
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-8 text-center shadow-[0_0_80px_rgba(255,208,74,0.12)]">
          <p className="text-[11px] uppercase tracking-[0.35em] text-yellow-300">
            Viral Mint Control Room
          </p>
          <h1 className="mt-4 text-3xl font-black">Opening Admin...</h1>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] p-6 text-white">
        <div className="max-w-md rounded-[2rem] border border-red-500/30 bg-red-500/10 p-8 text-center shadow-[0_0_80px_rgba(255,0,0,0.08)]">
          <p className="text-[11px] uppercase tracking-[0.35em] text-red-300">
            Admin Access Only
          </p>
          <h1 className="mt-4 text-3xl font-black">Access Denied</h1>
          <p className="mt-4 text-white/60">{status}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,208,74,0.12),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,214,92,0.08),transparent_25%),linear-gradient(180deg,#050505_0%,#090807_55%,#050505_100%)]" />

      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-yellow-400/10 bg-black/55 px-5 py-7 backdrop-blur-xl lg:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-600 text-xl font-black text-black shadow-[0_0_40px_rgba(255,208,74,0.24)]">
              M
            </div>

            <div>
              <p className="text-xl font-black tracking-wide">VIRAL MINT</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-300">
                Admin Control
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              "Overview",
              "Users",
              "Approvals",
              "Subscriptions",
              "Analytics",
              "Creator Activity",
              "Payments",
              "Settings",
            ].map((item, index) => (
              <button
                key={item}
                className={
                  index === 0
                    ? "flex w-full items-center gap-3 rounded-[1.2rem] border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-left text-sm font-semibold text-yellow-200 shadow-[0_0_30px_rgba(255,208,74,0.12)]"
                    : "flex w-full items-center gap-3 rounded-[1.2rem] px-4 py-3 text-left text-sm text-white/70 transition-all hover:bg-white/[0.04] hover:text-yellow-200"
                }
              >
                <span>✦</span>
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-[1.6rem] border border-yellow-400/20 bg-yellow-400/[0.05] p-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-yellow-300">
              Platform Status
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Total Users</span>
                <span className="text-yellow-300">{users.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Premium</span>
                <span className="text-yellow-300">
                  {users.filter((user) => user.is_premium).length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Locked</span>
                <span className="text-yellow-300">
                  {users.filter((user) => user.is_locked).length}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-yellow-400/10 bg-black/45 px-5 py-4 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-yellow-300">
                  Admin Dashboard
                </p>
                <h1 className="mt-2 text-3xl font-black">Control Center</h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={checkAdminAndLoadUsers}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 transition-all hover:border-yellow-400/30 hover:text-yellow-200"
                >
                  Refresh
                </button>

                <div className="rounded-full border border-yellow-400/35 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-yellow-300 shadow-[0_0_40px_rgba(255,208,74,0.18)]">
                  ♕ Admin Active
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-8">
            {status && (
              <div className="mb-6 rounded-[1.4rem] border border-yellow-400/15 bg-yellow-400/[0.05] px-5 py-4 text-sm text-white/70">
                {status}
              </div>
            )}

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Total Users", String(users.length)],
                [
                  "Elite Members",
                  String(users.filter((user) => user.plan === "elite").length),
                ],
                [
                  "Premium Users",
                  String(users.filter((user) => user.is_premium).length),
                ],
                [
                  "Locked Users",
                  String(users.filter((user) => user.is_locked).length),
                ],
              ].map(([title, value]) => (
                <div
                  key={title}
                  className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6"
                >
                  <p className="text-sm text-white/55">{title}</p>
                  <h2 className="mt-4 text-4xl font-black text-yellow-300">
                    {value}
                  </h2>
                </div>
              ))}
            </section>

            <section className="mt-8 overflow-hidden rounded-[2rem] border border-yellow-400/18 bg-[#090807] p-6 shadow-[0_25px_100px_rgba(255,208,74,0.08)] md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-yellow-300">
                    User Management
                  </p>
                  <h3 className="mt-3 text-3xl font-black">
                    Premium Access Control
                  </h3>
                </div>

                <button
                  onClick={checkAdminAndLoadUsers}
                  className="rounded-[1rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-black text-black shadow-[0_18px_50px_rgba(255,208,74,0.18)] transition-all hover:scale-[1.02]"
                >
                  Sync Users ✨
                </button>
              </div>

              <div className="mt-8 overflow-x-auto rounded-[1.5rem] border border-white/10">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-yellow-400/10 text-left text-sm text-yellow-300">
                    <tr>
                      <th className="px-5 py-4">Creator</th>
                      <th className="px-5 py-4">Plan</th>
                      <th className="px-5 py-4">Premium</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Messages</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-10 text-center text-white/45"
                        >
                          No users found yet.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-t border-white/10">
                          <td className="px-5 py-5">
                            <div>
                              <p className="font-semibold">
                                {user.full_name || user.email?.split("@")[0] || "Unnamed"}
                              </p>
                              <p className="mt-1 text-sm text-white/45">
                                {user.email || "No email"}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <select
                              value={user.plan || "free"}
                              onChange={(event) =>
                                updateUser(user.id, {
                                  plan: event.target.value,
                                  is_premium: event.target.value !== "free",
                                  approved_at:
                                    event.target.value !== "free"
                                      ? new Date().toISOString()
                                      : null,
                                })
                              }
                              className="rounded-full border border-yellow-400/20 bg-black px-4 py-2 text-xs uppercase tracking-[0.18em] text-yellow-300 outline-none"
                            >
                              <option value="free">Free</option>
                              <option value="starter">Starter</option>
                              <option value="pro">Pro</option>
                              <option value="elite">Elite</option>
                            </select>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={
                                user.is_premium
                                  ? "rounded-full bg-yellow-400/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-yellow-300"
                                  : "rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/45"
                              }
                            >
                              {user.is_premium ? "Unlocked" : "Free"}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={
                                user.is_locked
                                  ? "text-red-300"
                                  : "text-emerald-300"
                              }
                            >
                              {user.is_locked ? "Locked" : "Active"}
                            </span>
                          </td>

                          <td className="px-5 py-5 text-white/65">
                            {user.message_count || 0}
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  approveUser(user.id, user.plan || "elite")
                                }
                                className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-xs text-yellow-300 transition-all hover:bg-yellow-400 hover:text-black"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() => rejectUser(user.id)}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/70 transition-all hover:border-red-400/30 hover:text-red-300"
                              >
                                Reject
                              </button>

                              <button
                                onClick={() =>
                                  lockUser(user.id, !(user.is_locked === true))
                                }
                                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/70 transition-all hover:border-yellow-400/30 hover:text-yellow-200"
                              >
                                {user.is_locked ? "Unlock" : "Lock"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
