function addNewExpense(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    const expenseDetails = {
        expenseamount: form.get("expenseamount"),
        description: form.get("description"),
        category: form.get("category")

    }
    const token = localStorage.getItem('token');
    console.log(expenseDetails)
    axios.post('http://localhost:3000/user/addexpense', expenseDetails, { headers: { "Authorization": token } }).then((response) => {

        if (response.status === 201) {
            addNewExpensetoUI(response.data.expense);
        } else {
            throw new Error('Failed To create new expense');
        }

    }).catch(err => showError(err))

}

window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/user/getexpenses', { headers: { "Authorization": token } }).then(response => {
        if (response.status === 200) {
            response.data.expenses.forEach(expense => {

                addNewExpense(expense);
            })
        } else {
            throw new Error();
        }
    })
});

function addNewExpensetoUI(expense) {
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenseamount} - ${expense.category} - ${expense.description}
            <button onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
}

function deleteExpense(e, expenseid) {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/user/deleteexpense/${expenseid}`, { headers: { "Authorization": token } }).then((response) => {

        if (response.status === 204) {
            removeExpensefromUI(expenseid);
        } else {
            throw new Error('Failed to delete');
        }
    }).catch((err => {
        showError(err);
    }))
}

function showError(err) {
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

function removeExpensefromUI(expenseid) {
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}


var orderId;
$(document).ready(function () {
    var settings = {
        "url": "/create/orderId",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "amount": "500"
        }),
    };


    //check out
    document.getElementById('rzp-button1').onclick = function (e) {

        var options = {
            "key": rzp_test_kbY8LbSkn1wCGQ, // Enter the Key ID generated from the Dashboard
            "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Sadik shaik ",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the previous step
            "handler": function (response) {
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature)

                var settings = {
                    "url": "/api/payment/verify",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({ response }),
                }

            },


            //change theme clor
            "theme": {
                "color": "#3399cc"
            }
        };
        //for failed transaction
        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });
        e.preventDefault();
    }

    //creates new orderId everytime
    $.ajax(settings).done(function (response) {

        orderId = response.orderId;
        console.log(orderId);
        $("button").show();
    });
});
window.addEventListener('load',(e)=>{
     const flag =localStorage.getItem('premiummember')
     const leaderboard = document.getElementsByClassName('leaderboard');
     if(flag==true){
         
         leaderboard.style.display="flex";
         axios.get('http://localhost:3000/leaderboadrs').then((result) => {
           
            for(let x in result){
                let element =document.createElement('li');
                li.textcontent=x
                leaderboard.appendChid(element);
            }

         }).catch((err) => {
             console.log(error);
         });

     }
     else{
          leaderboard.style.display="none";
     }
})
function download(){
    axios.get('http://localhost:3000/user/download')
    .then((response) => {
        if(response.status === 201){
          
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}
