import React from 'react';
import "./Header.css";

type Props = {
    tab: string,
    setTab: Function
}

function Header (props: Props) {
    return (
        <div id="header-wrapper">
            <div id="header">
                <div id="title">
                    <p>Discute ai</p>
                </div>
                <div id="tabs">
                    <span onClick={() => props.setTab("list")}>
                        Lista
                    </span>
                    <span onClick={() => props.setTab("create")}>
                        Criar
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Header;