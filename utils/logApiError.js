

export function logApiError(context, error) {
  console.error(`${context}:`, {
    message: error?.message,
    code: error?.code,
    status: error.response?.status,
    response: error.response?.data,
    cause: error.cause?.message,
  })
}