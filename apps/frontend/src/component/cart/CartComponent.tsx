import { AddCircleOutline, CloseOutlined, DeleteOutlineRounded, RemoveCircleOutline } from "@mui/icons-material";
import { useEffect, useState, Fragment, useRef } from "react";
import instance from "../../axios/Instance";
import { useAppContext } from "../../store/AppContext";

type GroupCartDetail = {
    id: number;
    carts: CartDetail[];
};

const CartComponent = () => {

    const [listCartDetail, setListCartDetail] = useState<CartDetail[]>([]);
    const { isOpenCart, setIsOpenCart } = useAppContext();
    const [listGroupCardDetail, setListGroupCardDetail] = useState<GroupCartDetail[]>([]);
    const [listSelectedId, setListSelectedId] = useState<number[]>([])
    const baseImage = "https://product.hstatic.net/200000690725/product/social_post_3_-_12.06-04_58b026e298c9484c8baa13a1ef538757_master.jpg";

    useEffect(() => {
        let calculatedTotal = 0;
        listCartDetail.forEach((item) => {
            calculatedTotal += item.quantity * ((item.productDetail as ProductDetail).product as Product).price;
        });

        let listIdProduct: number[] = [];
        listCartDetail.forEach((s) => {
            let id = ((s.productDetail as ProductDetail)?.product as Product)?.id;
            if (!listIdProduct.includes(id)) {
                listIdProduct.push(id);
            }
        });
        console.log(listIdProduct);

        setListGroupCardDetail([]);
        listIdProduct.forEach((currentIdProduct) => {
            let object: GroupCartDetail = { id: currentIdProduct, carts: [] };
            listCartDetail.forEach((s) => {
                let idProduct = ((s.productDetail as ProductDetail)?.product as Product)?.id;
                if (idProduct === currentIdProduct) {
                    object.carts.push(s);
                }
            });
            console.log(object);
            setListGroupCardDetail((prev) => [...prev, object]);
        });
    }, [listCartDetail]);


    const handleDeleteCardDetail = async (id: number) => {
        await instance.delete(`api/manage/cart-details/${id}`).then(function (response) {
            if (response?.status === 200) {
                fetchCartItems();
            }
        })
    }

    const fetchCartItems = async () => {
        await instance.get("api/common/me/cart/items").then((response) => {
            if (response?.status === 200) {
                setListCartDetail(response.data);
            }
        });
    };

    const handleAddQuantity = (id: number) => {
        setListCartDetail((prevListCartDetail) =>
            prevListCartDetail.map((cart) =>
                cart.id === id ? { ...cart, quantity: cart.quantity + 1 } : cart
            )
        );
    };

    const handleMinusQuantity = (id: number) => {
        setListCartDetail((prevListCartDetail) =>
            prevListCartDetail.map((cart) =>
                cart.id === id && cart.quantity > 0 ? { ...cart, quantity: cart.quantity - 1 } : cart
            )
        );
    };

    const handleSelectCartDetail = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const { checked } = event.target;
        setListSelectedId(prev => {
            if (checked) {
                return [...prev, id];
            } else {
                return prev.filter(selectedId => selectedId !== id);
            }
        });
    };

    useEffect(() => {
        if (isOpenCart === true) {
            fetchCartItems();
        }
    }, [isOpenCart]);

    return (
        <Fragment>
            <div className={`z-40 fixed h-[100vh] xl:px-20 top-0 from-indigo-900 bg-gradient-to-l rounded-md w-full transition-all duration-500 block ${isOpenCart ? "right-0" : "-right-full"}`}>
                <div className="grid grid-cols-6 h-full">
                    <div className="col-end-2 col-start-7 bg-gradient-to-t from-gray-200 to-gray-100 px-6 md:px-10 py-4 flex flex-col justify-between">
                        <div>
                            {/* TOP */}
                            <div className="flex justify-between py-3 md:py-4 row-span-4">
                                <div><span className="text-xl font-semibold text-gray-600">Giỏ hàng</span></div>
                                <div><button onClick={() => setIsOpenCart(false)}><CloseOutlined /></button></div>
                            </div>
                            {/* CENTER */}
                            <div className={`overflow-y-auto h-[calc(100vh-10.75rem)]`}>
                                {listGroupCardDetail.map((item, index) => (
                                    <Fragment key={index}>
                                        {item.carts.map((cart, cartIndex) => (
                                            <Fragment key={cartIndex}>
                                                <div className="text-[13.5px] grid grid-cols-12 gap-2 border-b border-dashed border-gray-400 py-3">
                                                    <div className="inline-flex justify-center items-center col-span-4 gap-1">
                                                        <div className="flex items-center justify-center">
                                                            <input type="checkbox" onChange={(event) => handleSelectCartDetail(event, cart.id)} />
                                                        </div>
                                                        <div>
                                                            <img src={baseImage} className="w-[25vw] object-cover" alt="Product" />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-8">
                                                        <div className="flex items-center">
                                                            <span className="font-medium text-[12.5px]">
                                                                {(cart.productDetail as ProductDetail)?.name || ((cart.productDetail as ProductDetail)?.product as Product)?.name}
                                                            </span>
                                                            <span className="font-medium text-red-600 ">
                                                                <button className="active:bg-red-400 p-1 rounded-full" onClick={() => handleDeleteCardDetail(cart.id)}><DeleteOutlineRounded /></button>
                                                            </span>
                                                        </div>
                                                        <div className="text-sm font-thin">
                                                            <span>{((cart.productDetail as ProductDetail)?.color as Color)?.name}</span>
                                                            {" / "}
                                                            <span>{((cart.productDetail as ProductDetail)?.size as Size)?.name}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <div className="flex gap-2 text-gray-400 duration-100 items-center">
                                                                <button className="active:text-gray-900 active:text-[15px] ease-in-out" onClick={() => { handleAddQuantity(cart.id); }}><AddCircleOutline /></button>
                                                                <div className="text-gray-900">
                                                                    <span>{cart?.quantity}</span>
                                                                </div>
                                                                <button className="active:text-gray-900 active:text-[15px] ease-in-out" onClick={() => { handleMinusQuantity(cart.id); }}><RemoveCircleOutline /></button>
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold">{(cart.productDetail as ProductDetail)?.price.toLocaleString("vi-VN") + "₫"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        ))}
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                        {/* BOTTOM */}
                        <div className="text-center text-sm">
                            <div className="py-2 flex justify-between">
                                <span>Tổng tiền:</span>
                                <span className="text-red-500 font-semibold">
                                    {(() => {
                                        let quantity = 0;
                                        listCartDetail.filter(s => listSelectedId.includes(s.id)).forEach((item) => {
                                            quantity += item.quantity * (item.productDetail as ProductDetail)?.price;
                                        });
                                        return quantity.toLocaleString("vi-VN") + "₫";
                                    })()}
                                </span>
                            </div>
                            <button className="bg-black w-full py-2 font-thin rounded-md text-white">Thanh toán</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default CartComponent;
