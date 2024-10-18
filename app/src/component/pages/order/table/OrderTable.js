import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import OrderTableItem from './item/OrderTableItem'
import './OrderTable.scss'

const OrderTable = () => {
    const [error, setError] = useState("");
    const [orders, setOrders] = useState([]);
    const [sortedOrders, setSortedOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [displayOrderTurns, setDisplayOrderTurns] = useState("");
    const [spaceLines, setSpaceLines] = useState("");
    const [hideTimeAfterCooking, setHideTimeAfterCooking] = useState();
    const [isShowCourse, setIsShowCourse] = useState();
    const [isShowTopping, setIsShowTopping] = useState();
    const [isDelayAlert, setIsDelayAlert] = useState();
    const [delayAlertTime, setDelayAlertTime] = useState();

    const formatData = (responseData) => {
        const keys = responseData.values[0];
        const content = responseData.values.slice(1);
        const formatedData = content.map(item => {
            let obj = {};
            item.forEach((value, index) => {
                obj[keys[index]] = value;
            });
            return obj;
        });
        return formatedData
    }

    const toBoolean = (booleanStr) => {
        return booleanStr.toLowerCase() === "true";
    }

    const sortOrder = async() => {
        if (displayOrderTurns == "newest") {
            setSortedOrders([...orders].sort((a, b) => descTimeSort(new Date(a.create_time), new Date(b.create_time))))
            return
        }
        setSortedOrders([...orders].sort((a, b) => ascTimeSort(new Date(a.create_time), new Date(b.create_time))))
    }

    const descTimeSort = (a, b) => {
        return a < b ? 1 : -1;
    }

    const ascTimeSort = (a, b) => {
        return a > b ? 1 : -1;
    }

    const changeDisplayOrderTurns = () => {
        switch ( displayOrderTurns ) {
            case 'oldest':
                setDisplayOrderTurns('newest')
                break
            case 'newest':
                setDisplayOrderTurns('oldest')
                break
        }
    }

    const orderTableItemList = () => {
        return sortedOrders.map(order =>
            <OrderTableItem order={order} key={order.id} 
            spaceLines={ spaceLines }
            hideTimeAfterCooking={ hideTimeAfterCooking }
            isShowCourse={ isShowCourse } 
            isShowTopping={ isShowTopping } 
            delayAlertTime={ delayAlertTime }
            isDelayAlert = { isDelayAlert }  />
        )
    }

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axios.get("https://sheets.googleapis.com/v4/spreadsheets/1IU5KIsjYWXrvZY8AugFYLQQow2wSCWIn5g3MaTBpc0U/values/OrderTable?key=AIzaSyAc1nR2J4crJMeNvgCGHlknH3Zj7Ue6PKw");
                const orderData = formatData(response.data)   
                await setOrders([...orderData])
                
            } catch (error) {
                setError("注文データの取得中にエラーが発生しました。");
            } finally {
                setIsLoading(false);
            }
        };

        const fetchSettingData = async () => {
            try {
                const response = await axios.get("https://sheets.googleapis.com/v4/spreadsheets/1IU5KIsjYWXrvZY8AugFYLQQow2wSCWIn5g3MaTBpc0U/values/SettingTable?key=AIzaSyAc1nR2J4crJMeNvgCGHlknH3Zj7Ue6PKw");
                const settingData = formatData(response.data)  

                setDisplayOrderTurns(settingData[0].display_order_turns)
                setSpaceLines(settingData[0].space_lines)
                setHideTimeAfterCooking(Number(settingData[0].hide_time_after_cooking))
                setIsShowCourse(toBoolean(settingData[0].is_show_course))
                setIsShowTopping(toBoolean(settingData[0].is_show_topping))
                setIsDelayAlert(toBoolean(settingData[0].is_delay_alert))
                setDelayAlertTime(Number(settingData[0].delay_alert_time))

            } catch (error) {
                console.log(error)
                setError("設定データの取得中にエラーが発生しました。");
            } finally {
                setIsLoading(false);
            }
        };

        (async() => {
            await fetchSettingData();
            await fetchOrderData();
        })()
    },[]);

    useEffect(() => {
        sortOrder()
    }, [orders, displayOrderTurns])

    // エラーが発生した場合の表示
    if (error) {
        return <div>{error}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <table className={`order-table`}>
            <tbody>
                <tr className={`order-table-header`}>
                    <th>
                        テーブル・番号
                    </th>
                    <th>
                        <a className={`passed-time-btn ${displayOrderTurns}`} onClick={() => changeDisplayOrderTurns()}>
                            経過時間
                        </a>
                    </th>
                    { isShowCourse ? <th>コース</th>: "" }
                    <th>
                        メニュー
                    </th>
                    { isShowTopping ? <th>トッピング</th>: "" }
                    <th>
                        数量
                    </th>
                    <th>
                        状態
                    </th>
                </tr>
                { orderTableItemList() }
            </tbody>
        </table>
    );
};

export default OrderTable;