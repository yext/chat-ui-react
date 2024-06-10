import { useSendMessageWithRetries } from "../../src/hooks/useSendMessageWithRetries";
import { renderHook } from "@testing-library/react";
import { mockChatActions, spyOnActions } from "../__utils__/mocks";
import { ApiError } from "@yext/chat-headless-react";

const ApiInternalServerError = new ApiError("API Internal Error", 500);
const ApiBadRequestError = new ApiError("API Bad Request Error", 400);

it("failed request with no retries on 5XX error", async () => {
  mockChatActions({
    getNextMessage: jest.fn(() => Promise.reject(ApiInternalServerError)),
  });
  const actions = spyOnActions();
  const onRetryMock = jest.fn();
  const { result } = renderHook(() =>
    useSendMessageWithRetries(false, 0, onRetryMock)
  );
  await expect(result.current("mock message")).rejects.toThrow(
    ApiInternalServerError
  );
  expect(actions.getNextMessage).toBeCalledTimes(1);
  expect(onRetryMock).toBeCalledTimes(0);
});

it("failed request with retries on 5XX error", async () => {
  mockChatActions({
    getNextMessage: jest.fn(() => Promise.reject(ApiInternalServerError)),
  });
  const actions = spyOnActions();
  const onRetryMock = jest.fn();
  const { result } = renderHook(() =>
    useSendMessageWithRetries(false, 1, onRetryMock)
  );
  await expect(result.current("mock message")).rejects.toThrow(
    ApiInternalServerError
  );
  expect(actions.getNextMessage).toBeCalledTimes(2);
  expect(onRetryMock).toBeCalledTimes(1);
});

it("failed request with no retries on non-5XX error", async () => {
  mockChatActions({
    getNextMessage: jest.fn(() => Promise.reject(ApiBadRequestError)),
  });
  const actions = spyOnActions();
  const onRetryMock = jest.fn();
  const { result } = renderHook(() =>
    useSendMessageWithRetries(false, 1, onRetryMock)
  );
  await expect(result.current("mock message")).rejects.toThrow(
    ApiBadRequestError
  );
  expect(actions.getNextMessage).toBeCalledTimes(1);
  expect(onRetryMock).toBeCalledTimes(0);
});

it("successful request with no retries", async () => {
  mockChatActions({
    getNextMessage: jest.fn(() => Promise.resolve()),
  });
  const actions = spyOnActions();
  const onRetryMock = jest.fn();
  const { result } = renderHook(() =>
    useSendMessageWithRetries(false, 1, onRetryMock)
  );
  await expect(result.current("mock message")).resolves.toEqual(undefined);
  expect(actions.getNextMessage).toBeCalledTimes(1);
  expect(onRetryMock).toBeCalledTimes(0);
});
