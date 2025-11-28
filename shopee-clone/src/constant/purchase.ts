export const purchaseStatus = {
  inCart: -1, // Đang nằm trong giỏ hàng
  all: 0, // Lấy tất cả đơn hàng (không phân biệt trạng thái)
  waitForConfirmation: 1, // Chờ xác nhận (người mua vừa đặt, shop chưa xử lý)
  waitForGetting: 2, // Chờ lấy hàng (shop đã xác nhận, đang chuẩn bị)
  inProgress: 3, // Đang giao
  delivered: 4, // Đã giao thành công
  cancelled: 5 // Đã hủy
} as const
