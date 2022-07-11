import React from "react";
import { dataList } from "../DataList";

export default function boList(){

    return ( 
        dataList.map(function(v,i){
            return(
            <tr>
                <td key={'n_'+i}> {v.userName} </td>
                <td key={'a_'+i}> {v.age} </td>
                <td key={'e_'+i}> {v.etc} </td>
            </tr>
            )
        })
     )
}
/*

*/