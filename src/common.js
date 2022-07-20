/** 20220711 
 *  ICM2팀 강범서
 */

// runAjax 전역변수 
let setAsync = true;
let setDataType = 'json';
let setClickTarget = '';
let setHeader = '';
let setToken = '';
let setLoadingTarget = '';
let setLoadingCss = '';

/** ajax 커스텀마이징
 * @param fnUrl : 요청Url
 * @param fnParam : 요청시 필요데이터
 * @param fnType : post, get 방식중 어느것인지 
 * @returns result : 요청데이터 
 */
function runAjax( fnUrl , fnParam , fnType ){
	if( fnType === '' || !fnType ){ fnType = 'post'};
	
	$.ajax({
        url: fnUrl ,
        type: fnType ,
        data: JSON.stringify(fnParam) ,
        dataType : setDataType ,
        async : setAsync ,
        contentType: "application/json",
        beforeSend : ( xhr ) => {
        	if( fnUrl === ''   || 	fnType === '' ){
        		xhr.abort();
        		throw new Error ( '호출시 문제가 발생 했습니다.' );
        		return ;
        	}
        	//ajax 연속클릭으로 인한 중복호출 방지 
        	// submit ID값으로 강제 설정 
        	if(setClickTarget !='' ){ $('#'+setClickTarget).unbind('click'); }
        	
        	/** 토큰을 이용하여 호출시 사용 
        	 * setHeader : 토큰 헤더값
        	 * setToken : 토큰값
        	 */
        	if( setHeader != '' && setToken != '' ){
        		xhr.setRequestHeader( setHeader, setToken );
        	}
        	// 로딩 CSS 추가 가능
        	if( setLoadingTarget != '' && setLoadingTarget ){ $('#'+setLoadingTarget).addClass(setLoadingCss); }
        },
        complete : () => {
        	// 로딩 CSS 추가 가능
        	if( setLoadingTarget != '' && setLoadingTarget ){ $('#'+setLoadingTarget).removeClass(setLoadingCss); }
        },
        success: (result) => {
                if(setClickTarget !='' ){ $('#'+setClickTarget).bind('click'); }
                return result;
        },
        error:  ( request , status , error) => {
        	throw new Error( request.responseText )
        }
    });
	// 초기화 작업 
	setAsync = true;
	setDataType = 'json';
	setClickTarget = '';
}

/** ajax 요청시 로딩화면 필요시 셋팅 함수
 * @param fnLoadingTarget : 로딩 CSS 가 올라와야하는 타겟 ( ID값으로 고정 )
 * @param fnLoadingCss : 로딩 CSS 클래스명 
 * @returns void
 */
runAjax.setLoding = ( fnLoadingTarget , fnLoadingCss ) => {
	setLoadingTarget = fnLoadingTarget;
	setLoadingCss = fnLoadingCss;
}

/** ajax 요청시 토큰셋팅 필요시 호출 함수
 * @param fnHeader : 전달 헤더값
 * @param fnToken :  토큰값
 * @returns void
 */
runAjax.setToken = ( fnHeader , fnToken ) => {
	setHeader = fnHeader;
	setToken = fnToken;
}

/** 연속적 호출을 막기 위한 호출함수
 * @param fnTarget : 연속호출 막아야할 클릭 대상 ( ID값으로 고정 )
 * @returns void
 */
runAjax.setClickTarget = (fnTarget) =>{
	setClickTarget = fnTartget;
}

/** 동기식 , 비동기식 선택 함수 ( ajax 호출 후 true로 재셋팅 )
 * @returns void
 */
runAjax.setAsync = () => {
	setAsync = false;
}

/** ajax 호출시 dataType 셋팅 함수 ( 기본 json ) 
 * 서버에서 요청 후 반환값을 설정 
 * fnDataType : xml, html , json , script , text
 * @returns void
 */
runAjax.setDataType = ( fnDataType ) =>{
	setDataType = fnDataType;
}

/** 세션스토리지 선언 함수
 * 선언시 만약의 경우를 대비해 이전 스토리지 기록 확인하여 제거 작업
 * @returnss void
 */
function sess(){
	var sessLong = sessionStorage.length;
	if(sessLong != 0){
		sessionStorage.clear(); 
	}
}

/** 세션스토리지 전체삭제
 * 세션스토리지가 존재시에 삭제
 * @returnss void
 */
