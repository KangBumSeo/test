import React from "react";
import ReactDOM from 'react-dom/client';
import { dataList } from "../DataList";
import tableHtml from "../bview/Main";

export default function BoAddClick(){
    return(
        <div>
             <div>
                <div>NAME : <input id='AddUserName' onKeyPress={enterKey} /> </div>
             </div>
             <div>
                <div>AGE : <input id='Age' onKeyPress={enterKey} /> </div>
             </div>
             <div>
                <div>ETC : <input id='Etc' onKeyPress={enterKey}  /> </div>
             </div>
             <button onClick={BoAddSubmit}> 등록 </button>
        </div>
    )
}

const enterKey = (e) => {if(e.key === 'Enter') BoAddSubmit()};


export function BoAddSubmit(prop){
    //const tableTarget = document.getElementById("mainTable");
    const tableTarget = document.getElementById("root");
    const tableTest = ReactDOM.createRoot(tableTarget);

    console.log(tableTest)
    
    const userName = document.getElementById("AddUserName").value;
    const age = document.getElementById("Age").value;
    const etc = document.getElementById("Etc").value

    console.log(userName);
    console.log(age);
    console.log(etc);

    if( userName !== '' && age !== '' && etc !== ''){
        const fn_append_data = {
            userName : userName,
            age : age ,
            etc : etc ,
        }

        dataList.push(fn_append_data);

        tableTest.render(tableHtml());
        //tableTest.render(fn_createRoot);
    }
    else{
        alert("값은 전체 다 채우셔야합니다.");
    }
}

