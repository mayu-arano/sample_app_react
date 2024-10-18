import React, { useState, useEffect }  from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";
import './SearchArea.scss'

registerLocale("ja", ja);

const SearchArea = (props) => {
    const [hourList, setHourList] = useState([]);
    const [tableName, setTableName] = useState("")
    const endDate = new Date()
    const startDate = new Date(endDate.getDate() + 7)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState("すべて")
    const [isCooked, setIsCooked] = useState(false)
    const [isServed, setIsServed] = useState(false)

    const searchHandler = () => {
        let searchParam = {
            searchTableName: tableName,
            searchDate: selectedDate,
            searchTime: selectedTime,
            searchCookedData: isCooked,
            searchServedData: isServed,
            searchAllStatusData: !(isCooked||isServed),
        }
        props.handleChangeSerchParam(searchParam)
    }

    const clearSearchParam = () => {
        const clearSearchParam = {
            searchTableName: "",
            searchDate: null,
            searchTime: "すべて",
            searchCookedData: false,
            searchServedData: false,
            searchAllStatusData: !(isCooked||isServed),
        }
        props.handleChangeSerchParam(clearSearchParam)
    }

    const clearSearchHandler = () => {
        setTableName("")
        setSelectedDate(null)
        setSelectedTime("すべて")
        setIsCooked(false)
        setIsServed(false)
        clearSearchParam()
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
      };

    useEffect(() => {
        getHourList();
        clearSearchHandler();
    },[])

    const getHourList = () => {
        let tempHourList = []
        for(let i = 0; i<24; i++){
            tempHourList.push(zeroFill(i, 2)+"時台")
        }
        tempHourList.push("すべて")
        setHourList(tempHourList);
    }

    const zeroFill = (number, width) => {
        width -= number.toString().length;
        if (width > 0){
            return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + "";
    }

    const optionHourList = () => {
        return  hourList.map( hour => 
            <option key={hour} value={hour}>{ hour }</option>
        )
    }

    return (
        <div className={`search`}>
            <div className={`search-table-id`}>
                <dt className={`search-item`}>テーブル番号</dt>
                <dd><input className={`search-input`} value={ tableName } onChange={e => setTableName(e.target.value)}/></dd>
            </div>
            <div className={`search-date`}>
                <dt className={`search-item`}>注文日時</dt>
                <dd className={`search-input`}>
                <DatePicker
                    locale="ja"
                    selected={ selectedDate }
                    dateFormatCalendar="yyyy年 MM月"
                    dateFormat="yyyy-MM-dd"
                    onChange={ handleDateChange }
                    className="date-picker"
                    placeholderText= {new Date().toLocaleDateString('sv-SE') }
                    minDate={startDate}
                    maxDate={endDate}
                    />
                <select className={`search-date-time`} 
                        value={selectedTime}
                        onChange={e => setSelectedTime(e.target.value)}>
                        { optionHourList() }
                </select>
            </dd>
        </div>
        <div className={`search-status`}>
            <div className={`check-cooked check-item`}>
                <label>
                    <input className={`checkbox`} type="checkbox" checked={ isCooked } onChange={e => setIsCooked(e.target.checked)}/>
                    <span className={`label`}>調理済</span>
                </label>
            </div>
            <div className={`check-served check-item`}>
                <label>
                    <input className={`checkbox`} type="checkbox" checked={ isServed } onChange={e => setIsServed(e.target.checked)}/>
                    <span className={`label`}>配膳済</span>
                </label>
            </div>
        </div>
        <div className={`search-buttons`}>
            <button className={`button clear-button`} onClick={clearSearchHandler}>クリア</button>
            <button className={`button search-button`} onClick={searchHandler}>検索</button>
        </div>
    </div>
    );
};

export default SearchArea;