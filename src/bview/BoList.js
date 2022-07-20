import React from "react";
import { dataList } from "../DataList";

export default function boList(){

    return ( 
        dataList.map(function(v,i){
            return(
            <tr key={i}>
                <td key={v.userName}> {v.userName} </td>
                <td key={v.age}> {v.age} </td>
                <td key={v.etc}> {v.etc} </td>
            </tr>
            )
        })
     )
}
/*

*/