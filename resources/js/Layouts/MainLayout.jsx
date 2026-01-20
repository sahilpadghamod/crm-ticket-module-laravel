import React from "react";
import { Link, router } from "@inertiajs/react";

export default function MainLayout({ children, user }) {
    const logout = () => {
        router.post("/logout");
    };

    return (
        <div className="site-layout">
            <header className="site-header">
                <div className="brand">
                    <Link
                        href="/"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <h1>
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{ marginRight: "10px" }}
                            >
                                <rect
                                    width="24"
                                    height="24"
                                    rx="8"
                                    fill="#149e24"
                                />
                                <path
                                    d="M7 12L10 15L17 8"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            TicketPortal
                        </h1>
                    </Link>
                </div>

                <div className="user-menu">
                    {user ? (
                        //Logged in view
                        <>
                            <span
                                style={{
                                    marginRight: "20px",
                                    fontSize: "0.9rem",
                                    color: "#0b0a0a",
                                }}
                            >
                                Hello,{" "}
                                <strong style={{ color: "#151517" }}>
                                    {user.name}
                                </strong>
                            </span>
                            <button
                                onClick={logout}
                                style={{
                                    background: "white",
                                    color: "#ef4444",
                                    border: "1px solid #fee2e2",
                                    margin: 0,
                                    padding: "8px 16px",
                                    width: "auto",
                                    fontSize: "0.85rem",
                                    boxShadow: "none",
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        //User view
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Link
                                href="/"
                                className="nav-link"
                                style={{
                                    color: "black",
                                }}
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="nav-link"
                                style={{
                                    background: "#2563eb",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    display: "inline-block",
                                }}
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <main className="site-content">{children}</main>

            <footer className="site-footer">
                <p>
                    &copy; {new Date().getFullYear()} TicketPortal Systems.{" "}
                    <br />{" "}
                    <span style={{ fontSize: "0.8em", opacity: 0.7 }}>
                        Spider Tech Services.
                    </span>
                </p>
            </footer>
        </div>
    );
}
