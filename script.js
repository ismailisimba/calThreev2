const server = "https://script.google.com/macros/s/AKfycbxAb_rCj1VVL_gNLrCaP8oXIsFUL-BOGLuXvxH9WudHZ8q1p0fS-MR6gMEquaGQYmeM/exec";
const butt = document.getElementById("getPrem");
const sumEle = document.getElementById("sum-select");
let publicDateVar = 0;



Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});



window.onload = () => {
    const dateVar = new Date().toDateInputValue();
    publicDateVar = dateVar;
    const arr = dateVar.toString().split("-");
    document.getElementById('day').value = arr[2];
    document.getElementById('month').value = arr[1];
    document.getElementById('year').value = arr[0];
    addTermEventListener();
    addGetPremEventListener();
    addPlanEventListener();
    addDateEventListeners()
}

function addTermEventListener () {
    const sumSelect = document.getElementById("sum-select");
    sumSelect.addEventListener("input",()=>{
        checkSumVal(sumSelect);
    })
}

function addPlanEventListener () {
    const planSelect = document.getElementById("plan-select");
    planSelect.addEventListener("input",()=>{
        if(planSelect.value==="Life Plus Plan - With Cash Backs"||planSelect.value==="Life Plus Plan - No Cash Backs"){
            addNumInput();
        }else{
            if(document.getElementById("new-num-input")!==null&&document.getElementById("new-num-input").nodeType){
                document.getElementById("new-num-input").replaceWith(sumEle);
                setTermDefault();
            }

        }
    })
}

function checkSumVal(element){
    switch (element.value) {
        case '5m':
            setTerm(2);
            break;
        case '7.5m':
            setTerm(2);
            break;
        case '10m':
            setTerm(3);
            break;
        case '12.5m':
            setTerm(3);
            break;
        case '15m':
            setTerm(3);
            break;
        case '17.5m':
            setTerm(3);
            break;
        case '20m':
            setTerm(3);
            break;
        default:
            setTermDefault();
      }
}

function setTerm (int){
    switch (int) {
        case 2:
            setTermOne();
            break;
        default:
            setTermTwo();
      }
    
}

function setTermOne () {
    const opt1 = document.createElement("option");
    const opt2 = document.createElement("option");
    const termSelect = document.getElementById("term-select");
    opt1.value = "12 years";
    opt1.innerHTML = " 12 years ";
    opt2.value = "15 years";
    opt2.innerHTML = " 15 years ";
    termSelect.innerHTML = "";
    termSelect.appendChild(opt1);
    termSelect.appendChild(opt2);
}

function setTermTwo () {
    const opt1 = document.createElement("option");
    const opt2 = document.createElement("option");
    const opt3 = document.createElement("option");
    const termSelect = document.getElementById("term-select");
    opt1.value = "12 years";
    opt1.innerHTML = " 12 years ";
    opt2.value = "15 years";
    opt2.innerHTML = " 15 years ";
    opt3.value = "10 years";
    opt3.innerHTML = " 10 years ";
    termSelect.innerHTML = "";
    termSelect.appendChild(opt3);
    termSelect.appendChild(opt1);
    termSelect.appendChild(opt2);
}


function setTermDefault () {
    const opt1 = document.createElement("option");
    const termSelect = document.getElementById("term-select");
    opt1.value = "def";
    opt1.innerHTML = "  *Please choose a sum first.* ";
    termSelect.innerHTML = "";
    termSelect.appendChild(opt1);
}


function addGetPremEventListener(){
    const getPremBut = document.getElementById("getPrem");
    getPremBut.addEventListener("click",()=>{
        const obj1 = {}
        obj1["name"] = document.getElementById("name").value;
        obj1["age"] = `${document.getElementById("year").value}-${document.getElementById("month").value}-${document.getElementById("day").value}`;
        obj1["planSelected"] = document.getElementById("plan-select").value;
        if(document.getElementById("new-num-input")!==null&&document.getElementById("new-num-input").nodeType){
            obj1["sumSelected"] = document.getElementById("new-num-input").value;
        }else{
            obj1["sumSelected"] = document.getElementById("sum-select").value;
        }
        obj1["termSelected"] = document.getElementById("term-select").value;
        checkReadyToGo(obj1);
    })
}


function checkReadyToGo(obj1){
    if(obj1.planSelected !== "def"&&obj1.sumSelected !== "def"&&obj1.termSelected !== "def"){
        startAnimation();
        fetchInfoWithFilter (obj1,"getPremium").then((obj)=>{
            showPremium(obj);
        });
    }else{
       // alert("Please make sure you've chosen a plan, term, and sum assured.")
        showCustomPopUp("Please make sure you've chosen a plan, term, and sum assured.");
    }
}


