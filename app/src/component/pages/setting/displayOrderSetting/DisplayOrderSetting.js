import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import './DisplayOrderSetting.scss'

const DisplayOrderSetting = (props) => {
    const [displayOrderTurns, setDisplayOrderTurns] = useState("")
    const [spaceLines, setSpaceLines] = useState("")
    const [hideTimeAfterCooking, setHideTimeAfterCooking] = useState(3)
    const [previousHideTimeAfterCooking, setPreviousHideTimeAfterCooking] = useState(3)
    const [isShowCourse, setIsShowCourse] = useState(false)
    const [isShowTopping, setIsShowTopping] = useState(false)

    const updateTurnURL = "https://script.google.com/macros/s/AKfycbyQGPZEdsWTTIIae4fEpMQ4m4gbPGKNxHbumE9GWply1vNuaU-WlCHQ057KJjx7YzOi/exec"
    const updateSpaceLinesURL = "https://script.google.com/macros/s/AKfycbyWb-WZhIW-Jzg70jlsGApxreVR-T_eBzHTTv80k5MmdzlKKJB4fVvhwDJxbtYWk94/exec"
    const updateHideTimeAfterCookingURL = "https://script.google.com/macros/s/AKfycbyHQh2OBCoRO1kSbtb3YbW7ze7FOtEl7xWhnfeFhj4Y8aWzHy7SxmyOke2DuGHOt4_l/exec"
    const updateIsShowCourseURL = "https://script.google.com/macros/s/AKfycbxNyDaUhPMooQmUBGTQIikn1FBMV7sPkog22KJftTG6dodaDcpNaG4JmGSL23c6iiY/exec"
    const updateIsShowToppingURL = "https://script.google.com/macros/s/AKfycbzrRdGQnnEk5qq_YRIpYYE80DOexIYzX6s8UFqXCuqEUOGYP3viy0sCNaZ5z--xKuA/exec"

    useEffect(() => {
        setDisplayOrderTurns(props.displayOrderTurns)
    }, [props.displayOrderTurns])

    useEffect(() => {
        setSpaceLines(props.spaceLines)
    }, [props.spaceLines])

    useEffect(() => {
        setHideTimeAfterCooking(props.hideTimeAfterCooking)
        setPreviousHideTimeAfterCooking(props.hideTimeAfterCooking)
    }, [props.hideTimeAfterCooking])

    useEffect(() => {
        setIsShowCourse(props.isShowCourse)
    }, [props.isShowCourse])

    useEffect(() => {
        setIsShowTopping(props.isShowTopping)
    }, [props.isShowTopping])


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
    
    const changeDisplayOrderTurns = (inputOrderTurns) => {
        setDisplayOrderTurns(inputOrderTurns)
        const postData = `{"display_order_turns": "` + inputOrderTurns + `"}`;
        updateData(postData, updateTurnURL);
    }

    const changeSpaceLines = (inputSpaceLines) => {
        setSpaceLines(inputSpaceLines)
        const postData = `{"space_lines": "` + inputSpaceLines + `"}`;
        updateData(postData, updateSpaceLinesURL);
    }

    const changeHideTimeAfterCooking = (inputHideTimeAfterCooking) => {
        const regex = /^\d+$/;
        if ( inputHideTimeAfterCooking > 100 ) {
            inputHideTimeAfterCooking = 100;
        }
        if (hideTimeAfterCooking === previousHideTimeAfterCooking) {
            return
        }
        if(!regex.test(inputHideTimeAfterCooking)) {
            inputHideTimeAfterCooking = previousHideTimeAfterCooking;
            return
        }
        setHideTimeAfterCooking(inputHideTimeAfterCooking)
        const postData = `{"hide_time_after_cooking": "` + inputHideTimeAfterCooking + `"}`;
        updateData(postData, updateHideTimeAfterCookingURL).then(result => {
            if (result) {
                setPreviousHideTimeAfterCooking(inputHideTimeAfterCooking)
            };
        });
        
    }

    const validationHideTimeAfterCooking =(inputHideTimeAfterCooking) => {
        const regex = /^\d+$/
        if(!regex.test(inputHideTimeAfterCooking)) {
            setHideTimeAfterCooking("")
        } else {
            setHideTimeAfterCooking(inputHideTimeAfterCooking)
        }
    }

    const changeIsShowCourse = (inputIsShowCource) => {
        setIsShowCourse(inputIsShowCource);
        const postData = `{"is_show_course": "` + inputIsShowCource.toString() + `"}`;
        updateData(postData, updateIsShowCourseURL)
    }

    const changeIsShowTopping = (inputIsShowTopping) => {
        setIsShowTopping(inputIsShowTopping);
        const postData = `{"is_show_topping": "` + inputIsShowTopping.toString() + `"}`;
        updateData(postData, updateIsShowToppingURL);
    }

    return (
        <div className={`displayOrderArea settingArea`}>
            <p className={`settingItem`}>注文表示</p>
            <div className={`displayOrderTurns section`}>
                <p className={`section-title`}>並び順</p>
                <div className={ `select-input-wrapper` }>
                    <select className={`section-input displayOrderTurns-input`} value={displayOrderTurns} onChange= {e => changeDisplayOrderTurns(e.target.value)}>
                        <option value="oldest">注文が古い順</option>
                        <option value="newest">注文が新しい順</option>
                    </select>
                </div>
            </div>
            <div className={`spaceLines section`}>
                <p className={`section-title`}>行間</p>
                <div className={ `select-input-wrapper` }>
                    <select className={`section-input spaceLines-input`} value={spaceLines} onChange={e => changeSpaceLines(e.target.value)}>
                        <option value="low">低</option>
                        <option value="medium">中（デフォルト）</option>
                        <option value="high">高</option>
                    </select>
                </div>
            </div>
            <div className={`hideTimeAfterCooking section`}>
                <p className={`section-title`}>調理済後<br />非表示時間</p>
                <input className={`section-input hideTimeAfterCooking-input`} 
                        type="text" 
                        value={hideTimeAfterCooking} 
                        placeholder="3" 
                        onChange={ e => validationHideTimeAfterCooking(e.target.value) }
                        onBlur={ e => changeHideTimeAfterCooking(e.target.value)} />
                秒
            </div>
        
            <div className={ `show-course section` }>
                <p className = { `section-title` }>コース名表示</p>
                <label className = {`toggle-area`}>
                    <Toggle
                        checked={ isShowCourse }
                        icons={false}
                        className={ `toggle-button input-show-cource`}
                        onChange={ e => changeIsShowCourse(e.target.checked) } 
                         />
                    <span>{ isShowCourse ? "on":"off"}</span>
                </label>
            </div>
            <div className={ `show-topping section` }>
                <p className = { `section-title` }>トッピング表示</p>
                <label className = {`toggle-area`}>
                    <Toggle
                        checked={ isShowTopping }
                        icons={false}
                        className={ `toggle-button input-show-topping`}
                        onChange={ e => changeIsShowTopping(e.target.checked) } />
                    <span>{ isShowTopping ? "on":"off"}</span>
                </label>
            </div>
        </div>
    );
};

export default DisplayOrderSetting;