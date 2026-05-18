"use client";

import { useState } from "react";

const users = [
  {
    name: "Anil",
    email: "creator@viralmint.ai",
    plan: "Elite",
    status: "Active",
  },
  {
    name: "Kabir",
    email: "kabir@viralmint.ai",
    plan: "Pro",
    status: "Pending",
  },
  {
    name: "Aanya",
    email: "aanya@viralmint.ai",
    plan: "Starter",
    status: "Active",
  },
];

export default function AdminPage() {
  const [selected, setSelected] = useState("Overview");

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
              <p className="text-xl font-black tracking-wide">
                VIRAL MINT
              </p>

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
            ].map((item) => (
              <button
                key={item}
                onClick={() => setSelected(item)}
                className={
                  selected === item
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
                <span className="text-sm text-white/60">
                  Active Users
                </span>

                <span className="text-yellow-300">
                  1,248
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">
                  Elite Creators
                </span>

                <span className="text-yellow-300">
                  186
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">
                  MRR
                </span>

                <span className="text-yellow-300">
                  ₹3.8L
                </span>
              </div>

            </div>

          </div>

        </aside>

        <section className="min-w-0">

          <header className="sticky top-0 z-40 border-b border-yellow-400/10 bg-black/45 px-5 py-4 backdrop-blur-2xl">

            <div className="mx-auto flex max-w-7xl items-center justify-between">

              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-yellow-300">
                  Admin Dashboard
                </p>

                <h1 className="mt-2 text-3xl font-black">
                  Control Center
                </h1>
              </div>

              <div className="flex items-center gap-3">

                <div className="rounded-full border border-yellow-400/35 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-yellow-300 shadow-[0_0_40px_rgba(255,208,74,0.18)]">
                  ♕ Admin Active
                </div>

                <button className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 transition-all hover:border-yellow-400/30 hover:text-yellow-200">
                  Export
                </button>

              </div>

            </div>

          </header>

          <div className="mx-auto max-w-7xl px-5 py-8">

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              {[
                ["Total Users", "12,482"],
                ["Elite Members", "1,284"],
                ["Monthly Revenue", "₹8.4L"],
                ["AI Generations", "1.8M"],
              ].map(([title, value]) => (
                <div
                  key={title}
                  className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6"
                >

                  <p className="text-sm text-white/55">
                    {title}
                  </p>

                  <h2 className="mt-4 text-4xl font-black text-yellow-300">
                    {value}
                  </h2>

                </div>
              ))}

            </section>

            <section className="mt-8 overflow-hidden rounded-[2rem] border border-yellow-400/18 bg-[#090807] p-8 shadow-[0_25px_100px_rgba(255,208,74,0.08)]">

              <div className="flex flex-wrap items-center justify-between gap-4">

                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-yellow-300">
                    User Management
                  </p>

                  <h3 className="mt-3 text-3xl font-black">
                    Premium Access Control
                  </h3>
                </div>

                <button className="rounded-[1rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-black text-black shadow-[0_18px_50px_rgba(255,208,74,0.18)] transition-all hover:scale-[1.02]">
                  Add Creator ✨
                </button>

              </div>

              <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-white/10">

                <table className="w-full">

                  <thead className="bg-yellow-400/10 text-left text-sm text-yellow-300">
                    <tr>
                      <th className="px-5 py-4">Creator</th>
                      <th className="px-5 py-4">Plan</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {users.map((user) => (
                      <tr
                        key={user.email}
                        className="border-t border-white/10"
                      >

                        <td className="px-5 py-5">
                          <div>
                            <p className="font-semibold">
                              {user.name}
                            </p>

                            <p className="mt-1 text-sm text-white/45">
                              {user.email}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span className="rounded-full bg-yellow-400/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-yellow-300">
                            {user.plan}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span className="text-emerald-300">
                            {user.status}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex flex-wrap gap-2">

                            <button className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-xs text-yellow-300 transition-all hover:bg-yellow-400 hover:text-black">
                              Approve
                            </button>

                            <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/70 transition-all hover:border-red-400/30 hover:text-red-300">
                              Revoke
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}

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
