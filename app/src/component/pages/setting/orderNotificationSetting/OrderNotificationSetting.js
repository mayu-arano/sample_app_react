import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import './OrderNotificationSetting.scss'

const OrderNotificationSetting = (props) => {
    const [delayAlertTime, setDelayAlertTime] = useState(3)
    const [previousDelayAlertTime, setPreviousDelayAlertTime] = useState(3)
    const [isDelayAlert, setIsDelayAlert] = useState(true)

    const updateDelayAlertTimeURL = "https://script.google.com/macros/s/AKfycbzqzi4mrKvJ79eRgJB9Wbfce0pC_uyAjczMN2i3c-76ah9mZ7vyUmX2VXqD1UgVXAo/exec"
    const updateIsDelayAlertURL = "https://script.google.com/macros/s/AKfycbztJyx73oHsM9BmNteoICDx_39emYFOdU9TL4beGdhTZ0Y262ZfJ15zHFazMvHcdyI/exec"
    
    useEffect(() => {
        setDelayAlertTime(props.delayAlertTime)
        setPreviousDelayAlertTime(props.delayAlertTime)
    }, [props.delayAlertTime])

    useEffect(() => {
        setIsDelayAlert(props.isDelayAlert)
    }, [props.isDelayAlert])

    const updateData = async(data, url) => {
        const target = JSON.parse(JSON.stringify(data))
            const URL = url
            const postParam = {
                "method": 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: target
            }

            try {
                const response = await fetch(URL,postParam) 
                if (!response.ok) {
                    throw new Error("fetchに失敗しました");
                }
                toast.success('保存しました');
                return true;
            }catch(err) { 
                console.error("error: " + err);
                toast.error('エラーが発生しました');
                return false;
            }
    }

    const changeDelayAlertTime = (inputDelayAlertTime) => {
        const regex = /^\d+$/;
        if ( inputDelayAlertTime > 100 ) {
            inputDelayAlertTime = 100;
        }
        if (inputDelayAlertTime === previousDelayAlertTime ) {
            return
        }
        if(!regex.test(inputDelayAlertTime)) {
            inputDelayAlertTime = previousDelayAlertTime;
            return
        }
        setDelayAlertTime(inputDelayAlertTime)
        const postData = `{"delay_alert_time": "` + inputDelayAlertTime + `"}`;
        updateData(postData, updateDelayAlertTimeURL).then(result => {
            if (result) {
                setPreviousDelayAlertTime(inputDelayAlertTime)
            };
        });
        
    }

    const validationDelayAlertTime =(inputDelayAlertTime) => {
        const regex = /^\d+$/
        if(!regex.test(inputDelayAlertTime)) {
            setDelayAlertTime("")
        } else {
            setDelayAlertTime(inputDelayAlertTime)
        }
    }

    const changeIsDelayAlert = (inputIsDelayAlert) => {
        setIsDelayAlert(inputIsDelayAlert);
        const postData = `{"is_delay_alert": "` + inputIsDelayAlert.toString() + `"}`;
        updateData(postData, updateIsDelayAlertURL);
    }

    return (
        <div className={`orderNotificationArea settingArea`}>
            <p className={`settingItem`}>遅延アラート</p>
            <div className={`delayAlertTime section`}>
                <p className={`section-title`}>経過時間</p>
                <input className={`section-input delayAlertTime-input`} 
                        type="text" 
                        value={ delayAlertTime } 
                        placeholder="3" 
                        onChange={ e => validationDelayAlertTime(e.target.value) }
                        onBlur={ e => changeDelayAlertTime(e.target.value)} />
                分
            </div>
            <div className={ `isDelayAlert section` }>
                <p className = { `section-title` }>通知音</p>
                <label className = {`toggle-area`}>
                    <Toggle
                        checked={ isDelayAlert }
                        icons={false}
                        className={ `toggle-button input-delay-alert`}
                        onChange={ e => changeIsDelayAlert(e.target.checked) } 
                         />
                    <span>{ isDelayAlert ? "on":"off"}</span>
                </label>
            </div>
        </div>
    );
};

export default OrderNotificationSetting;