import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "../App";

beforeEach(() => {
  window.localStorage.clear();
  window.history.pushState({}, "", "/");
});

describe("Brainy Ladder Kit Companion — full navigation flow", () => {
  it("renders the library with the age ladder and the Nursery kit", () => {
    render(<App />);
    expect(screen.getByText(/Pick up where your kit left off/i)).toBeInTheDocument();
    expect(screen.getByText("Nursery")).toBeInTheDocument();
    expect(screen.getByText("The Brainy Badgers")).toBeInTheDocument();
  });

  it("shows locked sibling kits (ladder) and add-on kits", () => {
    render(<App />);
    expect(screen.getByText("Playgroup")).toBeInTheDocument();
    expect(screen.getByText("KG–I")).toBeInTheDocument();
    expect(screen.getByText("KG–II")).toBeInTheDocument();
    // Locked age tiers show on the ladder as "Climbing up soon"
    expect(screen.getAllByText(/Climbing up soon/i).length).toBe(3);
    expect(screen.getByText("Phonics Learning Kit")).toBeInTheDocument();
    expect(screen.getByText("Flashcards")).toBeInTheDocument();
  });

  it("navigates into the kit home screen and shows the 4 quarters + trailer", () => {
    render(<App />);
    fireEvent.click(screen.getAllByText("Open kit")[0]);

    expect(screen.getByText("The Brainy Badgers")).toBeInTheDocument();
    expect(screen.getByText(/Official kit trailer/i)).toBeInTheDocument();
    expect(screen.getByText("Sense & Say")).toBeInTheDocument();
    expect(screen.getByText("Trace & Match")).toBeInTheDocument();
    expect(screen.getByText("Cut & Create")).toBeInTheDocument();
    expect(screen.getByText("Build & Imagine")).toBeInTheDocument();

    // 3 + 3 + 3 + 2 = 11 activities total, reflected in quarter counts
    expect(screen.getAllByText("3 activities ready")).toHaveLength(3);
    expect(screen.getByText("2 activities ready")).toBeInTheDocument();
  });

  it("opens the Animals booklet and defaults to Quarter 1 with 3 activities", () => {
    render(<App />);
    fireEvent.click(screen.getAllByText("Open kit")[0]);
    fireEvent.click(screen.getByText("Open booklet"));

    expect(screen.getByText("Animals")).toBeInTheDocument();
    expect(screen.getByText("Find My Correct Part")).toBeInTheDocument();
    expect(screen.getByText("Bird Flash Cards")).toBeInTheDocument();
    expect(screen.getByText("Hand Painting – Bird")).toBeInTheDocument();
    // Q3-only activity should not appear while on Q1
    expect(screen.queryByText("Animal Mask")).not.toBeInTheDocument();
  });

  it("switches quarters via tabs and shows the right activities", () => {
    render(<App />);
    fireEvent.click(screen.getAllByText("Open kit")[0]);
    fireEvent.click(screen.getByText("Open booklet"));

    fireEvent.click(screen.getByText(/Q4 · Build & Imagine/));
    expect(screen.getByText("Half Part Animal Matching")).toBeInTheDocument();
    expect(screen.getByText("Craft and Assembly")).toBeInTheDocument();
    expect(screen.queryByText("Find My Correct Part")).not.toBeInTheDocument();
  });

  it("jumps directly into a quarter from the kit home quarter cards", () => {
    render(<App />);
    fireEvent.click(screen.getAllByText("Open kit")[0]);
    fireEvent.click(screen.getByText("Cut & Create"));

    expect(screen.getByText("Animal Mask")).toBeInTheDocument();
    expect(screen.getByText("Vegetable Sorting & Matching")).toBeInTheDocument();
  });

  it("marks an activity complete, persists it to localStorage, and updates the progress bar", () => {
    render(<App />);
    fireEvent.click(screen.getAllByText("Open kit")[0]);
    fireEvent.click(screen.getByText("Open booklet"));

    expect(screen.getByText("0 of 11 activities complete")).toBeInTheDocument();

    const checkButtons = screen.getAllByTitle("Mark complete");
    fireEvent.click(checkButtons[0]);

    expect(screen.getByText("1 of 11 activities complete")).toBeInTheDocument();

    const stored = JSON.parse(
      window.localStorage.getItem("brainy-ladder:progress:brainy-badgers-nursery:animals")
    );
    expect(stored).toHaveLength(1);
  });

  it("resets progress when confirmed", () => {
    const originalConfirm = window.confirm;
    window.confirm = () => true;

    render(<App />);
    fireEvent.click(screen.getAllByText("Open kit")[0]);
    fireEvent.click(screen.getByText("Open booklet"));
    fireEvent.click(screen.getAllByTitle("Mark complete")[0]);
    expect(screen.getByText("1 of 11 activities complete")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Reset progress for this booklet/i));
    expect(screen.getByText("0 of 11 activities complete")).toBeInTheDocument();

    window.confirm = originalConfirm;
  });

  it("opens the instruction sheet modal with the real sheet image", () => {
    render(<App />);
    fireEvent.click(screen.getAllByText("Open kit")[0]);
    fireEvent.click(screen.getByText("Open booklet"));

    const sheetLabels = screen.getAllByText("Sheet 1 · Activities 1–2");
    fireEvent.click(sheetLabels[0]);

    const dialogTitles = screen.getAllByText("Sheet 1 · Activities 1–2");
    expect(dialogTitles.length).toBeGreaterThan(1); // one in the card flag, one in the modal header
    const modalImg = document.querySelector(".fixed img");
    expect(modalImg).toHaveAttribute("src", expect.stringContaining("/images/sheets/"));
  });

  it("shows the 'video on its way' empty state for activities with no video yet", () => {
    render(<App />);
    fireEvent.click(screen.getAllByText("Open kit")[0]);
    fireEvent.click(screen.getByText("Open booklet"));

    fireEvent.click(screen.getAllByText("Video")[0]);
    expect(screen.getByText("Video on its way")).toBeInTheDocument();
  });

  it("expands steps and materials for an activity", () => {
    render(<App />);
    fireEvent.click(screen.getAllByText("Open kit")[0]);
    fireEvent.click(screen.getByText("Open booklet"));

    fireEvent.click(screen.getAllByText(/Show steps & materials/)[0]);
    expect(screen.getByText(/Materials needed/i)).toBeInTheDocument();
    expect(screen.getByText(/Fish cut-outs/i)).toBeInTheDocument();
  });
});
