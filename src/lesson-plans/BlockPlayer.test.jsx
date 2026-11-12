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
import SlidePresentation from "./SlidePresentation.jsx";
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

it("reopens saved quiz choices through the real presentation without posting an answer, and allows an explicit redo", () => {
  const onAnswer = vi.fn();
  render(
    <SlidePresentation
      plan={{
        title: "Saved homework",
        blocks: [quiz],
        progress: {
          total: 1,
          answered: 1,
          correct: 1,
          incorrect: 0,
          answers: [{ blockId: quiz.id, values: [1] }],
        },
      }}
      onClose={() => {}}
      onAnswer={onAnswer}
    />,
  );
  expect(screen.getAllByRole("radio")[1]).toBeChecked();
  expect(
    screen.getByRole("button", { name: "Kiểm tra đáp án" }),
  ).toBeDisabled();
  expect(onAnswer).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Làm lại" }));
  expect(screen.getAllByRole("radio")[1]).not.toBeChecked();
  expect(onAnswer).not.toHaveBeenCalled();
});
it.each([
  ["matching", "Kiểm tra ghép cặp", "Đúng 2/2 cặp."],
  ["ordering", "Kiểm tra thứ tự", "Thứ tự chính xác!"],
  ["group-sort", "Kiểm tra phân nhóm", "Đúng 2/2 thẻ."],
])(
  "restores saved %s responses as checked without creating another answer event",
  (type, label, status) => {
    const onAnswer = vi.fn();
    render(
      <BlockPlayer
        block={{
          ...quiz,
          type,
          pairs: [
            { left: "Cat", right: "Animal" },
            { left: "Apple", right: "Fruit" },
          ],
          sequence: ["One", "Two"],
        }}
        initialValues={[0, 1]}
        onAnswer={onAnswer}
      />,
    );
    expect(screen.getByRole("button", { name: label })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(status);
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Làm lại" }));
    expect(onAnswer).not.toHaveBeenCalled();
  },
);
