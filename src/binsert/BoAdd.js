import React from "react";
import ReactDOM from 'react-dom/client';


export default function BoAddClick(){
    return(
        <div>
            <addList>
             <tr>
                <td>NAME : <input id='AddUserName'  /> </td>
             </tr>
             <tr>
                <td>AGE : <input id='Age'  /> </td>
             </tr>
             <tr>
                <td>ETC : <input id='Etc'  /> </td>
             </tr>
             <button onClick={BoAddSubmit}> 등록 </button>
            </addList>
        </div>
    )
}

export function BoAddSubmit(prop){
    const tableTarget = document.getElementById("mainTable");
    const tableTest = ReactDOM.createRoot(tableTarget);

    console.log(tableTest)
    
    const userName = document.getElementById("AddUserName").value;
    const age = document.getElementById("Age").value;
    const etc = document.getElementById("Etc").value

    console.log(userName);
    console.log(age);
    console.log(etc);

    const fn_createRoot = 
    (
            <tr>
                <td key={0}>{userName}</td>
                <td key={0}>{age}</td>
                <td key={0}>{etc}</td>
            </tr>
    );
    
    tableTest.render(fn_createRoot);
}

