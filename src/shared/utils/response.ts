export const createSuccessResponse = (message: string, data?: any) => {
  return {
    success: true,
    message,
    data: data || {},
  };
};

export const createErrorResponse = (message: string, errors?: any[]) => {
  const response: any = {
    success: false,
    message,
  };
  if (errors && errors.length > 0) {
    response.errors = errors;
  }
  return response;
};

export const createPaginationResponse = (message: string, items: any[], meta: { page: number, limit: number, total: number, totalPages: number }) => {
  return {
    success: true,
    message,
    data: {
      items,
      meta,
    },
  };
};
