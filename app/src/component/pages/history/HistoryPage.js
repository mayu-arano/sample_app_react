import React, { useState } from 'react';
import HistoryTable from './table/HistoryTable';
import SearchArea from './search/SearchArea'

const HistoryPage = () => {
    const [searchParam, setSearchParam] = useState({
        searchTableName: "",
        searchDate: null,
        searchTime: "すべて",
        searchCookedData: false,
        searchServedData: false,
        searchAllStatusData: true
    });

    const handleChangeSerchParam = (inputSerchParam) => {
        setSearchParam(inputSerchParam)
    }

    return (
        <div>
            <SearchArea handleChangeSerchParam={handleChangeSerchParam}></SearchArea>
            <HistoryTable searchParam = {searchParam}></HistoryTable>
        </div>
    );
};

export default HistoryPage;