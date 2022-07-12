import React from "react";
import BoAddClick from "../binsert/BoAdd";
import BoList from "./BoList";
import BoAdd from "./BoList"

export default function mainHtml(){
    
    return (
        <>
            <p> 게시판 메인</p>
            <br/>
           {tableHtml()}
            <BoAddClick/>
        </>        
    )
}

export function tableHtml(){
    return (
        <table id="mainTable" ref={BoAdd}>
            <BoList/>
        </table>
    )
}
