import React from 'react';
import './DeleteData.scss'

const DeleteData = () => {

    return (
        <div className= {`dataClearArea settingArea`}>
            <p className={`settingItem`}>データ</p>
            <div className={`dataClearAreaContent section`}>
                <p className={`section-title`}>データクリア</p>
                <button className={`dataClearAreaContent-btn`}>注文データを削除する</button>
            </div>
        </div>
    );
};

export default DeleteData;