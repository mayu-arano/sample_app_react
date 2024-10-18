import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import DisplayOrderSetting from './displayOrderSetting/DisplayOrderSetting';
import OrderNotificationSetting from './orderNotificationSetting/OrderNotificationSetting';
import DeleteData from './deleteData/DeleteData';
import axios from 'axios';
import './SettingPage.scss'

const SettingPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
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

    useEffect(() => {
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
        })()
    },[]);

    if (error) {
        return <div>{error}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }


    return (
        <div className={ `settings`}>
            <ToastContainer 
                position="top-right"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                theme="colored"
            />
            <DisplayOrderSetting
                displayOrderTurns = { displayOrderTurns }
                spaceLines = { spaceLines }
                hideTimeAfterCooking = { hideTimeAfterCooking }
                isShowCourse = { isShowCourse }
                isShowTopping = { isShowTopping } />
            <OrderNotificationSetting 
                delayAlertTime = { delayAlertTime }
                isDelayAlert = { isDelayAlert }
                />
            <DeleteData />
        </div>
    );
};

export default SettingPage;