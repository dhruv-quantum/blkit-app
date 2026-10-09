import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import App from "../App";
import ActivityCard from "../components/ActivityCard";
import { createFakeSupabase } from "./fakeSupabase";
import { KITS } from "../data/kit";
import { getFlashcardGuide } from "../data/flashcards";
import { existsSync } from "node:fs";

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

describe("Nursery content additions", () => {
  const nursery = KITS.find((k) => k.id === "nursery");
  const all = nursery.booklets.flatMap((b) => b.activities.map((a) => ({ ...a, booklet: b })));

  it("states the right age bands for every kit", () => {
    const ages = Object.fromEntries(KITS.filter((k) => k.stats).map((k) => [k.id, k.stats.find((s) => s.startsWith("Ages"))]));
    expect(ages.playgroup).toBe("Ages 1.5–2.5");
    expect(ages.nursery).toBe("Ages 2.5–3.5");
    expect(ages.kg1).toBe("Ages 3.5–4.5");
    expect(ages.kg2).toBe("Ages 4.5–5.5");
  });

  it("keeps the advertised activity count in step with the data", () => {
    expect(nursery.stats).toContain(`${all.length} guided activities in the app`);
  });

  it("has unique activity ids and a real image file for every sheet and cover", () => {
    const ids = all.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    const missing = [];
    for (const a of all) if (!existsSync(`public${a.sheetImage}`)) missing.push(a.sheetImage);
    for (const b of nursery.booklets) if (b.cover && !existsSync(`public${b.cover}`)) missing.push(b.cover);
    expect(missing).toEqual([]);
  });

  it("includes Puzzles, Festivals, Actions We Do and The Igloo", () => {
    expect(nursery.booklets.find((b) => b.id === "puzzles").activities).toHaveLength(10);
    expect(nursery.booklets.find((b) => b.id === "festivals").activities).toHaveLength(4);
    expect(all.filter((a) => a.theme === "Actions We Do")).toHaveLength(2);
    expect(all.some((a) => a.title === "The Igloo")).toBe(true);
  });

  it("does not turn the flashcards into activities", () => {
    expect(all.some((a) => /flash ?cards?/i.test(a.title) && a.theme === "Flashcards")).toBe(false);
  });
});

describe("Flashcard guide", () => {
  it("every deck has a preview image, a valid quarter and a note", () => {
    const g = getFlashcardGuide("nursery");
    expect(g.decks.length).toBe(20);
    for (const d of g.decks) {
      expect(existsSync(`public/images/flashcards/flash-${d.id}.jpg`)).toBe(true);
      expect([1, 2, 3, 4]).toContain(d.quarter);
      expect(d.note.length).toBeGreaterThan(5);
    }
    for (const gm of g.games) expect(gm.steps.length).toBeGreaterThanOrEqual(3);
  });

  it("opens from the kit page, lists decks and filters by quarter", async () => {
    setImpl(createFakeSupabase({
      session: { user: { id: ADMIN.id, email: ADMIN.email }, access_token: "t" },
      profiles: [ADMIN], kitAccess: [],
    }));
    window.history.pushState({}, "", "/");
    render(<App />);
    await waitFor(() => screen.getByText("Open kit"));
    fireEvent.click(screen.getByText("Open kit"));
    await waitFor(() => screen.getByText("Flashcard Guide"));
    fireEvent.click(screen.getByText("Flashcard Guide"));
    await waitFor(() => screen.getByText("How to play"));
    expect(screen.getByText("Name It")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(20);
    fireEvent.click(screen.getByRole("tab", { name: "Q4" }));
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Months" })).toBeInTheDocument();
  });
});
