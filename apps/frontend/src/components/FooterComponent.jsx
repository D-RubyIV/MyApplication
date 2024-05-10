const FooterComponent = () => {
    const arrayItem = [
        {
            "name": "CHÍNH SÁCH BẢO MẬT",
            "icon": "https://down-vn.img.susercontent.com/file/8ee559562d123cf132a7cec374784442",
        },
        {
            "name": "QUY CHẾ HOẠT ĐỘNG",
            "icon": "https://down-vn.img.susercontent.com/file/5e2ef7014b7a5004ebc7383e115364d5",
        },
        {
            "name": "CHÍNH SÁCH VẬN CHUYỂN",
            "icon": "https://down-vn.img.susercontent.com/file/b334ced59fb923afa9f6cc41be2c2e14",
        },
        {
            "name": "CHÍNH SÁCH HOÀN TIỀN VÀ TRẢ HÀNG",
            "icon": "https://down-vn.img.susercontent.com/file/9055ca43afee3425736586fd115cb197",
        },
    ]
    return (
        <div className="mt-5">
            <br />
            <div className="grid grid-cols-2 text-[11px] text-gray-900 text-center gap-x-1 gap-y-2">
                {
                    arrayItem.map((item, index) => {
                        return (
                            <div key={index} className="text-center gap-1 flex justify-center">
                                <img src={item.icon} className="w-3 h-3 mt-0.5"></img>
                                <span>{item.name}</span>
                            </div>
                        )
                    })
                }
            </div>
            <div className="text-[11.5px] text-gray-900 text-center mt-2">
                <div>
                    <span>
                        Địa chỉ: Tòa nhà trung tâm Lotte Hà Nội, 50 Liễu Giai, Quận Ba Đình, Hà Nội
                    </span>
                </div>
                <div>
                    <span className="text-nowrap">
                        Số điện thoại hỗ trợ: 0123456789 - Email: cskh@hotro.shopee.vn
                    </span>
                </div>
            </div>
        </div>
    );
}

export default FooterComponent;