import React, { useState, useEffect, useRef }from 'react';
import './OrderTableItem.scss'

const OrderTableItem = (props) => {
    const [durationTime, setDurationTime] = useState(0)
    const [isCreated, setIsCreated] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isCooked, setIsCooked] = useState(false)
    const [isServed, setIsServed] = useState(false)
    const [isDanger, setIsDanger] = useState(false)
    const [orderStatus, setOrderStatus] = useState({})
    const cookedRef = useRef(null);

    useEffect(() => {  
        setOrderStatus(props.order.status)
        calcDuration()
        setAnimationDulation(".status-button::before", props.hideTimeAfterCooking)
      } ,[])

    useEffect(() => {  
        setIsCreated( orderStatus === "created")
        setIsCooked(orderStatus === "cooked")
        setIsServed(orderStatus === "served")
    } ,[orderStatus])

    useEffect(() => {
        setIsDanger( durationTime >= props.delayAlertTime )
    }, [durationTime])

    useEffect(() => {
        if(isDanger && props.isDelayAlert) {
            warningSoundPlay('https://www.springin.org/wp-content/uploads/2022/06/%E5%AE%8C%E4%BA%864.mp3')
        }
    }, [isDanger])

    const setAnimationDulation = (selector, dulation) => {
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(selector + " { animation-duration: " + dulation + "s; }", styleSheet.cssRules.length);
    }
    
    const calcDuration = () => {
        let now = new Date()
        let orderTime = new Date(props.order.create_time)
        var diffMillSeconds = now.valueOf()-orderTime.valueOf()
        var diffMinutes = Math.floor(diffMillSeconds/(60*1000))
        setDurationTime(diffMinutes)

        setTimeout(function() {
            calcDuration()
        }, 1000)
    }

    const handleCooked = async () => {
        if( isLoading ) {
            stopCookedOrder()
            setIsLoading(false)
            return;
        }
        setIsLoading(true)
        cookedOrder()
    }

    const stopCookedOrder = () => {
        clearTimeout(cookedRef.current);
        console.log("処理はキャンセルされました。");
    }

    const cookedOrder = async() => {
        let orderData = {
            "check": props.order.check,
            "id": props.order.id,
            "t_num": props.order.t_num,
            "create_time": props.order.create_time,
            "course": props.order.course,
            "menu": props.order.menu,
            "topping": props.order.topping,
            "number": props.order.number,
            "update_time": new Date().toLocaleString(),
            "status": "cooked",
        }
        cookedRef.current = setTimeout(function() {
            updateData(orderData)
            setOrderStatus("cooked")
            setIsLoading(false)
        }, props.hideTimeAfterCooking * 1000)
    }

    const updateData = async(data) => {
        const target = JSON.parse(JSON.stringify(data))
        console.log(JSON.stringify(target))
        const URL = 'https://script.google.com/macros/s/AKfycbyRikSnZjOwMyyclNB7mNo28tT_kDMoA2yCFLCWEQ2haGWdzWs9jDihUrXTB2aBBXA/exec'
        const postParam = {
            "method": 'POST',
            "mode": "no-cors",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(target)
        }
        console.log(postParam)
        await fetch(URL,postParam) 
        .then(res => { 
            console.log(res)
        })
        .catch(err => console.error("error" + err))
    }

    const warningSoundPlay = (url) => {
        var soundObj = new Audio();
        soundObj.onerror = function() {
            alert("再生できませんでした");
        }
        soundObj.src = url;
        soundObj.play();
    }

    if( isCooked || isServed ) {
        return
    }

    return (
        <tr className={`table-item ${ props.spaceLines }`} >
            <td className={`t_num`}>{ props.order.t_num }</td>
            <td className={`time ${ isDanger ? "warning": "" }`}><div >{ durationTime }分経過</div></td>
            { props.isShowCourse && <td className={`course`}>{ props.order.course }</td> }
            <td className={`menu`}>{ props.order.menu }</td>
            { props.isShowTopping && <td className={`topping`} >{ props.order.topping }</td> }
            <td className={`number`}>{ props.order.number }</td>
            <td className={`status`}><a className={`status-button ${props.spaceLins} ${ isLoading ? "cancel-button": ""}`} onClick={() => handleCooked() }>
                { isCreated && !isLoading && <span >調理済にする</span> }
                { isLoading && <span>キャンセル</span> }
            </a></td>
        </tr>
        
    );
};

export default OrderTableItem;