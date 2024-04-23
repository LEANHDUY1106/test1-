export interface ScrollToElementOptions {

    /**Độ trễ khi thực thi scoll, giá trị mặc định: 0 */
    delay?: number

    /**Hiệu ứng khi scroll, giá trị mặc định: 'smooth' */
    behavior?: string,

    /**
     * Độ lệch khi scroll,
     * nếu truyền số dương sẽ scroll lệch xuống thêm differrence so vs element được tìm thấy trong selector
     * nếu truyền số âm sẽ sroll lệch lên thêm differrence so vs element được tìm thấy trong selector,
     * giá trị mặc định: 0
     * */
    differrence?: number
}

export interface ScrollToElementResult {
    /**Thành công hay thất bại */
    isSuccess: boolean,
    /**Thông tin lỗi */
    message: string
}
