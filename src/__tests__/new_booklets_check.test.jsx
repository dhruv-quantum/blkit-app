import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import App from "../App";
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

describe("Text-only activities (no sheet image yet)", () => {
  it("shows a 'Sheet pending' placeholder instead of a broken image", async () => {
    setImpl(createFakeSupabase({
      session: { user: { id: ADMIN.id, email: ADMIN.email }, access_token: "t" },
      profiles: [ADMIN], kitAccess: [],
    }));
    render(<App />);
    await waitFor(() => screen.getByText("Open kit"));
    fireEvent.click(screen.getByText("Open kit"));
    await waitFor(() => screen.getByText("Early Numeracy"));

    const heading = screen.getByText("Early Numeracy");
    const card = heading.closest("div").parentElement;
    fireEvent.click(within(card).getByText("Open booklet"));

    // Shapes activities are text-only; jump to a quarter that includes one
    await waitFor(() => screen.getByText(/Q3 · Cut & Create/));
    fireEvent.click(screen.getByText(/Q3 · Cut & Create/));

    await waitFor(() => expect(screen.getAllByText("Sheet pending").length).toBeGreaterThan(0));
    // The pending thumbnail button should be disabled (not clickable to open a modal)
    const pendingLabel = screen.getAllByText("Sheet pending")[0];
    const pendingBtn = pendingLabel.closest("button");
    expect(pendingBtn).toBeDisabled();
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