sess.cls = () => {
	var sessLong = sessionStorage.length;
	if(sessLong != 0){
		sessionStorage.clear(); 
	}
}

/** 세션스토리지 셋팅 작업. 
 * 세션이 연결 종료시 데이터는 삭제 된다.
 * 데이터는 보안에 위배되지 않는 데이터 삽입필요
 * 
 *  fn_data ( Map || Arr ) 두개의 데이터 삽입 가능
 * 
 *  Arr의 경우 전체 데이터를 문자열화 시켜 데이터적재
 *	셋팅 키값 : fnArrSetKey
 *
 *  Map의 경우 데이터를 반복문을 이용하여 Key,Value 값 저장 
 * 
 * @returns void
 */
sess.add = ( fn_data , fnArrSetKey ) => {
	try{
		if( Array.isArray(fn_data)){
			if( fnArrSetKey != "" && fnArrSetKey ){
				sessionStorage.setItem( fnArrSetKey , JSON.stringify(fn_data))
			}
			else{
				throw new Error('Key 값이 없습니다.');
			}
		}
		else if( typeof fn_data === 'object' ){
			if( fnArrSetKey != "" && fnArrSetKey ){
				throw new Error('Key 셋팅이 잘 못 되었습니다.');
			}
			else{
				$.each( fn_data , (i,v) => {
					sessionStorage.setItem( String(i) , String(v) );
				}); // end each
			}
		}
		else{
			throw new Error('세팅 재확인 부탁드립니다.');
		}
	}
	catch(e){
		console.log(e)
	}
}

/** 세션스토리지 전체데이터 호출 
 * 
 * fnKey : 특정 데이터 추출시 
 * 
 * @returns String and Map
 */
sess.get = ( fnKey ) => {
	try{
		var reData;
		if( fnKey != "" && fnKey ){
			reData = sessionStorage.getItem( fnKey );
			if( reData === '' ){return '';}
		}
		else{
			var sessList = sessionStorage;
			reData = {};
			if(sessList.length != 0){
				$.each( sessList , (i,v) => {
					if( !sess.basicKeyEx(i) ){
						reData[i] = sessionStorage.getItem( i );					
					}
				});
			}
			else{
				return '';
			}
		}
		return reData ;
	}catch(e){
		console.log(e);
	}
}

/** 세션스토리지 삭제 함수
 * fnDelKey 를 기준으로 삭제진행
 * @returns void 
 */
sess.del = ( fnDelKey ) => {
	try{
		if(fnDelKey && fnDelKey != ""){
			sessionStorage.removeItem(fnDelKey)
		}
		else{
			throw new Error('Not Target Key');
		}
	}catch(e){
		console.log(e);
	}
}

/** 세션 기본 키 값 제외함수
 * @returns boolean 
 */
sess.basicKeyEx = ( fnData ) => {
	var bool = false; 
	if( 
		fnData === "clear"		||
		fnData === "getItem"	||
		fnData === "key"		||
		fnData === "length"		||
		fnData === "removeItem"	||
		fnData === "setItem"
	){		bool = true ; 		}
	else{		bool = false;		}
	return bool;
}

/** 검색 입력값 분류 함수 
 * 입력값을 한글만 입력 또는 영문 입력 등 분류하기 위한 함수
 * en , kr , all , phon , s ( 공백 ), ss( 특수기호 )
 * cs ( 함수에 전달된 값 /내용/ 중 '/'문자를 제외한 내용만 )
 * 
 *  글자를 변경할 가능성도 생각 필요 
 *  @param fnInit : 입력값 
 *  @param fnSet : 정규식 분류값 ( en,kr ... )
 *  @param fnAlertMess : 정규식에 해당 했을시 경고창 
 * @returns boolean
 */
function initDataChk( fnInit , fnSet , fnAlertMess){
	
	if( fnSet === '' || !fnSet ){ return true; };
	if( fnAlertMess != '' && fnAlertMess ){  alert( String(fnAlertMess) ) };
	
	const regEx = regularExpression(fnSet);
	return regEx.test( fnInit );
}

/** 검색 입력값 분류 함수 
 * 입력값을 한글만 입력 또는 영문 입력 등 분류하기 위한 함수
 * en , kr , all , phon , s ( 공백 ), ss( 특수기호 )
 * num ( 숫자 )
 * 
 *  글자를 변경할 가능성도 생각 필요 
 * @returns regular expression ( 정규식 )
 */
