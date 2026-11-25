const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7100/api";

export class ApiError extends Error {
  readonly validationErrors: Record<string, string[]>;

  constructor(message: string, readonly status: number, validationErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.validationErrors = validationErrors;
  }
}

function notifyApiError(message: string, status: number) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent("api-error", {
    detail: { message, status },
  }));
}

function validationErrorsFrom(data: unknown): Record<string, string[]> {
  if (!data || typeof data !== "object" || !("errors" in data)) return {};
  const errors = (data as { errors?: unknown }).errors;
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) return {};
  return Object.fromEntries(Object.entries(errors).map(([key, value]) => [
    key,
    (Array.isArray(value) ? value : [value]).filter((item): item is string => typeof item === "string"),
  ]));
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${formattedEndpoint}`;

  const headers = new Headers(options?.headers);
  const hasFormDataBody =
    typeof FormData !== "undefined" && options?.body instanceof FormData;

  if (hasFormDataBody) {
    // Let the browser add the multipart boundary. An explicit JSON or
    // multipart Content-Type without its boundary makes ASP.NET reject the body.
    headers.delete("Content-Type");
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let response: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort("timeout"), 30_000);
  const externalSignal = options?.signal;
  const abortFromCaller = () => controller.abort(externalSignal?.reason);
  if (externalSignal?.aborted) abortFromCaller();
  externalSignal?.addEventListener("abort", abortFromCaller, { once: true });
  try {
    response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
    });
  } catch (cause) {
    clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", abortFromCaller);
    if (externalSignal?.aborted) throw cause;
    if (controller.signal.aborted) {
      throw new Error(controller.signal.reason === "timeout"
        ? "Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại."
        : "Yêu cầu đã bị hủy.");
    }
    throw new Error("Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại!");
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", abortFromCaller);
    return undefined as T;
  }

  let data: unknown;
  let responseText: string;
  try {
    responseText = await response.text();
  } catch {
    clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", abortFromCaller);
    if (externalSignal?.aborted) throw new Error("Yêu cầu đã bị hủy.");
    if (controller.signal.aborted) throw new Error("Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.");
    throw new Error("Không thể đọc phản hồi từ máy chủ. Vui lòng thử lại.");
  }
  clearTimeout(timeout);
  externalSignal?.removeEventListener("abort", abortFromCaller);
  if (responseText) {
    try { data = JSON.parse(responseText); }
    catch { data = responseText; }
  }

  if (!response.ok) {
    const validationErrors = validationErrorsFrom(data);
    const fieldMessage = Object.values(validationErrors).flat().find(Boolean);
    let message = response.status === 401
      ? "Phiên đăng nhập đã hết hạn hoặc không hợp lệ!"
      : response.status === 403
        ? "Bạn không có quyền thực hiện thao tác này!"
        : response.status === 404
          ? "Không tìm thấy dữ liệu được yêu cầu."
          : response.status >= 500
            ? "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."
            : "Yêu cầu không thể thực hiện. Vui lòng kiểm tra thông tin và thử lại.";

    if (fieldMessage) message = fieldMessage;
    else if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    ) {
      message = (data as { message: string }).message;
    } else if (
      typeof data === "object" &&
      data !== null &&
      "title" in data &&
      typeof (data as { title: unknown }).title === "string"
    ) {
      message = (data as { title: string }).title;
    } else if (
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof (data as { detail: unknown }).detail === "string"
    ) {
      message = (data as { detail: string }).detail;
    } else if (response.status === 409) {
      message = "Dữ liệu đang xung đột với trạng thái hiện tại. Vui lòng tải lại và thử lại.";
    } else if (typeof data === "string" && data.trim() && response.status < 500) {
      message = data;
    }

    notifyApiError(message, response.status);
    throw new ApiError(message, response.status, validationErrors);
  }

  if (!responseText) return undefined as T;
  if (!data || typeof data !== "object") {
    throw new Error("Máy chủ trả về dữ liệu không đúng định dạng. Vui lòng thử lại sau.");
  }
  return data as T;
}