async function fetchInfoWithFilter (data,para) {

    data = JSON.stringify(data);
      
  
    var myRequest = new Request(server+"?paraOne="+para);
    
  
         
    const returnVal = await fetch(myRequest, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: {
        //'Content-Type': 'text/txt'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: data // body data type must match "Content-Type" header
    })
          .then(function(response) {
            if (!response.ok) {
              
              throw new Error("HTTP error, status = " + response.status);
              
            }
            
            return response.text();
          })
          .then(function(myBlob) {
            
            var cloudObject = JSON.parse(myBlob);
            
          
            return cloudObject;
            
          })
          .catch(function(error) {
           console.log(error.message)
          });
  
        
         // document.querySelectorAll(".mycolumns")[1].innerHTML = returnVal;
          return returnVal; 
  
      // tempDiv.innerHTML = Object.entries(localVar.values)[0][1][3] ;   
  };


  function showPremium(obj){
      stopAnimation().then(()=>{
          if(obj.premium==="tooyoung"){
               // alert("you have to be at least 18 years old!");
                showCustomPopUp("you have to be at least 18 years old!");
          }else if(obj.premium==="tooold"){
           // alert("you have to be less than 60 years old!");
            showCustomPopUp("you have to be less than 60 years old!")
          }else if(obj.planSelected==="Life Plus Plan - No Cash Backs"||obj.planSelected==="Life Plus Plan - With Cash Backs"){
            document.querySelectorAll(".premiumprice")[0].innerHTML = `<br>
            You are ${obj.age} years old.<br><br>
            Your premium price is ${obj.premium} Tshs.<br>
            Total premium collected is ${obj.newObj.premTot} Tshs.<br><br>
            Guranteed sum is ${obj.sumSelected} Tshs.<br><br>
            Revisionary Bonus is ${obj.newObj.revBonus} Tshs.<br><br>
            Terminal Bonus is ${obj.newObj.termBonus} Tshs.<br><br>
            Total Cashback is ${obj.newObj.cashBackTot} Tshs.<br><br>
            Full Maturity Value is ${obj.newObj.fullMaturity} Tshs.<br><br>`
          }else{
            document.querySelectorAll(".premiumprice")[0].innerHTML = `<br>
            You are ${obj.age} years old.<br><br>
            Your premium price is ${obj.premium} Tshs.<br>
            Total premium collected is ${obj.newObj.premTot} Tshs.<br><br>
            Guranteed sum is ${obj.sumSelected} Tshs.<br><br>
            Revisionary Bonus is ${obj.newObj.revBonus} Tshs.<br><br>
            Terminal Bonus is ${obj.newObj.termBonus} Tshs.<br><br>
            Total Cashback is ${obj.newObj.cashBackTot} Tshs.<br><br>
            Full Maturity Value is ${obj.newObj.fullMaturity} Tshs.<br><br>`
          }
        
      });
     

  };

  function  startAnimation(){
      butt.style.visibility = "collapse";
      document.getElementById("loadanime").style.visibility = "visible";
  };


async  function  stopAnimation(){
    butt.style.visibility = "visible";
    document.getElementById("loadanime").style.visibility = "collapse";
};


function addNumInput (){
    const numEle = document.createElement("input");
    numEle.id="new-num-input";
    numEle.min = 40000000;
    numEle.type = "number";
    numEle.placeholder = 40000000;
    numEle.step = 1000000;
    numEle.addEventListener("change",()=>{
        if(numEle.value<40000000){
            numEle.value=40000000;
            showCustomPopUp("The Life Plus Plan is only for sums of 40m and higher.");
        }
    })
    sumEle.replaceWith(numEle);
    setTerm(3);
}


function showCustomPopUp(text){
    const myText = document.createElement("span");
    myText.id = "span";
    const mom = document.querySelectorAll("#customalert")[0];
    myText.innerHTML = text;

    const stale = mom.querySelectorAll("#span");
    if(stale.length>0){
        stale.forEach(ele=>{ele.remove()});
    }

    mom.appendChild(myText);
    mom.style.display = "block";
    document.getElementById("closebutton_calThree211810").addEventListener("click",()=>{
        mom.style.display = "none";
    })
}


function addDateEventListeners(){
    const dayEl = document.getElementById("day");
    const monthEl = document.getElementById("month");
    dayEl.addEventListener("input",(e)=>{
        if(e.target.value.length<=1){

        }else if(e.target.value<1||e.target.value>31){
            e.target.value=1;
            showCustomPopUp("Only Day 1 to 31 are supported");
        }
    })

    monthEl.addEventListener("input",(e)=>{
        if(e.target.value.length<=1){

        }else if(e.target.value<1||e.target.value>12){
            e.target.value=1;
            showCustomPopUp("Only Month 1 to 12 are supported");
        }
    })
}