function regularExpression( fnPatterns , fnFlags ){
	let patternStr = '';
	let flagsStr = '';

	patternStr = regularExpression.getPattern( fnPatterns );
	flagsStr = regularExpression.getFlags( fnPatterns );
	
	const regex = new RegExp( patternStr , flagsStr );
	
	return regex;
}

/** 정규식 패턴함수
 * fnPatterns : 패턴 선택  ','를 추가하여 다량의 패턴 선택 
 * @returns String ( 패턴정보 )
 */
regularExpression.getPattern = ( fnPatterns ) => {
	let returnRegstr = '[';
	let patterns = fnPatterns.split(',');
	
	$.each( patterns , ( i , v ) => {
		switch( v ){
			case 'en' 	: 	returnRegstr += 'a-zA-Z'; 											break;
			case 'kr' 	:	returnRegstr += 'ㄱ-ㅎ가-힣'; 											break;
			case 'num' 	:	returnRegstr += '0-9'; 												break;
			case 'phon' :	returnRegstr += '\d{3}-\d{4}-\d{4}';  								break;
			case 's'	:	returnRegstr += '\s'; 												break;
			case 'ss' 	:	returnRegstr += '\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"';	break;
		}// end swihch
	});
	returnRegstr += ']';
	return returnRegstr;
}

/** 정규식 플레그함수
 * fnFlags : 플레스 선택 
 * 예) gim 3가지 한번에 선택 가능 
 * @returns String ( 플레그정보 )
 */
regularExpression.getFlags = ( fnFlags ) => {
	let returnFlagstr = '';
	
	if( !fnFlags && fnFlags === '' ){ return returnFlagstr = 'g' }
	
	for( i = 0 ; i < fnFlags.length ; i++){
		switch( fnFlags.substr( i , 1 ) ){
			case 'g' 	: 	returnFlagstr += 'g'; 												break;
			case 'i' 	:	returnFlagtr += 'i'; 												break;
			case 'm' 	:	returnFlagstr += 'm'; 												break;
		}// end swihch
	}
	return returnFlagstr;
}

// 날짜 구하기위한 함수 선언부분
function dateSet(){}

/** 금일 날짜 구하기 위한 함수
 *  fnDateFormet : 형식별 -,/ 등 추가 가능
 *  @returns String
 */
dateSet.getNowDate = ( fnDateFormet ) => {
	let today = new Date();   

	let year = today.getFullYear(); // 년도
	let month = today.getMonth() + 1;  // 월
	let date = today.getDate();  // 날짜
	let returnDate = '';

	if( fnDateFormet != '' && fnDateFormet ){
		returnDate = year + fnDateFormet + month + fnDateFormet + date;
	}
	else{ returnDate = year + month + date }
}

/** 이전 날짜 구하는 함수
 *  fnSettingDate : y -> 년 , m -> 월 , d -> 일
 * 	fnSettingDateNum : 얼만큼 이전인지 구하는 값 ( 기본 셋팅 값은 1이다 ) 
 * 
 *  fnDateFormet : 형식별 -,/ 등 추가 가능
 *  @returns String
 */
dateSet.getBeforeDate = ( fnSettingDate , fnSettingDateNum , fnDateFormet ) => {
	if( fnSettingDateNum === '' || !fnSettingDateNum ){ fnSettingDateNum = 1; }
	let today = new Date();   

	let year =  fnSettingDate === 'y' ? today.getFullYear() - fnSettingDateNum : today.getFullYear() ; // 년도
	let month = fnSettingDate === 'm' ? today.getMonth() + 1 - fnSettingDateNum : today.getMonth() + 1 ;  // 월
	let date =  fnSettingDate === 'd' ? today.getDate() - fnSettingDateNum : today.getDate() ;  // 날짜
	let returnDate = '';

	if( fnDateFormet != '' && fnDateFormet ){
		returnDate = year + fnDateFormet + month + fnDateFormet + date;
	}
	else{ returnDate = year + month + date }
}

/** 이후 날짜 구하는 함수
 *  fnSettingDate : y -> 년 , m -> 월 , d -> 일
 * 	fnSettingDateNum : 얼만큼 이후인지 구하는 값 ( 기본 셋팅 값은 1이다 ) 
 * 
 *  fnDateFormet : 형식별 -,/ 등 추가 가능
 *  @returns String
 */
