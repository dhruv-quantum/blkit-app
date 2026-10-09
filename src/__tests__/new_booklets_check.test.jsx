import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import App from "../App";
import ActivityCard from "../components/ActivityCard";
import { createFakeSupabase } from "./fakeSupabase";
import { KITS } from "../data/kit";

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
    setImpl: (impl) => { current = impl; },
  };
});
vi.mock("../lib/supabaseClient", () => ({ supabase: proxy, isSupabaseConfigured: true }));

const ADMIN = { id: "admin-1", email: "admin@example.com", role: "admin", full_name: "Ada Admin" };

beforeEach(() => {
  window.localStorage.clear();
  window.history.pushState({}, "", "/");
});

describe("Data integrity sanity check", () => {
  it("every activity across every booklet has an id, title, and valid quarter", () => {
    const nursery = KITS.find(k => k.id === "nursery");
    let total = 0;
    for (const booklet of nursery.booklets) {
      if (!booklet.unlocked) continue;
      for (const a of booklet.activities) {
        total++;
        expect(a.id).toBeTruthy();
        expect(a.title).toBeTruthy();
        expect([1,2,3,4]).toContain(a.quarter);
        expect(a.materials.length).toBeGreaterThan(0);
        expect(a.steps.length).toBeGreaterThan(0);
      }
    }
    expect(total).toBeGreaterThan(90);
  });

  it("no duplicate activity ids across the whole nursery kit", () => {
    const nursery = KITS.find(k => k.id === "nursery");
    const ids = [];
    for (const booklet of nursery.booklets) {
      if (!booklet.unlocked) continue;
      for (const a of booklet.activities) ids.push(a.id);
    }
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe("Worksheet images", () => {
  it("every Nursery activity has a sheet image", () => {
    const nursery = KITS.find((k) => k.id === "nursery");
    const missing = nursery.booklets.flatMap((b) =>
      b.activities.filter((a) => !a.sheetImage).map((a) => `${b.id}/${a.id}`)
    );
    expect(missing).toEqual([]);
  });

  it("shows a 'Sheet pending' placeholder (not a broken image) if an activity has no sheet", () => {
    const activity = {
      id: "x1", title: "Test activity", theme: "Test", quarter: 1,
      sheetImage: null, sheetLabel: "", focus: "Testing", materials: [], steps: [], videoUrl: null,
    };
    render(
      <ActivityCard activity={activity} isDone={false} onToggleDone={() => {}} onViewSheet={() => {}} onWatchVideo={() => {}} />
    );
    const pendingBtn = screen.getByText("Sheet pending").closest("button");
    expect(pendingBtn).toBeDisabled();
    expect(document.querySelector("img")).toBeNull();
  });
});

describe("Visual check: Food & Nutrition booklet", () => {
  it("opens and shows real Fruits/Vegetables activities with images", async () => {
    setImpl(createFakeSupabase({
      session: { user: { id: ADMIN.id, email: ADMIN.email }, access_token: "t" },
      profiles: [ADMIN], kitAccess: [],
    }));
    render(<App />);
    await waitFor(() => screen.getByText("Open kit"));
    fireEvent.click(screen.getByText("Open kit"));
    await waitFor(() => screen.getByText("Food & Nutrition"));

    const heading = screen.getByText("Food & Nutrition");
    const card = heading.closest("div").parentElement;
    const openBtn = within(card).getByText("Open booklet");
    fireEvent.click(openBtn);

    await waitFor(() => expect(screen.getAllByText(/Food Flashcards|Fruit Learning|Vegetables Flash Cards/).length).toBe(3));
    // Confirm a real extracted image is referenced, not a placeholder
    const imgs = document.querySelectorAll("img[src*='/images/sheets/']");
    expect(imgs.length).toBeGreaterThan(0);
  });
});
