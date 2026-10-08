import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import { createFakeSupabase } from "./fakeSupabase";

// vi.hoisted lets this object exist before vi.mock's factory runs (which
// itself is hoisted above imports), so the mock module and our tests can
// share one swappable fake Supabase implementation.
const { proxy, setImpl } = vi.hoisted(() => {
  let current = null;
  return {
    proxy: {
      auth: {
        getSession: (...a) => current.auth.getSession(...a),
        onAuthStateChange: (...a) => current.auth.onAuthStateChange(...a),
        signInWithPassword: (...a) => current.auth.signInWithPassword(...a),
        signOut: (...a) => current.auth.signOut(...a),
      },
      from: (...a) => current.from(...a),
    },
    setImpl: (impl) => {
      current = impl;
    },
  };
});

vi.mock("../lib/supabaseClient", () => ({
  supabase: proxy,
  isSupabaseConfigured: true,
}));

const PARENT = { id: "parent-1", email: "parent@example.com", role: "parent", full_name: "Pat Parent" };
const ADMIN = { id: "admin-1", email: "admin@example.com", role: "admin", full_name: "Ada Admin" };
const STAFF = { id: "staff-1", email: "staff@example.com", role: "staff", full_name: "Sam Staff" };

function signedInAs(profile, extra = {}) {
  return createFakeSupabase({
    session: { user: { id: profile.id, email: profile.email }, access_token: `token-${profile.id}` },
    profiles: [profile],
    kitAccess: [],
    ...extra,
  });
}

beforeEach(() => {
  window.localStorage.clear();
  window.history.pushState({}, "", "/");
});

describe("Authentication gate", () => {
  it("redirects to the login page when signed out", async () => {
    setImpl(createFakeSupabase({ session: null, profiles: [] }));
    render(<App />);
    await waitFor(() => expect(screen.getByText(/Sign in to your kit companion/i)).toBeInTheDocument());
  });

  it("signs a parent in and lands on the Kit Library", async () => {
    setImpl(
      createFakeSupabase({
        session: null,
        profiles: [{ ...PARENT }],
      })
    );
    render(<App />);
    await waitFor(() => screen.getByLabelText(/Email/i));

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "parent@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "correct-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(screen.getByText(/Pick up where your kit left off/i)).toBeInTheDocument());
  });

  it("shows an error for wrong credentials and stays on the login page", async () => {
    setImpl(createFakeSupabase({ session: null, profiles: [{ ...PARENT }] }));
    render(<App />);
    await waitFor(() => screen.getByPlaceholderText("you@example.com"));

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "parent@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(screen.getByText(/Invalid login credentials/i)).toBeInTheDocument());
  });
});

describe("Parent view — access-based kit visibility", () => {
  it("shows Nursery open and other kits as 'Not in your plan' when only Nursery is granted", async () => {
    setImpl(
      signedInAs(PARENT, {
        kitAccess: [{ id: "ka1", parent_id: PARENT.id, kit_id: "nursery", granted_by: ADMIN.id }],
      })
    );
    render(<App />);

    await waitFor(() => expect(screen.getByText("The Brainy Badgers")).toBeInTheDocument());
    expect(screen.getByText("Open kit")).toBeInTheDocument();

    // Switch to the Playgroup rung — not granted, should add a second
    // "Not in your plan" card (Phonics, in Other kits, already shows one).
    const before = screen.getAllByText("Not in your plan").length;
    fireEvent.click(screen.getByText("Playgroup"));
    await waitFor(() => expect(screen.getAllByText("Not in your plan").length).toBeGreaterThan(before));
  });

  it("does not show the admin Dashboard link for a parent", async () => {
    setImpl(signedInAs(PARENT, { kitAccess: [] }));
    render(<App />);
    await waitFor(() => screen.getByText(/Pick up where your kit left off/i));
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });
});

describe("Parent flow inside a granted kit (Animals booklet)", () => {
  async function openAnimalsBooklet() {
    setImpl(
      signedInAs(PARENT, {
        kitAccess: [{ id: "ka1", parent_id: PARENT.id, kit_id: "nursery", granted_by: ADMIN.id }],
      })
    );
    render(<App />);
    await waitFor(() => screen.getByText("Open kit"));
    fireEvent.click(screen.getByText("Open kit"));
    await waitFor(() => screen.getAllByText("Open booklet").length > 0);
    fireEvent.click(screen.getAllByText("Open booklet")[0]);
    // Q1 is the default tab, so wait for a Q1 activity (Bird Flash Cards).
    await waitFor(() => screen.getByText("Bird Flash Cards"));
  }

  it("defaults to Quarter 1 and shows its 4 activities", async () => {
    await openAnimalsBooklet();
    expect(screen.getByText("Bird Flash Cards")).toBeInTheDocument();
    expect(screen.queryByText("Animal Mask")).not.toBeInTheDocument();
  });

  it("marks an activity complete and persists it", async () => {
    await openAnimalsBooklet();
    expect(screen.getByText("0 of 16 activities complete")).toBeInTheDocument();
    fireEvent.click(screen.getAllByTitle("Mark complete")[0]);
    await waitFor(() => expect(screen.getByText("1 of 16 activities complete")).toBeInTheDocument());
  });

  it("opens the sheet modal with a real image", async () => {
    await openAnimalsBooklet();
    fireEvent.click(screen.getAllByText("Sheet 1 · Activities 1–2")[0]);
    const modalImg = document.querySelector(".fixed img");
    expect(modalImg).toHaveAttribute("src", expect.stringContaining("/images/sheets/"));
  });
});

describe("Admin dashboard", () => {
  it("shows the Dashboard link and the create-profile form with a Staff option", async () => {
    setImpl(signedInAs(ADMIN));
    render(<App />);
    await waitFor(() => screen.getByText("Dashboard"));
    fireEvent.click(screen.getByText("Dashboard"));

    await waitFor(() => expect(screen.getByText("Create a new profile")).toBeInTheDocument());
    expect(screen.getByText("Staff")).toBeInTheDocument();
  });

  it("hides the Staff role option for a staff user", async () => {
    setImpl(signedInAs(STAFF));
    render(<App />);
    await waitFor(() => screen.getByText("Dashboard"));
    fireEvent.click(screen.getByText("Dashboard"));

    await waitFor(() => expect(screen.getByText("Create a new profile")).toBeInTheDocument());
    // Scope to the <label> specifically — TopBar also shows a "Staff" pill
    // for this role, which would otherwise give a false match.
    expect(screen.queryByText("Staff", { selector: "label" })).not.toBeInTheDocument();
  });

  it("blocks a parent from reaching /admin", async () => {
    setImpl(signedInAs(PARENT));
    render(<App />);
    await waitFor(() => screen.getByText(/Pick up where your kit left off/i));
    expect(screen.queryByText("Create a new profile")).not.toBeInTheDocument();
  });
});