dateSet.getNextDate = ( fnSettingDate , fnSettingDateNum , fnDateFormet ) => {
	if( fnSettingDateNum === '' || !fnSettingDateNum ){ fnSettingDateNum = 1; }
	let today = new Date();   

	let year =  fnSettingDate === 'y' ? today.getFullYear() +  fnSettingDateNum : today.getFullYear() ; // 년도
	let month = fnSettingDate === 'm' ? today.getMonth() + 1 + fnSettingDateNum : today.getMonth() + 1 ;  // 월
	let date =  fnSettingDate === 'd' ? today.getDate() +      fnSettingDateNum : today.getDate() ;  // 날짜
	let returnDate = '';

	if( fnDateFormet != '' && fnDateFormet ){
		returnDate = year + fnDateFormet + month + fnDateFormet + date;
	}
	else{ returnDate = year + month + date }
}


/** jsp와 js 역활분담 분리 작업 필요
 *  
 * 결재버튼 js 수정 필요 ( make_url , paymet )
 * 
 * 화면 UI도 사이즈 조절 핑요 
 * ( 결재라인 표출되는 부분이 수정이 필요하다. ) 
 *  
 * java 부분은 결재라인이 어느정도 영향도 있는지 파악 필요
 * 예) 다음 결재자 데이터 적재 부분 , 이메일 발송 부분 , 패키지 부분 
 *  
 *  최종결재시 API호출 영역도 조건에 영향을 주는지 확인 필요 
 *  예) 다음결재자가 없을 시 무조건 API를 호출하게 되어있으므로 확인 필요 
 *  
 *  
 *  
 */

/*  
 * 
 * 
 * RTIM_APL_APPR_LINE ( 최대한 여기서 해결 ) 
 * RTIM_APL_ASSET 테이블은 건드릴 수 없다. ( 데이터가 변경 되는 순간에 모든 로직 변경 필요 )
 * 기본 조건은 신청서번호와 APPR_CD 값으로 생각해야한다.
 * rtim_code_detail 테이블에서 해당 자산 데이터 추출작어 필요.
 * 다음 결재자 insert 부분도 반복문 필요 . ( 무조건 1개여도 N개여도 똑같이 반복문 작업 )
 *  
 * 결재라인 표현부분에 공간여유 확인 필요 ( 디자인 부분 )
 * 담당자가 3명이 결재대기중 일 경우 신청서양식 부분에서 3명의 역활을 분리 할지 확인 필요 ( 1명은 자료만 올릴 수 있고 1명은 내용 추가만 1명은 내용수정만 이런역활 분담하는지 ) 
 * 
 * 부서장이 결재 후 담당자가 ACT000이 3명
 * 기존로직은 건들지 않고 작업진행 해야한다.  
 * JAVA로만 결재를 진행한다. ( count 확인이 어려워진다. )
 * DB로 작업 했을 때에는 데이터 추가하는 작업이 필요 ( ACT000 결재대기자 인원 체크 컬럼 필요 ) -> RTIM_APL_ASSET 테이블( 패키지 카운터와 두개의 카운터가 생겨 헷갈 릴가능성 상승 ) 
 * PROG_YN 값을 건들수는 없다. ( 패키지 신청서의 경우 현재 PROG_YN값을 N으로 변경하여 진행 중 ) 
 * 
 * 그러면 화면에서 작업 할지 백에서 작어할지 선택
 * 
 * 뺵에서 작업해야한다.
 * 
 * -- 결재버튼 클릭하여 결재 완료 데이터를 적재 했을 때 필요  
 * 담장자 3명이 결재가 진행이 되지 않을 경우 다음결재자 데이터를 추가 하지 않는다.
 * APPR_SQCD값을 건드리는 작업도 제외필요
 * 
 * 다음 결재자 추출하는 작업을 제외 할수 있는지 ( 확인 필요 ) 
 * 만약 제외 했을시 다음 결재자가 없는걸로 판단할 경우일 시 다른 방법으로 진행
 * 
 * 화면에서 버튼 로직 수정 필요 ( 현재 1명의 타켓으로 작업이 셋팅되어 있어 전체적으로 변경 필요 함 )
 * 
 * 결재라인 화면에 표현하는 부분도 수정 필요 
 * 
 * 
 * -- 결재버튼 클릭 했을 시 특수 자산만 다른 서비스로 옴기는 방법 ( 소스 수정에 비효율  , 트랙젝션도 재셋팅 필요 유무 )
 */
