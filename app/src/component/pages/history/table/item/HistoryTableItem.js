import React, { useState, useEffect, useRef }from 'react';
import './HistoryTableItem.scss'

const HistoryTableItem = (props) => {
    const [isCreated, setIsCreated] = useState(false)
    const [isCooked, setIsCooked] = useState(false)
    const [isServed, setIsServed] = useState(false)

    useEffect(() => {  
        setIsCreated(props.order.status === "created")
        setIsCooked(props.order.status === "cooked")
        setIsServed(props.order.status === "served")
    } ,[props.order.status])

    if( isCreated ) {
        return
    }

    return (
        <tr className={`history-table-item ${ props.spaceLines }`} >
            <td className={`t_num`}>{ props.order.t_num }</td>
            <td className={`time`}><div >{ props.order.create_time }</div></td>
            { props.isShowCourse && <td className={`course`}>{ props.order.course }</td> }
            <td className={`menu`}>{ props.order.menu }</td>
            { props.isShowTopping && <td className={`topping`} >{ props.order.topping }</td> }
            <td className={`number`}>{ props.order.number }</td>
            <td className={`status`}>
                { isCooked && <span >調理済</span> }
                { isServed && <span>配膳済</span> }
            </td>
        </tr> 
    );
};

export default HistoryTableItem;