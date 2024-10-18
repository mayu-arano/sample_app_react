import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import HistoryTableItem from './item/HistoryTableItem';
import './HistoryTable.scss'

const HistoryTable = (props) => {
    const [error, setError] = useState("");
    const [orders, setOrders] = useState([]);
    const [sortedOrders, setSortedOrders] = useState([]);
    const [baseOrders, setBaseOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [displayOrderTurns, setDisplayOrderTurns] = useState("");
    const [spaceLines, setSpaceLines] = useState("");
    const [isShowCourse, setIsShowCourse] = useState();
    const [isShowTopping, setIsShowTopping] = useState();


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
            setSortedOrders([...orders].sort((a, b) => descTimeSort(a,b)))
            return
        }
        setSortedOrders([...orders].sort((a, b) => ascTimeSort(a, b)))
    }

    const descTimeSort = (a, b) => {
        if(new Date(a.create_time) < new Date(b.create_time)) return 1;
        if(new Date(a.create_time) > new Date(b.create_time)) return -1;
        if(a.id < b.id) return 1;
        if(a.id > b.id) return -1;
    }

    const ascTimeSort = (a, b) => {
        if(new Date(a.create_time) > new Date(b.create_time)) return 1;
        if(new Date(a.create_time) < new Date(b.create_time)) return -1;
        if(a.id < b.id) return 1;
        if(a.id > b.id) return -1;
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

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axios.get("https://sheets.googleapis.com/v4/spreadsheets/1IU5KIsjYWXrvZY8AugFYLQQow2wSCWIn5g3MaTBpc0U/values/OrderTable?key=AIzaSyAc1nR2J4crJMeNvgCGHlknH3Zj7Ue6PKw");
                const orderData = formatData(response.data)   
                await setOrders([...orderData])
                await setBaseOrders([...orderData]);
                
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
                setIsShowCourse(toBoolean(settingData[0].is_show_course))
                setIsShowTopping(toBoolean(settingData[0].is_show_topping))

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
        searchOrder(props.searchParam)
    }, [props.searchParam])

    useEffect(() => {
        sortOrder()
    }, [displayOrderTurns, orders])

    const searchOrder = async(searchParams) => {
        let machedOrder = baseOrders;
        if(typeof searchParams.searchTableName === 'string' && searchParams.searchTableName != "") {
            machedOrder = await searchTableName(machedOrder, searchParams.searchTableName)
        }
        if(searchParams.searchDate) {
            machedOrder = await searchDate(machedOrder, searchParams.searchDate.getDate())
        }

        if(searchParams.searchTime != "すべて") {
            let hour = searchParams.searchTime.replace("時台", "")
            hour = parseInt(hour, 10)
            machedOrder = await searchTime(machedOrder, hour)
        }

        if(!searchParams.searchAllStatusData) {
            if(searchParams.searchCookedData) {
                console.log(searchParams.searchCookedData)
                machedOrder = await searchStatus(machedOrder, 'cooked')
            }
            if(searchParams.searchServedData) {
                machedOrder = await searchStatus(machedOrder, 'served')
            }
        }
        setOrders(machedOrder);
    }

    const searchTableName = (inputOrders, tableName) => {
        return inputOrders.filter(order => {
            return order.t_num === tableName})
    }

    const searchDate = (inputOrders, date) => {
        return inputOrders.filter(order => { 
            const orderDate = new Date(order.create_time).getDate()
            return orderDate === date
        })
    }

    const searchTime = (inputOrders, hour) => {
        return inputOrders.filter(order => {
            return new Date(order.create_time).getHours() === hour
        })
    }

    const searchStatus = (inputOrders, status) => {
        return inputOrders.filter(order => {
            return order.status === status
        })
    }


    const historyTableItemList = () => {
        return sortedOrders.map(order=>
            <HistoryTableItem order={order} key={order.id}
            spaceLines={ spaceLines }
            isShowCourse={ isShowCourse } 
            isShowTopping={ isShowTopping } />
        )
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }


    return (
        <table className={`history-table`}>
            <tbody>
                <tr className={`history-table-header`}>
                    <th>
                        テーブル・番号
                    </th>
                    <th>
                        <a className={`created-time-btn ${displayOrderTurns}`} onClick={() => changeDisplayOrderTurns()}>
                            注文日時
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
                { historyTableItemList() }
            </tbody>
        </table>
    );
};

export default HistoryTable;