import React from "react";
import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { afterEach, it, expect, vi } from "vitest";
import BlockPlayer from "./BlockPlayer.jsx";
afterEach(cleanup);
const quiz = {
  id: "q1",
  type: "quiz",
  title: "1+1?",
  body: "",
  minutes: 0,
  url: "",
  options: ["1", "2"],
  answer: 1,
  pairs: [],
  sequence: [],
};
it("only sends the answer when checked and resubmits changes on a retry", async () => {
  const onAnswer = vi.fn().mockResolvedValue({});
  render(<BlockPlayer block={quiz} onAnswer={onAnswer} />);
  fireEvent.click(screen.getAllByRole("radio")[1]);
  expect(onAnswer).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Kiểm tra đáp án" }));
  await waitFor(() => expect(onAnswer).toHaveBeenCalledWith("q1", [1]));
  await waitFor(() =>
    expect(screen.queryByText("Đang lưu kết quả…")).not.toBeInTheDocument(),
  );
  fireEvent.click(screen.getByRole("button", { name: "Làm lại" }));
  fireEvent.click(screen.getAllByRole("radio")[0]);
  fireEvent.click(screen.getByRole("button", { name: "Kiểm tra đáp án" }));
  await waitFor(() => expect(onAnswer).toHaveBeenLastCalledWith("q1", [0]));
});
it("retains a failed answer so the student can save it again", async () => {
  const onAnswer = vi
    .fn()
    .mockRejectedValueOnce(new Error("Mất kết nối"))
    .mockResolvedValue({});
  render(<BlockPlayer block={quiz} onAnswer={onAnswer} />);
  fireEvent.click(screen.getAllByRole("radio")[1]);
  fireEvent.click(screen.getByRole("button", { name: "Kiểm tra đáp án" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Mất kết nối");
  fireEvent.click(screen.getByRole("button", { name: "Thử lưu lại" }));
  await waitFor(() =>
    expect(screen.queryByRole("alert")).not.toBeInTheDocument(),
  );
  expect(onAnswer).toHaveBeenCalledTimes(2);
  expect(onAnswer).toHaveBeenLastCalledWith("q1", [1]);
});
